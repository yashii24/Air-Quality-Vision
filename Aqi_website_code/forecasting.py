import pandas as pd
from datetime import timedelta
import difflib

def forecast_next_days(df, model, target_col="PM25", hours=72, station=None, start_time=None):
    """
    Forecast next 'hours' of air quality data for a given station.
    Works with one-hot encoded station columns and preserved 'station_original'.
    """

    def get_station_column(df, station_name: str):
        """Return the one-hot column name matching station_name, or None.

        Matching is case-insensitive and ignores extra spaces. Uses difflib
        to find the closest one-hot column if an exact match is not present.
        """
        if station_name is None:
            return None
        normalized = " ".join(station_name.strip().split()).lower()
        if "station_original" in df.columns:
            candidates = pd.Series(df["station_original"].unique()).astype(str)
            candidates_norm = candidates.str.strip().str.lower()
            
            exact_idx = candidates_norm[candidates_norm == normalized]
            if not exact_idx.empty:
                orig = candidates.iloc[exact_idx.index[0]]
                return f"station_{orig}"
    
            best = difflib.get_close_matches(normalized, candidates_norm.tolist(), n=1, cutoff=0.7)
            if best:
                
                idx = candidates_norm[candidates_norm == best[0]].index[0]
                return f"station_{candidates.iloc[idx]}"
        
        col_candidate = f"station_{station_name}"
        if col_candidate in df.columns:
            return col_candidate
        
        for c in df.columns:
            if c.lower() == col_candidate.lower():
                return c
        return None

    # if station is not None:
    #     station_col = get_station_column(df, station)
    #     if station_col is None:
    #         raise ValueError(f"Station '{station}' not found in data (no matching one-hot column or station_original entry)")
        
    #     df_station = df[df.get(station_col, 0) == 1]
    #     if df_station.empty:
    #         raise ValueError(f"No data available for station '{station}' after filtering")
    #     df = df_station

    if station is not None:
        station_col = get_station_column(df, station)
        if station_col is None:
            raise ValueError(f"Station '{station}' not found in data")

        

    if df.empty:
        raise ValueError("No data available for forecasting.")

    latest_row = df.iloc[-1:].copy()
    # ✅ Reset all station one-hot columns
    for c in latest_row.columns:
        if c.startswith("station_"):
            latest_row[c] = 0

    # ✅ Activate requested station
    if station is not None:
        latest_row[station_col] = 1
        
    last_timestamp = (
        pd.to_datetime(start_time)
        if start_time is not None
        else df["Timestamp"].max() if "Timestamp" in df.columns else pd.Timestamp.now(tz="UTC")
    )


    drop_cols = ["Timestamp", "_id", "city", "timestamp", target_col, "station_original"]

    if hasattr(model, "feature_names_in_"):
        feature_names = list(model.feature_names_in_)
    else:
        feature_names = latest_row.drop(columns=drop_cols, errors="ignore") \
                                  .select_dtypes(include=["number"]) \
                                  .columns.tolist()

    X_latest = latest_row.drop(columns=drop_cols, errors="ignore")

   
    for col in feature_names:
        if col not in X_latest.columns:
            X_latest[col] = 0

    X_latest = X_latest[feature_names]


    forecasts = []
    for i in range(hours):
        y_pred = float(model.predict(X_latest)[0])
        next_timestamp = last_timestamp + pd.Timedelta(hours=i + 1)

        forecasts.append({
            "Timestamp": str(next_timestamp),
            target_col: y_pred,
            "station": station if station is not None else None
        })

       
        new_row = latest_row.copy()
        new_row["Timestamp"] = next_timestamp
        new_row[target_col] = y_pred
        new_row["lag_1d"] = y_pred
        new_row["lag_2d"] = latest_row.get("lag_1d", y_pred)
        new_row["lag_3d"] = latest_row.get("lag_2d", y_pred)

        latest_row = new_row.copy()
        X_latest = latest_row.drop(columns=drop_cols, errors="ignore")

        for col in feature_names:
            if col not in X_latest.columns:
                X_latest[col] = 0

        X_latest = X_latest[feature_names]

    return pd.DataFrame(forecasts)

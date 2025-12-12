import pandas as pd
import numpy as np



def fill_future(ts, col, lookup, max_years=7):
    for year_offset in range(1, max_years + 1):
        try:
            ts_new = ts.replace(year=ts.year + year_offset)
        except ValueError:
            continue

        if ts_new in lookup:
            val = lookup[ts_new].get(col)
            if pd.notna(val):
                return val
    return np.nan




def preprocess_data(df):

    print("🔹 Starting preprocessing...")
    print(f"📌 Initial DF shape: {df.shape}")

    df1 = df.copy()


    if "timestamp" in df1.columns and "Timestamp" not in df1.columns:
        df1["Timestamp"] = df1["timestamp"]

    if "Timestamp" not in df1.columns:
        raise ValueError("❌ MongoDB data missing 'Timestamp' column.")

    df1["Timestamp"] = pd.to_datetime(df1["Timestamp"], errors="coerce", utc=True)
    df1 = df1.dropna(subset=["Timestamp"])
    df1 = df1.set_index("Timestamp")
    df1 = df1[~df1.index.duplicated(keep="first")]


    if "pollutants" in df1.columns:
        print("🔧 Extracting nested pollutant fields...")
        pollutants_df = df1["pollutants"].apply(lambda x: x if isinstance(x, dict) else {})
        pollutants_df = pd.json_normalize(pollutants_df)

      
        rename_map = {
            "PM25": "PM25",
            "PM2.5": "PM25",
            "pm25": "PM25",
            "pm2_5": "PM25",
            "PM10": "PM10",
            "NO2": "NO2",
            "O3": "O3",
            "SO2": "SO2",
            "CO": "CO",
            "AQI": "AQI"
        }

        pollutants_df = pollutants_df.rename(columns=rename_map)
        df1 = pd.concat([df1, pollutants_df], axis=1)

        
        df1 = df1.drop(columns=["pollutants"], errors="ignore")
    else:
        print("⚠️ No 'pollutants' column found! Pollutant values will be missing.")

    
    pollutant_cols = ["PM25", "PM10", "NO2", "O3", "SO2", "CO", "AQI"]
    pollutant_cols = [c for c in pollutant_cols if c in df1.columns]

    for col in pollutant_cols:
        df1[col] = pd.to_numeric(df1[col], errors="coerce")

    if len(pollutant_cols) == 0:
        raise ValueError("❌ No pollutant columns found after extraction.")


    numeric_cols = df1.select_dtypes(include="number").columns


    lookup = df1.to_dict(orient="index")

    for col in numeric_cols:
        df1[col] = [
            v if pd.notna(v) else fill_future(ts, col, lookup)
            for ts, v in zip(df1.index, df1[col])
        ]


    if len(numeric_cols) > 0:
        df1[numeric_cols] = df1[numeric_cols].interpolate(
            method="linear",
            limit_direction="both"
        )
    else:
        raise ValueError("❌ No numeric columns available for interpolation.")

    print(f"✅ After interpolation: {df1.shape}")


    for col in numeric_cols:
        Q1, Q3 = df1[col].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
        df1[col] = df1[col].clip(lower, upper)

    df1 = df1.reset_index().sort_values("Timestamp")

    df1["hour"] = df1["Timestamp"].dt.hour
    df1["day_of_week"] = df1["Timestamp"].dt.dayofweek
    df1["month"] = df1["Timestamp"].dt.month

    # Seasonal weights
    month_weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.4, 5: 0.2, 6: 0.1,
                     7: 0.1, 8: 0.1, 9: 0.2, 10: 0.6, 11: 0.9, 12: 1.0}
    hour_weights = {i: 0.9 - abs(12 - i) * 0.05 for i in range(24)}

    df1["PM25_month_weight"] = df1["month"].map(month_weights)
    df1["PM25_hour_weight"] = df1["hour"].map(hour_weights)


    if "PM25" not in df1.columns:
        raise ValueError(f"❌ PM25 column missing. Final columns: {df1.columns.tolist()}")

    df1["lag_1d"] = df1["PM25"].shift(24)
    df1["lag_2d"] = df1["PM25"].shift(48)
    df1["lag_3d"] = df1["PM25"].shift(72)

    df1 = df1.dropna(subset=["PM25"])


    if "station" in df1.columns:
        df1["station_original"] = df1["station"]
        df1 = pd.get_dummies(df1, columns=["station"], prefix="station")

    print("✅ Final shape:", df1.shape)
    print("📌 Final columns:", df1.columns.tolist())
    print(df1.head())

    return df1
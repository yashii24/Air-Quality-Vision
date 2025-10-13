# import pandas as pd
# import numpy as np

# def fill_future(ts, col, max_years=7):
#     """Try to fill missing value for a timestamp by looking at future years"""
#     for year_offset in range(1, max_years + 1):
#         try:
#             ts_new = ts.replace(year=ts.year + year_offset)
#         except ValueError:
#             continue
#         if ts_new in lookup:
#             val = lookup[ts_new].get(col)
#             if pd.notna(val):
#                 return val
#     return np.nan

# def preprocess_data(file_path="air_quality.hourly_data.csv"):

#     import pandas as pd

#     # Try safe CSV read
#     df_raw = pd.read_csv(
#         file_path,
#         low_memory=True,   # avoids dtype guessing issues
#         on_bad_lines="skip", # skips malformed rows
#         encoding="utf-8"     # force UTF-8
#     )

#     print("Raw shape:", df_raw.shape)
#     print(df_raw.head())
    
#     global lookup
#     df_raw = pd.read_csv(file_path)

#     print("Raw shape:", df_raw.shape)
#     print(df_raw.head())

#     df1 = df_raw.copy()

#     df1['Timestamp'] = pd.to_datetime(df1['timestamp'], errors="coerce", utc=True)
#     df1 = df1.dropna(subset=['Timestamp'])  # optional but recommended

#     df1.set_index('Timestamp', inplace=True)

#     # Remove fully NA cols/rows
#     df1 = df1.loc[:, ~(df1.isna()).all()]
#     df1 = df1.loc[~(df1.isna()).all(axis=1)]


#     df1 = df1[~df1.index.duplicated(keep="first")]
#     # Lookup for filling future values
#     # lookup = {ts: df1.loc[ts].to_dict() for ts in df1.index}
#     lookup = df1.to_dict(orient="index")

#     print(df1.index.is_unique)   # should be True
#     print(df1[df1.index.duplicated()])  # see duplicate rows



#     # Fill missing values
#     numeric_cols = df1.select_dtypes(include='number').columns
#     for col in numeric_cols:
#         df1[col] = [
#             val if pd.notna(val) else fill_future(ts, col)
#             for ts, val in zip(df1.index, df1[col])
#         ]

#     # Interpolation
#     df1 = df1.infer_objects(copy=False)
#     df1.interpolate(method='linear', limit_direction='both', inplace=True)
#     print("✅ After interpolation shape:", df1.shape)
#     print(df1.head())

#     # Outlier clipping
#     for col in numeric_cols:
#         Q1, Q3 = df1[col].quantile([0.25, 0.75])
#         IQR = Q3 - Q1
#         lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
#         df1[col] = df1[col].clip(lower, upper)

#     # Reset index
#     df1 = df1.reset_index().sort_values("Timestamp")

#     # Temporal features
#     df1['hour'] = df1['Timestamp'].dt.hour
#     df1['day_of_week'] = df1['Timestamp'].dt.dayofweek
#     df1['month'] = df1['Timestamp'].dt.month

#     # if "station" in df1.columns:
#     # df1 = pd.get_dummies(df1, columns=["station"], prefix="station")

#     # Seasonal weights
#     month_weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.4, 5: 0.2, 6: 0.1,
#                      7: 0.1, 8: 0.1, 9: 0.2, 10: 0.6, 11: 0.9, 12: 1.0}
#     hour_weights = {i: 0.9 - abs(12 - i) * 0.05 for i in range(24)}

#     df1['PM2.5_month_weight'] = df1['month'].map(month_weights)
#     df1['PM2.5_hour_weight'] = df1['hour'].map(hour_weights)

#     # Lag features (1,2,3 days)
#     target_col = "pollutants.PM25"  # <-- matches your CSV

#     if target_col in df1.columns:
#         df1["lag_1d"] = df1[target_col].shift(24)
#         df1["lag_2d"] = df1[target_col].shift(48)
#         df1["lag_3d"] = df1[target_col].shift(72)
#     else:
#         print(f"⚠️ Target column {target_col} not found in data. Columns available: {df1.columns.tolist()}")


#     # Only drop rows where target is missing
#     df1 = df1.dropna(subset=[target_col])

#     if "station" in df1.columns:
#         df1 = pd.get_dummies(df1, columns=["station"], prefix="station")



#     print("✅ Final training shape:", df1.shape)
#     print("✅ Columns for training:", df1.columns.tolist())
#     print(df1.head())

#     return df1

import pandas as pd
import numpy as np

# -------------------------------
# Helper function
# -------------------------------
def fill_future(ts, col, lookup, max_years=7):
    """Try to fill missing value for a timestamp by looking at future years"""
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


# -------------------------------
# Main preprocessing function
# -------------------------------
def preprocess_data(df_raw: pd.DataFrame):
    """
    Preprocess data fetched from MongoDB.
    Assumes columns: 'Timestamp', 'station', and 'pollutants.PM25'
    """

    print("🔹 Starting preprocessing...")

    df1 = df_raw.copy()

    # Ensure Timestamp column exists
    if "Timestamp" not in df1.columns:
        raise ValueError("❌ Missing 'Timestamp' column in MongoDB data.")

    df1["Timestamp"] = pd.to_datetime(df1["Timestamp"], errors="coerce", utc=True)
    df1 = df1.dropna(subset=["Timestamp"])
    df1.set_index("Timestamp", inplace=True)

    # Remove fully NA cols/rows
    df1 = df1.loc[:, ~(df1.isna()).all()]
    df1 = df1.loc[~(df1.isna()).all(axis=1)]

    # Remove duplicate timestamps
    df1 = df1[~df1.index.duplicated(keep="first")]

    # Prepare lookup for fill_future
    lookup = df1.to_dict(orient="index")

    # Fill missing values
    numeric_cols = df1.select_dtypes(include="number").columns
    for col in numeric_cols:
        df1[col] = [
            val if pd.notna(val) else fill_future(ts, col, lookup)
            for ts, val in zip(df1.index, df1[col])
        ]

    # Interpolate missing values
    # df1 = df1.infer_objects(copy=False)
    df1.interpolate(method="linear", limit_direction="both", inplace=True)
    print("✅ After interpolation shape:", df1.shape)

    # Outlier clipping
    for col in numeric_cols:
        Q1, Q3 = df1[col].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        lower, upper = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
        df1[col] = df1[col].clip(lower, upper)

    # Reset index
    df1 = df1.reset_index().sort_values("Timestamp")

    # Temporal features
    df1["hour"] = df1["Timestamp"].dt.hour
    df1["day_of_week"] = df1["Timestamp"].dt.dayofweek
    df1["month"] = df1["Timestamp"].dt.month

    # Seasonal weights
    month_weights = {1: 1.0, 2: 0.8, 3: 0.6, 4: 0.4, 5: 0.2, 6: 0.1,
                     7: 0.1, 8: 0.1, 9: 0.2, 10: 0.6, 11: 0.9, 12: 1.0}
    hour_weights = {i: 0.9 - abs(12 - i) * 0.05 for i in range(24)}

    df1["PM2.5_month_weight"] = df1["month"].map(month_weights)
    df1["PM2.5_hour_weight"] = df1["hour"].map(hour_weights)

    # Lag features (1, 2, 3 days)
    target_col = "PM25"

    if target_col in df1.columns:
        df1["lag_1d"] = df1[target_col].shift(24)
        df1["lag_2d"] = df1[target_col].shift(48)
        df1["lag_3d"] = df1[target_col].shift(72)
    else:
        print(f"⚠️ Target column {target_col} not found in data. Columns available: {df1.columns.tolist()}")

    # Drop rows with missing target
    df1 = df1.dropna(subset=[target_col])

    # One-hot encode station if available
    if "station" in df1.columns:
        df1["station_original"] = df1["station"]
        df1 = pd.get_dummies(df1, columns=["station"], prefix="station")
    else:
        print("⚠️ 'station' column not found — skipping one-hot encoding")
        
    print("✅ Final training shape:", df1.shape)
    print("✅ Columns for training:", df1.columns.tolist())
    print(df1.head())

    return df1

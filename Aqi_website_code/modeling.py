import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error
from pandas.api.types import is_datetime64_any_dtype


def train_model(df, target_col=None):
    print("\n================== MODEL TRAINING START ==================\n")

    # 1️⃣ Basic checks
    if df is None or df.empty:
        raise ValueError("❌ Input DataFrame is EMPTY — cannot train model")

    print("📌 Initial DF shape:", df.shape)

    # 2️⃣ Timestamp check
    if "Timestamp" not in df.columns:
        raise ValueError("❌ Missing 'Timestamp' column")

    df["Timestamp"] = pd.to_datetime(df["Timestamp"], utc=True, errors="coerce")
    df = df.dropna(subset=["Timestamp"])

    # 3️⃣ Detect target column
    possible_targets = ["PM25", "pm25", "pollutants.PM25"]
    if target_col is None:
        target_col = next((c for c in possible_targets if c in df.columns), None)

    if target_col is None:
        raise ValueError("❌ No PM25 column found in data")

    print(f"✅ Using target column: {target_col}")

    # 4️⃣ Multi-year or fallback split
    years = sorted(df["Timestamp"].dt.year.unique())
    print("📌 Years available in data:", years)

    if len(years) >= 2:
        # Train on all years except last
        last_year = years[-1]
        print(f"📌 Training on years < {last_year}, testing on year {last_year}")

        train_df = df[df["Timestamp"].dt.year < last_year]
        test_df = df[df["Timestamp"].dt.year == last_year]
    else:
        # Only one year → 80/20 time split
        print("⚠️ Only one year in dataset — using 80/20 time split")
        df = df.sort_values("Timestamp")
        split_idx = int(len(df) * 0.8)
        train_df = df.iloc[:split_idx]
        test_df = df.iloc[split_idx:]

    print("📌 Train size:", train_df.shape, " Test size:", test_df.shape)

    if train_df.empty:
        raise ValueError("❌ No training data found after split")

    # 5️⃣ Remove non-feature columns
    drop_cols = ["Timestamp", "_id", "city", target_col, "timestamp"]
    X_train = train_df.drop(columns=[c for c in drop_cols if c in train_df], errors="ignore")
    y_train = train_df[target_col]

    X_test = test_df.drop(columns=[c for c in drop_cols if c in test_df], errors="ignore")
    y_test = test_df[target_col]

    # Keep only numeric columns
    X_train = X_train.select_dtypes(include=["number"])
    X_test = X_test.select_dtypes(include=["number"])

    if X_train.shape[1] == 0:
        raise ValueError("❌ No numeric columns available to train")

    # 6️⃣ Train model
    print("📌 Final Training Features:", list(X_train.columns))
    print("📌 X_train:", X_train.shape, " X_test:", X_test.shape)

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
        max_depth=None
    )
    model.fit(X_train, y_train)

    # Predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test) if not X_test.empty else []

    train_r2 = r2_score(y_train, y_pred_train)

    if len(y_test) > 0:
        test_r2 = r2_score(y_test, y_pred_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    else:
        test_r2, rmse = None, None

    print(f"\n✅ Training R²={train_r2:.3f}")
    if test_r2 is not None:
        print(f"📌 Test R²={test_r2:.3f}  RMSE={rmse:.3f}")
    else:
        print("⚠️ No test metrics available")

    print("\n================== MODEL TRAINING END ==================\n")

    return {
        "model": model,
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
        "y_pred_train": y_pred_train,
        "y_pred_test": y_pred_test if len(y_pred_test) > 0 else None,
        "train_r2": train_r2,
        "test_r2": test_r2,
        "rmse": rmse,
    }

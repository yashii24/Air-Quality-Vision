import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error

def train_model(df, target_col=None):
    possible_targets = ["pollutants.PM25", "PM25", "pm25"]
    if target_col is None:
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                break
        else:
            raise ValueError(f"❌ None of {possible_targets} found in data columns: {df.columns.tolist()}")

    print(f"✅ Using target column: {target_col}")


    last_year = df['Timestamp'].dt.year.max()
    train_df = df[df['Timestamp'].dt.year < last_year]
    test_df  = df[df['Timestamp'].dt.year == last_year]

    drop_cols = ["Timestamp", target_col, "_id", "city", "timestamp"]

    X_train = train_df.drop(columns=[c for c in drop_cols if c in train_df.columns])
    y_train = train_df[target_col]

    X_test = test_df.drop(columns=[c for c in drop_cols if c in test_df.columns])
    y_test = test_df[target_col]

    # Keep only numeric features
    X_train = X_train.select_dtypes(include=["number"])
    X_test  = X_test.select_dtypes(include=["number"])


    print("✅ Training features:", X_train.columns.tolist()[:10], "...")  # preview
    print("✅ Number of features:", X_train.shape[1])
    print("✅ Train shape:", X_train.shape, "Test shape:", X_test.shape)

    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

     # Compute metrics (guard if test set is empty)
    train_r2 = r2_score(y_train, y_pred_train)
    # if y_test.shape[0] > 0:
    if len(y_test) > 0:
        test_r2 = r2_score(y_test, y_pred_test)
        # compute RMSE by taking sqrt of MSE (avoids using 'squared' keyword)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    else:
        test_r2 = None
        rmse = None
        print("⚠️ No test samples for year", last_year)

    results = {
        "model": model,
        "X_train": X_train, "y_train": y_train,
        "X_test": X_test, "y_test": y_test,
        "y_pred_train": y_pred_train, "y_pred_test": y_pred_test,
        # "train_r2": r2_score(y_train, y_pred_train),
        # "test_r2": r2_score(y_test, y_pred_test),
        # "rmse": mean_squared_error(y_test, y_pred_test, squared=False)
        "train_r2": train_r2,
        "test_r2": test_r2,
        "rmse": rmse
    }


    rmse_str = f"{rmse:.3f}" if rmse is not None else "0.000"
    print(f"✅ Model training complete — R²(train)={train_r2:.3f}, RMSE={rmse_str}")
    return results

import pandas as pd
from ml_api import load_data_from_mongo
from preprocessing import preprocess_data
from modeling import train_model
from joblib import dump

# Load & preprocess data
df = load_data_from_mongo()
df = preprocess_data(df)

# Train model
results = train_model(df)

# Save model + feature columns
dump(results["model"], "pm25_model.pkl")
dump(list(results["X_train"].columns), "feature_cols.pkl")

print("✅ Model and feature columns saved")

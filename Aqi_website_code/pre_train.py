import pandas as pd
from ml_api import load_data_from_mongo, preprocess_data
from modeling import train_model
from joblib import dump

# Load & preprocess data
df = load_data_from_mongo()
df = preprocess_data(df)

# Train model
results = train_model(df)
model = results["model"]

# Save trained model
dump(model, "pm25_model.pkl")
print("✅ Model trained and saved as pm25_model.pkl")

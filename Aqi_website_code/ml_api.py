import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import pandas as pd
from pymongo import MongoClient
from preprocessing import preprocess_data
from modeling import train_model
from forecasting import forecast_next_days
from datetime import datetime
from joblib import load
from dotenv import load_dotenv


load_dotenv()


# ------------------------------
# ENV VARIABLES (Render)
# ------------------------------
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

STATE = {"df": None, "model": None, "feature_cols": None}


# ------------------------------
# Load Data from MongoDB
# ------------------------------
def load_data_from_mongo():
    print("🔹 Connecting to MongoDB...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    collection = client[DB_NAME][COLLECTION_NAME]

    print("🔹 Fetching limited dataset...")
    cursor = collection.find(
        {},
        {
            "_id": 0,
            "station": 1,
            "city": 1,
            "timestamp": 1,
            "pollutants": 1,
        }
    ).sort("timestamp", -1).limit(3000)

    df = pd.DataFrame(list(cursor))
    df["station_original"] = df["station"]
    print(f"✅ Loaded {len(df)} rows")

    if df.empty:
        return df

    # Extract pollutant JSON → columns
    if "pollutants" in df.columns:
        pollutants_df = pd.json_normalize(df["pollutants"])
        df = pd.concat([df.drop(columns=["pollutants"]), pollutants_df], axis=1)

    # Normalize column names
    rename_map = {
        "PM2.5": "PM25",
        "pm25": "PM25",
        "PM10": "PM10",
        "NO2": "NO2",
        "O3": "O3",
        "SO2": "SO2",
        "CO": "CO",
        "AQI": "AQI",
    }
    df.rename(columns=rename_map, inplace=True)

    # Fix timestamp
    if "timestamp" in df.columns:
        df.rename(columns={"timestamp": "Timestamp"}, inplace=True)

    # df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")

    df["Timestamp"] = pd.to_datetime(
        df["Timestamp"],
        errors="coerce",
        utc=True
   )


    # Remove missing target values
    if "PM25" in df.columns:
        df.dropna(subset=["PM25"], inplace=True)
    else:
        raise ValueError("❌ PM25 column missing from MongoDB data.")

    return df


# ------------------------------
# App lifespan: load data + train model once
# ------------------------------
@asynccontextmanager
async def lifespan(app):
    print("🚀 Starting ML API...")
    df = load_data_from_mongo()

    if df.empty:
        print("⚠️ Empty DB → Skipping training")
        # STATE["df"] = pd.DataFrame()
        # STATE["model"] = None
        # STATE["feature_cols"] = []
        yield
        return

    # df = preprocess_data(df)
    # results = train_model(df)

    # STATE["df"] = df
    # STATE["model"] = results["model"]
    # STATE["feature_cols"] = list(results["X_train"].columns)

    # print("✅ Model trained and ready.")
    # yield

    df = preprocess_data(df)

    STATE["df"] = df
    STATE["model"] = load("pm25_model.pkl")
    STATE["feature_cols"] = load("feature_cols.pkl")

    print("✅ Model loaded successfully")
    yield

# ------------------------------
# FastAPI App
# ------------------------------
app = FastAPI(
    title="AQI ML API",
    version="1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# ------------------------------
# ROUTES
# ------------------------------

@app.get("/")
def root():
    return {"message": "AQI ML API is running. Use /health or POST /forecast"}


@app.get("/health")
def health():
    return {
        "model_loaded": STATE["model"] is not None,
        "rows": len(STATE["df"]) if STATE["df"] is not None else 0
    }


class ForecastRequest(BaseModel):
    station: str
    hours: int = 72


# 

@app.post("/forecast")
def forecast(req: ForecastRequest):
    print(f"🔮 Forecast → {req.station} ({req.hours}h)")

    out = forecast_next_days(
        df=STATE["df"],
        model=STATE["model"],
        target_col="PM25",
        hours=req.hours,
        station=req.station,
        start_time=pd.Timestamp(datetime.now())
    )

    return {
        "station": req.station,
        "forecast": out.to_dict(orient="records")
    }
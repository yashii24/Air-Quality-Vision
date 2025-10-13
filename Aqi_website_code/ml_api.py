# from pathlib import Path
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from preprocessing import preprocess_data
# from modeling import train_model
# from forecasting import forecast_next_days
# from contextlib import asynccontextmanager
# from datetime import datetime
# import pandas as pd
# import joblib


# DATA_PATH = Path(__file__).with_name("air_quality.hourly_data.csv")

# STATE = {"df": None, "model": None, "feature_cols": None}

# @asynccontextmanager
# async def lifespan(app):
#     # preprocess + train once at startup
#     df = preprocess_data(DATA_PATH)
#     results = train_model(df)
#     STATE["df"] = df
#     STATE["model"] = results["model"]
#     STATE["feature_cols"] = list(results["X_train"].columns)
#     yield

# app = FastAPI(title="AQI ML API", version="1.0", lifespan=lifespan)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], 
#     allow_methods=["*"], 
#     allow_headers=["*"], 
#     allow_credentials=True
# )





# @app.get("/health")
# def health():
#     return {
#         "ok": STATE["model"] is not None,
#         "rows": 0 if STATE["df"] is None else len(STATE["df"])
#     }

# class ForecastRequest(BaseModel):
#     station: str 
#     hours: int = 72 

# @app.post("/forecast")
# def forecast(req: ForecastRequest):


#     if STATE["df"] is None:
#         return {"error": "Model not trained yet"}

#     start_timestamp = pd.to_datetime(datetime.now())    

#     # days = max(1, req.hours // 24)  # Ensure at least 1 day
#     try:
#         out = forecast_next_days(
#             STATE["df"],
#             STATE["model"],
#             target_col="pollutants.PM25",
#             hours=req.hours,
#             station=req.station,
#             start_time=start_timestamp,
#         )
#     except ValueError as e:
#         return {"error": str(e)}

#     return {
#         "station": req.station,
#         "start_time": str(start_timestamp),
#         "forecast": out.to_dict(orient="records")
#     }


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

# MongoDB connection
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "air_quality"
COLLECTION_NAME = "hourly_data"

STATE = {"df": None, "model": None, "feature_cols": None}


def load_data_from_mongo():
    """Fetch limited, relevant data from MongoDB."""
    print("🔹 Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    collection = client[DB_NAME][COLLECTION_NAME]

    print("🔹 Fetching data from MongoDB...")
    # Fetch only the required fields
    cursor = collection.find(
        {},
        {
            "_id": 1,
            "station": 1,
            "city": 1,
            "timestamp": 1,
            "pollutants": 1,
        }
    ).limit(50000)  # or a smaller number

    df = pd.DataFrame(list(cursor))

    print(f"✅ Loaded {len(df)} rows from MongoDB.")
    print("📊 Columns in MongoDB data:", df.columns.tolist()) 

    if df.empty:
        return df

    # Flatten nested pollutants dictionary into separate columns
    if "pollutants" in df.columns:
        pollutants_df = pd.json_normalize(df["pollutants"])
        df = pd.concat([df.drop(columns=["pollutants"]), pollutants_df], axis=1)

    if "timestamp" in df.columns:
        df.rename(columns={"timestamp": "Timestamp"}, inplace=True)


    if "Timestamp" in df.columns:
        df["Timestamp"] = pd.to_datetime(df["Timestamp"], errors="coerce")
    else:
        raise ValueError("❌ No timestamp column found in MongoDB data.")


    target_col = "PM25"  # Update this if your Mongo uses different key like "pm25"
    if target_col in df.columns:
        df.dropna(subset=[target_col], inplace=True)
    else:
        print(f"⚠️ Column '{target_col}' not found in data. Available columns: {df.columns.tolist()}")
    
    print(f"✅ After cleaning: {len(df)} rows, columns: {df.columns.tolist()[:10]}")
    return df


@asynccontextmanager
async def lifespan(app):
    """Runs once on startup: loads Mongo data + trains model."""
    df = load_data_from_mongo()
    if df.empty:
        print("⚠️ MongoDB returned no data. Skipping model training.")
        STATE["df"] = pd.DataFrame()
        STATE["model"] = None
        STATE["feature_cols"] = []
        yield
        return
    df = preprocess_data(df)  # You’ll update this next
    results = train_model(df)

    STATE["df"] = df
    STATE["model"] = results["model"]
    STATE["feature_cols"] = list(results["X_train"].columns)
    yield


app = FastAPI(title="AQI ML API", version="1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/health")
def health():
    return {
        "ok": STATE["model"] is not None,
        "rows": 0 if STATE["df"] is None else len(STATE["df"]),
    }


class ForecastRequest(BaseModel):
    station: str
    hours: int = 72


@app.post("/forecast")
def forecast(req: ForecastRequest):
    if STATE["df"] is None or STATE["model"] is None:
        return {"error": "Model not trained yet"}

    
    print(f"🔮 Forecast request received: station={req.station}, hours={req.hours}")
    print("🧠 Model trained on columns:", STATE["feature_cols"][:5])
    print("📊 DataFrame shape before forecast:", STATE["df"].shape)
    if "station_original" in STATE["df"].columns:
        print("📊 Sample stations in df:", STATE["df"]["station_original"].unique()[:10])
    else:
        print("⚠️ No 'station_original' column found. Available columns:", STATE["df"].columns.tolist())

    try:
        start_timestamp = pd.Timestamp(datetime.now())
        out = forecast_next_days(
            STATE["df"],
            STATE["model"],
            target_col="PM25",
            hours=req.hours,
            station=req.station,
            start_time=start_timestamp,
        )

        print("✅ Forecast output sample:", out.head() if not out.empty else "⚠️ Empty DataFrame")

    except ValueError as e:
        print("❌ Forecast error:", e)
        return {"error": str(e)}

    return {
        "station": req.station,
        "start_time": str(start_timestamp),
        "forecast": out.to_dict(orient="records"),
    }

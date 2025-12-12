from pymongo import MongoClient
import pandas as pd

# -------------------------------
# 1️⃣ Connect to MongoDB
# -------------------------------
MONGO_URI = "mongodb://localhost:27017/air_quality"  # replace with your URI
DB_NAME = "air_quality"       # replace with your DB name
COLLECTION_NAME = "hourly_data"  # replace with your collection

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

print("🔹 Connected to MongoDB.")

# -------------------------------
# 2️⃣ Fetch all documents
# -------------------------------
data = list(collection.find({}))  # fetch all documents
print(f"🔹 Total documents fetched: {len(data)}")

# -------------------------------
# 3️⃣ Load into pandas DataFrame
# -------------------------------
df = pd.DataFrame(data)

if df.empty:
    print("⚠️ DataFrame is empty! Check your collection or query filters.")
else:
    print("✅ DataFrame loaded successfully.")
    print("📊 Columns:", df.columns.tolist())
    print("🖖 First 5 rows:")
    print(df.head())

# -------------------------------
# 4️⃣ Ensure Timestamp is datetime
# -------------------------------
if 'Timestamp' in df.columns:
    df['Timestamp'] = pd.to_datetime(df['Timestamp'], errors='coerce')
    print("✅ 'Timestamp' column converted to datetime.")
    print(df['Timestamp'].head())
else:
    print("⚠️ No 'Timestamp' column found in data.")

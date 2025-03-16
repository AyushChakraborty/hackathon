from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["dummy_test_db"]
users_collection = db["users"]

# Insert dummy users (only run once)
users_collection.insert_many([
    {"username": "user1", "password": "password123"},
    {"username": "testuser", "password": "secure456"}
])

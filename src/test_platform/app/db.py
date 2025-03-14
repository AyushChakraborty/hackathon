from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["dummy_test_db"]
from flask import Blueprint, jsonify, request
import json
from app.db import db
from app.models import test_data
from pymongo import MongoClient

api = Blueprint("api", __name__)
client = MongoClient("mongodb://localhost:27017")

activity_db = client["actitvity_db"]
activity_collection = activity_db["activity"]


db.tests.replace_one({"test_id": test_data["test_id"]}, test_data, upsert=True)

@api.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = db["users"].find_one({"username": username})

    if user and user["password"] == password:
        return jsonify({"message": "Login successful", "token": "dummy-token"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@api.route("/test/<test_id>", methods=["GET"])
def get_test(test_id):
    test = db.tests.find_one({"test_id": test_id}, {"_id": 0})

    if not test:
        return jsonify({"error": "Test not found!"}), 404
    return jsonify(test)

@api.route("/test/<test_id>/submit", methods=["POST"])  #once the post is handled this will be active
def submit_test(test_id):
    data = request.json
    submission = {
        "test_id": test_id,
        "answers": data.get("answers", [])
    }

    db.responses.insert_one(submission)
    print(submission)
    print("Received answers:", data)
    return jsonify({"message": "Submission received"}), 200

@api.route('/api/behavior', methods=['POST'])
def log_behavior():
    activityData = request.get_json()

    with open('activity.json', 'a') as f:
        json.dump(activityData, f)
        f.write('\n')

    print("Behavioral Data Received:", activityData)
    # You can process/store here or hand off to another service
    return jsonify({"status": "success"}), 200

@api.route("/tests", methods=["GET"])
def get_all_tests():
    tests = list(db.tests.find({}, {"_id": 0, "test_id": 1, "title": 1}))
    return jsonify(tests), 200
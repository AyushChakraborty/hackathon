from flask import Blueprint, jsonify, request
from app.db import db
from app.models import test_data

api = Blueprint("api", __name__)

db.tests.replace_one({"test_id": test_data["test_id"]}, test_data, upsert=True)

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

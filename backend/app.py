from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from checkin import process_checkin
from points import get_points, add_points
from triage import smart_triage

app = Flask(__name__)
CORS(app)  # allows your React frontend to call this

# Load baseline clinic data
def load_clinics():
    with open("../src/data/clinics.json") as f:
        return json.load(f)

def save_clinics(clinics):
    with open("../src/data/clinics.json", "w") as f:
        json.dump(clinics, f, indent=2)

# GET /clinics — frontend calls this to get all clinics
@app.route("/clinics", methods=["GET"])
def get_clinics():
    return jsonify(load_clinics())

# POST /checkin — user submits a wait time report
@app.route("/checkin", methods=["POST"])
def checkin():
    data = request.json
    # expects: { "clinic_id": 3, "reported_wait": 25, "user_id": "abc123" }

    clinic_id = data.get("clinic_id")
    reported_wait = data.get("reported_wait") or 0
    user_id = data.get("user_id")

    if not clinic_id or not user_id:
        return jsonify({"error": "Missing fields"}), 400

    # Update the clinic's wait time
    clinics = load_clinics()
    updated_clinics, message = process_checkin(clinics, clinic_id, reported_wait)
    save_clinics(updated_clinics)

    # Award points to the user
    new_total = add_points(user_id, "checkin", reported_wait)

    return jsonify({
        "message": message,
        "points_earned": 15,
        "total_points": new_total["total"]
    })

# GET /points/<user_id> — frontend calls this to show points balance
@app.route("/points/<user_id>", methods=["GET"])
def user_points(user_id):
    return jsonify(get_points(user_id))

@app.route("/triage", methods=["POST"])
def triage():
    data = request.json
    symptoms = data.get("symptoms", "")

    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    if len(symptoms) > 500:
        return jsonify({"error": "Input too long"}), 400

    # Process and discard — never stored
    result = smart_triage(symptoms)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
import json
import os
from datetime import datetime, date

POINTS_FILE = "points.json"

# Points awarded per action
POINTS_MAP = {
    "checkin": 15,
    "first_checkin": 50,  # bonus for very first ever
    "streak": 25,
    "referral": 30,
}

# Reward milestones
MILESTONES = [
    {"points": 100,  "reward": "$5 Augie Bookstore Credit"},
    {"points": 250,  "reward": "Free Coffee at Campus Café"},
    {"points": 500,  "reward": "$15 Bookstore Credit"},
    {"points": 1000, "reward": "Priority Check-in Badge"},
]

def load_points():
    if not os.path.exists(POINTS_FILE):
        return {}
    with open(POINTS_FILE) as f:
        return json.load(f)

def save_points(data):
    with open(POINTS_FILE, "w") as f:
        json.dump(data, f, indent=2)

def add_points(user_id, action, reported_wait=None):
    """Award points and check for milestones"""
    data = load_points()

    # First time user?
    if user_id not in data:
        data[user_id] = {
            "total": 0,
            "checkin_count": 0,
            "last_checkin_date": None,
            "milestones_reached": []
        }
        # Bonus for first ever check-in
        data[user_id]["total"] += POINTS_MAP["first_checkin"]

    user = data[user_id]
    earned = POINTS_MAP.get(action, 0)

    # Streak bonus — checked in yesterday too?
    today = str(date.today())
    last = user.get("last_checkin_date")
    if last and last != today:
        from datetime import timedelta
        yesterday = str(date.today() - timedelta(days=1))
        if last == yesterday:
            earned += POINTS_MAP["streak"]

    user["total"] += earned
    user["checkin_count"] += 1
    user["last_checkin_date"] = today

    # Check for newly reached milestones
    new_milestones = []
    for milestone in MILESTONES:
        if (milestone["points"] <= user["total"] and
                milestone["reward"] not in user["milestones_reached"]):
            user["milestones_reached"].append(milestone["reward"])
            new_milestones.append(milestone["reward"])

    save_points(data)

    return {
        "total": user["total"],
        "earned_this_action": earned,
        "new_milestones": new_milestones  # frontend can show a popup!
    }

def get_points(user_id):
    data = load_points()
    if user_id not in data:
        return {"total": 0, "checkin_count": 0, "milestones_reached": []}
    
    user = data[user_id]
    
    # Find next milestone
    next_milestone = None
    for milestone in MILESTONES:
        if milestone["reward"] not in user["milestones_reached"]:
            next_milestone = {
                "reward": milestone["reward"],
                "points_needed": milestone["points"] - user["total"]
            }
            break

    return {
        "total": user["total"],
        "checkin_count": user["checkin_count"],
        "milestones_reached": user["milestones_reached"],
        "next_milestone": next_milestone  # frontend shows progress bar to this
    }
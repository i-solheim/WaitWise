import json

DISCLAIMER = (
    "WaitWise is not a medical service. This recommendation is for "
    "general guidance only and does not replace professional medical "
    "advice. In an emergency, call 911."
)

TRIAGE_MAP = {
    "cold":        {"care": "Pharmacist",     "urgency": "low",       "note": "A pharmacist can help with over-the-counter options in under 10 min.", "avoid": "No need for urgent care or ER."},
    "flu":         {"care": "Pharmacist",     "urgency": "low",       "note": "A pharmacist can help with over-the-counter options in under 10 min.", "avoid": "No need for urgent care or ER."},
    "sore throat": {"care": "Walk-in clinic", "urgency": "low",       "note": "A walk-in clinic can do a quick strep test same day.",                "avoid": "Don't go to the ER for a sore throat."},
    "rash":        {"care": "Walk-in clinic", "urgency": "low",       "note": "A walk-in clinic can assess most skin issues same day.",               "avoid": "Don't ignore if rash spreads rapidly."},
    "sprain":      {"care": "Urgent care",    "urgency": "medium",    "note": "Urgent care can do X-rays and treat sprains same day.",                "avoid": "Don't walk on it if you suspect a fracture."},
    "injury":      {"care": "Urgent care",    "urgency": "medium",    "note": "Urgent care can handle most non-life-threatening injuries.",           "avoid": "Go to ER if bleeding won't stop."},
    "checkup":     {"care": "Primary care",   "urgency": "low",       "note": "Book a primary care appointment ahead of time.",                       "avoid": "Don't use urgent care for routine checkups."},
    "chest pain":  {"care": "Emergency room", "urgency": "emergency", "note": "Please seek emergency care immediately or call 911.",                  "avoid": "Do not drive yourself."},
}

def smart_triage(user_input):
    user_input = user_input.lower()
    for key, value in TRIAGE_MAP.items():
        if key in user_input:
            result = value.copy()
            result["disclaimer"] = DISCLAIMER
            return result
    return fallback_response()

def fallback_response():
    return {
        "care": "Walk-in clinic",
        "urgency": "low",
        "note": "A walk-in clinic is a safe starting point for most issues.",
        "avoid": "Don't ignore symptoms that worsen or persist.",
        "disclaimer": DISCLAIMER
    }
import json
from datetime import datetime

clinics_seed = [
    {
        "id": 1,
        "name": "Augustana Health Services",
        "sub": "Westerlin Hall, Augustana College, Rock Island",
        "type": "Student",
        "distance": 0.3,
        "hours": "8 AM - 5 PM",
        "phone": "(309) 794-7357",
        "rating": 4.6,
        "real": True,  # scrape this
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 2,
        "name": "CVS MinuteClinic",
        "sub": "2617 18th Ave, Rock Island, IL",
        "type": "Walk-in",
        "distance": 0.8,
        "hours": "8 AM - 8 PM",
        "phone": "(309) 788-0412",
        "rating": 4.3,
        "real": True,  # scrape this
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 3,
        "name": "CHC Express Care",
        "sub": "1106 4th Ave, Moline, IL",
        "type": "Walk-in",
        "distance": 1.9,
        "hours": "8 AM - 6 PM",
        "phone": "(563) 336-3000",
        "rating": 5.0,
        "real": True,  # scrape this — closest to Augie, perfect rating
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 4,
        "name": "UnityPoint Clinic Express Care - Moline",
        "sub": "106 19th Ave #103, Moline, IL",
        "type": "Urgent",
        "distance": 2.4,
        "hours": "8 AM - 8 PM",
        "phone": "(309) 779-7050",
        "rating": 3.3,
        "real": True,  # scrape this — major chain, high traffic
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 5,
        "name": "UnityPoint Clinic Express Care - SouthPark Pointe",
        "sub": "3904 16th St, Moline, IL",
        "type": "Urgent",
        "distance": 3.8,
        "hours": "8 AM - 8 PM",
        "phone": "(309) 581-7610",
        "rating": 3.1,
        "real": True,  # scrape this — second UnityPoint location nearby
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 6,
        "name": "MercyOne Genesis Moline Convenient Care",
        "sub": "3900 28th Ave Dr, Moline, IL",
        "type": "Urgent",
        "distance": 4.1,
        "hours": "8 AM - 7:30 PM",
        "phone": "(563) 421-3800",
        "rating": 2.6,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 7,
        "name": "OSF PromptCare - Milan",
        "sub": "600 S. Park Ave, Milan, IL",
        "type": "Urgent",
        "distance": 4.5,
        "hours": "8 AM - 8 PM",
        "phone": "(309) 281-8000",
        "rating": 4.1,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 8,
        "name": "UnityPoint Clinic Express - Duck Creek",
        "sub": "1417 Kimberly Rd, Bettendorf, IA",
        "type": "Urgent",
        "distance": 5.3,
        "hours": "8 AM - 8 PM",
        "phone": "(563) 949-4503",
        "rating": 4.2,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 9,
        "name": "University of Iowa Healthcare - Bettendorf",
        "sub": "865 Lincoln Rd #400, Bettendorf, IA",
        "type": "Urgent",
        "distance": 5.8,
        "hours": "7 AM - 9 PM",
        "phone": "(563) 362-3052",
        "rating": 3.7,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 10,
        "name": "UnityPoint Clinic Express Care - Bettendorf",
        "sub": "3415 53rd Ave, Bettendorf, IA",
        "type": "Urgent",
        "distance": 6.5,
        "hours": "8 AM - 8 PM",
        "phone": "(563) 742-4350",
        "rating": 3.3,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 11,
        "name": "Amana Care Clinic",
        "sub": "2162 W Kimberly Rd, Davenport, IA",
        "type": "Walk-in",
        "distance": 8.2,
        "hours": "7 AM - 6:30 PM",
        "phone": "(563) 388-7000",
        "rating": 4.8,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 12,
        "name": "MercyOne Genesis Davenport Convenient Care",
        "sub": "3200 W Kimberly Rd, Davenport, IA",
        "type": "Urgent",
        "distance": 9.0,
        "hours": "8 AM - 7:30 PM",
        "phone": "(563) 421-3800",
        "rating": 2.4,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
    {
        "id": 13,
        "name": "University of Iowa Urgent Care - Davenport",
        "sub": "2705 E 53rd St, Davenport, IA",
        "type": "Urgent",
        "distance": 9.5,
        "hours": "7 AM - 9 PM",
        "phone": "(563) 362-3052",
        "rating": 4.6,
        "real": False,
        "checkinCount": 0,
        "lastCheckin": None,
    },
]

def generate_hourly_pattern(clinic_type):
    """Generate realistic wait times by hour (9am-8pm)"""
    # Base pattern: busy at lunch (12-1pm) and after work (5-7pm)
    # Lower in mornings and late evenings
    base_patterns = {
        "Walk-in": [18, 25, 32, 28, 22, 15, 10, 8, 12, 16, 20, 18],
        "Urgent": [22, 35, 40, 38, 32, 28, 24, 18, 14, 12, 16, 20],
        "Primary": [30, 42, 48, 45, 38, 35, 32, 28, 22, 0, 0, 0],
        "Student": [20, 30, 28, 22, 18, 14, 10, 5, 8, 0, 0, 0],
    }
    return base_patterns.get(clinic_type, base_patterns["Walk-in"])

def find_best_time(hourly):
    """Find the hour with lowest wait (excluding closed hours)"""
    valid = [(i, w) for i, w in enumerate(hourly) if w > 0]
    if not valid:
        return "Closed", 0
    best_hour_idx, best_wait = min(valid, key=lambda x: x[1])
    hour_labels = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
                   "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"]
    return hour_labels[best_hour_idx], best_wait

def current_wait(hourly):
    """Get current wait based on current hour"""
    now_hour = datetime.now().hour
    idx = now_hour - 9  # 9 AM = index 0
    if idx < 0 or idx >= 12:
        return hourly[0]  # outside hours, show opening wait
    wait = hourly[idx]
    return wait if wait > 0 else hourly[0]

def build_clinics():
    result = []
    for clinic in clinics_seed:
        hourly = generate_hourly_pattern(clinic["type"])
        best_time, best_wait = find_best_time(hourly)
        clinic["hourly"] = hourly
        clinic["currentWait"] = current_wait(hourly)
        clinic["bestTime"] = best_time
        clinic["bestWait"] = best_wait
        # Add x, y coordinates for map (percentage-based, 0-100)
        clinic["x"] = 20 + (clinic["id"] * 7) % 60
        clinic["y"] = 25 + (clinic["id"] * 11) % 55
        result.append(clinic)
    return result

if __name__ == "__main__":
    clinics = build_clinics()
    # Write to the frontend data folder
    with open("../src/data/clinics.json", "w") as f:
        json.dump(clinics, f, indent=2)
    print(f"✓ Generated {len(clinics)} clinics → src/data/clinics.json")

import json
from datetime import datetime

# Start with this seed list — real clinics in the Quad Cities area
# Search Google Maps for "walk-in clinic Rock Island IL" to find more
clinics_seed = [
    {
        "id": 1,
        "name": "CVS MinuteClinic",
        "sub": "18th Ave & 7th St, Rock Island",
        "type": "Walk-in",
        "distance": 0.8,
        "hours": "8 AM - 8 PM",
        "phone": "(309) 788-0412",
        "rating": 4.3,
        "real": True,  # we'll scrape this one
    },
    {
        "id": 2,
        "name": "Augustana Health Services",
        "sub": "Westerlin Hall, Augustana College",
        "type": "Student",
        "distance": 0.3,
        "hours": "8 AM - 5 PM",
        "phone": "(309) 794-7357",
        "rating": 4.6,
        "real": True,
    },
    # Add 10-13 more clinics here. Search Google Maps for real ones.
    # Include: Walgreens Healthcare, OSF PromptCare, UnityPoint Express,
    # Genesis Family Medicine, Quad City Urgent Care
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

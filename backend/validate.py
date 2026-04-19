import json

required_fields = [
    "id", "name", "sub", "type", "distance", "currentWait",
    "bestTime", "bestWait", "real", "hours", "phone",
    "rating", "hourly", "x", "y", "lat", "lng",
    "checkinCount", "lastCheckin"
]

with open("../src/data/clinics.json") as f:
    clinics = json.load(f)

errors = []
for clinic in clinics:
    for field in required_fields:
        if field not in clinic:
            errors.append(f"Clinic {clinic.get('id', '?')} ({clinic.get('name', '?')}) missing: {field}")
    if len(clinic.get("hourly", [])) != 12:
        errors.append(f"Clinic {clinic.get('id', '?')} hourly must have exactly 12 items")
    if not isinstance(clinic.get("lat"), (int, float)):
        errors.append(f"Clinic {clinic.get('id', '?')} lat must be a number")
    if not isinstance(clinic.get("lng"), (int, float)):
        errors.append(f"Clinic {clinic.get('id', '?')} lng must be a number")

if errors:
    print(f"✗ Found {len(errors)} error(s):")
    for e in errors:
        print(f"  {e}")
else:
    print(f"✓ All {len(clinics)} clinics valid — ready for frontend")
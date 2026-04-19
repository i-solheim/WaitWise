from datetime import datetime

def process_checkin(clinics, clinic_id, reported_wait):
    """
    Update a clinic's current wait time based on user check-in.
    Uses a weighted average so one outlier doesn't wreck the data.
    """
    for clinic in clinics:
        if clinic["id"] == clinic_id:
            existing_wait = clinic.get("currentWait", 0)
            checkin_count = clinic.get("checkinCount", 0)

            # Weighted average — real data weighs more as check-ins grow
            # First few check-ins: blend with baseline
            # After 5+ check-ins: trust user data much more
            if checkin_count == 0:
                new_wait = reported_wait
            elif checkin_count < 5:
                # 40% new report, 60% existing
                new_wait = int(0.4 * reported_wait + 0.6 * existing_wait)
            else:
                # 70% new report, 30% existing
                new_wait = int(0.7 * reported_wait + 0.3 * existing_wait)

            clinic["currentWait"] = new_wait
            clinic["checkinCount"] = checkin_count + 1
            clinic["lastCheckin"] = datetime.now().isoformat()

            # Also update the hourly pattern for this hour
            now_hour = datetime.now().hour
            idx = now_hour - 9  # 9 AM = index 0
            if 0 <= idx < 12:
                clinic["hourly"][idx] = new_wait

            return clinics, f"Wait time updated to {new_wait} min"

    return clinics, "Clinic not found"
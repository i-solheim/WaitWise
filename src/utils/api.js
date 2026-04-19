const API_URL = "http://localhost:5000"; // swap for ngrok URL on demo day

// Generates a random user ID and stores it in memory
// No login needed — just a consistent ID for the session
export function getUserId() {
  if (!window._userId) {
    window._userId = "user_" + Math.random().toString(36).substr(2, 9);
  }
  return window._userId;
}

// GET /clinics — fetches all clinics with live wait times
export async function fetchClinics() {
  const res = await fetch(`${API_URL}/clinics`);
  if (!res.ok) throw new Error("Failed to fetch clinics");
  return res.json();
}

// POST /checkin — submits a user check-in
export async function submitCheckin(clinicId, reportedWait, userId) {
  const res = await fetch(`${API_URL}/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clinic_id: clinicId,
      reported_wait: reportedWait,
      user_id: userId,
    }),
  });
  if (!res.ok) throw new Error("Check-in failed");
  return res.json();
}

// GET /points/:userId — fetches points balance
export async function fetchPoints(userId) {
  const res = await fetch(`${API_URL}/points/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch points");
  return res.json();
}

// POST /triage — sends symptoms to Gemini
export async function fetchTriage(symptoms) {
  const res = await fetch(`${API_URL}/triage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });
  if (!res.ok) throw new Error("Triage failed");
  return res.json();
}
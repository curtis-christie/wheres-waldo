const API_BASE = "http://localhost:3000/api";

export async function fetchImage(slug) {
  const res = await fetch(`${API_BASE}/images/${slug}`);
  if (!res.ok) throw new Error("Failed to load image");
  return res.json();
}

export async function createSession(imageId) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageId }),
  });

  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function submitGuess(payload) {
  const res = await fetch(`${API_BASE}/guesses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to submit guess");
  return res.json();
}

/** API may return an array or wrap it (e.g. { data: [...] }). */
export function normalizeListPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.connections)) return payload.connections;
  return [];
}

/** { sent, received } or nested / alternate key names */
export function normalizeRequestsBundle(payload) {
  if (!payload || typeof payload !== "object") {
    return { sent: [], received: [] };
  }
  const p = payload.data && typeof payload.data === "object" ? payload.data : payload;
  const sentRaw = p.sent ?? p.sentRequests ?? p.outgoing ?? [];
  const receivedRaw = p.received ?? p.receivedRequests ?? p.incoming ?? [];
  return {
    sent: normalizeListPayload(sentRaw),
    received: normalizeListPayload(receivedRaw),
  };
}

/** Connection entry may be a user doc or wrap the other user in .user / .connectedUser */
export function unwrapConnectionProfile(entry) {
  if (!entry || typeof entry !== "object") return entry;
  if (entry.firstName != null || entry.lastName != null || entry.emailId != null) {
    return entry;
  }
  return (
    entry.user ??
    entry.connectedUser ??
    entry.toUser ??
    entry.fromUser ??
    entry
  );
}

/**
 * Parses follow-up suggestions from assistant text.
 * The LLM appends: ---FOLLOWUPS---["question1","question2","question3"]
 */
export function parseFollowUps(text: string): { cleanText: string; followUps: string[] } {
  const marker = "---FOLLOWUPS---";
  const idx = text.indexOf(marker);

  if (idx === -1) return { cleanText: text, followUps: [] };

  const cleanText = text.substring(0, idx).trim();
  const rest = text.substring(idx + marker.length).trim();

  try {
    const parsed = JSON.parse(rest);
    if (Array.isArray(parsed)) {
      return {
        cleanText,
        followUps: parsed.filter((f): f is string => typeof f === "string"),
      };
    }
  } catch {
    // Malformed JSON — return clean text without follow-ups
  }

  return { cleanText, followUps: [] };
}

/**
 * Returns a human-readable relative timestamp in Spanish.
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);

  if (diffSecs < 60) return "ahora";
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  return `hace ${Math.floor(diffHours / 24)}d`;
}

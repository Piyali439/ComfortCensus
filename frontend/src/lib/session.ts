const SESSION_KEY = 'comfort_census_session_id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function hasVisitedBefore(): boolean {
  return localStorage.getItem(SESSION_KEY) !== null;
}

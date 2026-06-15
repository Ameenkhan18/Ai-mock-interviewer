const USER_ID_KEY = 'ai_interviewer_user_id';

export function getUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

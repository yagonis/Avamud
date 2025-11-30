export function saveToken(token) {
  localStorage.setItem('avamud_token', token);
}

export function getToken() {
  return localStorage.getItem('avamud_token');
}

export function clearToken() {
  localStorage.removeItem('avamud_token');
}

export function isAuthenticated() {
  return !!getToken();
}

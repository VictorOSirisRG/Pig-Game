// return the user data from the session storage
export const getUser = () => {
  const userStr = localStorage.getItem("userData");

  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem("jwToken") || null;
};

export const getRole = () => {
  return localStorage.getItem("role") || null;
};

export const setRole = () => {
  return localStorage.setItem("Role") || null;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.clear();
  console.clear();
};

// set the token and user from the session storage
export const setUserSession = (token, user, role) => {
  localStorage.setItem("jwToken", token);
  localStorage.setItem("userData", JSON.stringify(user));
  localStorage.setItem("role", role);
};

export const setUserData = (user) => {
  localStorage.setItem("userData", JSON.stringify(user));
};

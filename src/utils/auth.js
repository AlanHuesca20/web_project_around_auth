export const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

export const register = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const authorize = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

export const getUserInfoAuth = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
};

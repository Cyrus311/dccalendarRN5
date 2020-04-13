import request from "../data/apiCentral";

export const login = (email, password) => {
  return request(
    {
      url: `/users/login`,
      method: "POST",
      data: {
        email: email,
        password: password,
      },
    },
    false
  );
};

export const register = (email, fullName, password, title) => {
  return request(
    {
      url: `/users`,
      method: "POST",
      data: {
        email: email,
        password: password,
        fullName: fullName,
        deviceId: "QWE123",
        title: title,
      },
    },
    false
  );
};

export const forgot = (email) => {
  return request(
    {
      url: `/users/forgot`,
      method: "POST",
      data: {
        email: email,
      },
    },
    false
  );
};

export const authService = {
  login,
  register,
  forgot,
};

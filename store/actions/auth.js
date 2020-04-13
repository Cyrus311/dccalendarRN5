import { AsyncStorage } from "react-native";
import { customVariables } from "../../constants/customVariables";

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const SIGNUP = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const CHECK_EMAIL = "CHECK_EMAIL";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      token: token,
      userId: userId,
    });
  };
};

export const signup = (email, password, fullName) => {
  const apiUrl = "https://doctorcalendar.eu-gb.mybluemix.net/users";
  return async (dispatch) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullName: fullName,
        title: "Dr.",
        deviceId: "QWERT1",
        roles: ["user"],
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      let message = "Something went wrong!";
      message = errorResData.error.message;
      if (errorResData.error.details) {
        message = errorResData.error.details[0].message;
      }
      throw new Error(message);
    }

    const resData = await response.json();

    return { type: SIGNUP, email: resData.email };
  };
};

export const login = (email, password) => {
  const apiUrl = "https://doctorcalendar.eu-gb.mybluemix.net/users/login";

  return async (dispatch) => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorResData = await response.json();
      let message = "Something went wrong!";
      message = errorResData.error.message;
      if (errorResData.error.details) {
        message = errorResData.error.details[0].message;
      }
      throw new Error(message);
    }

    const res = await response.json();
    const resData = res.tokenModel;

    dispatch(
      authenticate(resData.token, resData.userId, parseInt(resData.exp))
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.exp)
    );
    saveDataToStorage(resData.token, resData.userId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem(customVariables.TOKENDATA);
  return { type: LOGOUT };
};

export const forgot = (email) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        `https://doctorcalendar.eu-gb.mybluemix.net/users/forgot?email=${email}`
      );

      if (!response.ok) {
        const errorResData = await response.json();
        throw new Error(errorResData.error.message);
      }

      const resData = await response.json();

      dispatch({ type: FORGOT_PASSWORD, result: resData });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const checkEmail = (email) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        `https://doctorcalendar.eu-gb.mybluemix.net/users/emailCheck?email=${email}`
      );

      if (!response.ok) {
        const errorResData = await response.json();

        throw new Error(errorResData.error.message);
      }

      const resData = await response.json();

      dispatch({ type: CHECK_EMAIL, result: resData });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    customVariables.TOKENDATA,
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

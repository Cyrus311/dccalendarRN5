import { AsyncStorage } from "react-native";

// export const SIGNUP = "SIGNUP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const CHECK_EMAIL = "CHECK_EMAIL";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (token, userId, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token: token, userId: userId });
  };
};

export const signup = (email, password, fullname) => {
  const apiUrl = "https://doctorcalendar.eu-gb.mybluemix.net/users/login";
  // apiUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBPbNMyirVETOQ3YpvckHVfiia4fdoz4Lg";
  return async dispatch => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        fullname: fullname,
        returnSecureToken: true
      })
    });

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "INVALID_EMAIL") {
        message = "This email is not valid!";
      } else if (errorId === "EMAIL_EXISTS") {
        message = "This email exist already!";
      } else if (errorId === "OPERATION_NOT_ALLOWED") {
        message = "This operation not allowed!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log("resData", resData);

    return;

    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  const apiUrl = "https://doctorcalendar.eu-gb.mybluemix.net/users/login";
  // apiUrl ="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBPbNMyirVETOQ3YpvckHVfiia4fdoz4Lg",

  return async dispatch => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong!";
      if (errorId === "INVALID_EMAIL") {
        message = "This email is not valid!";
      } else if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    resData.localId = "UU34";
    resData.expiresIn = "34343434";

    dispatch(
      authenticate(
        resData.token,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};

export const checkEmail = email => {
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

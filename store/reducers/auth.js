import {
  AUTHENTICATE,
  SIGNUP,
  LOGOUT,
  SET_DID_TRY_AL,
  CHECK_EMAIL
} from "../actions/auth";

const initialState = {
  token: null,
  userId: null,
  email: null,
  didTryAutoLogin: false,
  isEmailCheck: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true
      };
    case SIGNUP:
      return {
        ...state,
        email: action.email,
        didTryAutoLogin: true
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true
      };
    case CHECK_EMAIL:
      return {
        ...state,
        didTryAutoLogin: true,
        isEmailCheck: action.result
      };
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId
    //   };
    default:
      return state;
  }
};

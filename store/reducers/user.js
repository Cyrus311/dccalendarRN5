import { SET_USER, UPDATE_USER } from "../actions/user";
import User from "../../models/user";

const initialState = { user: new User() };

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER: {
      return { user: action.user };
    }
    case UPDATE_USER: {
      return { user: action.user };
    }
  }

  return state;
};

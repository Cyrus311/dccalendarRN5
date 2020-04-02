import User from "../../models/user";
import { userService } from "../../services/user";

export const SET_USER = "SET_USER";

export const fetchUser = () => {
  return async (dispatch, getState) => {
    try {
      const response = await userService.userMe();

      if (response.error) {
        const errorResData = response.error;
        console.log("ERROR", errorResData);
      }

      const resData = response;

      const user = new User(
        resData.user.id,
        resData.user.email,
        resData.user.fullName,
        resData.user.title,
        resData.user.deviceId,
        resData.user.roles,
        resData.groups
      );

      dispatch({ type: SET_USER, user: user });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

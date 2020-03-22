import User from "../../models/user";
import { userService } from "../../services/user";

export const SET_USER = "SET_USER";

export const fetchUser = () => {
  console.log("----------------------------");
  return async (dispatch, getState) => {
    try {
      // any async code you want!
      const userId = getState().auth.userId;

      const response = await userService.userInfo(userId);

      if (response.error) {
        const errorResData = response.error;
        console.log("ERROR", errorResData);
      }

      const resData = response;

      const user = new User(
        resData.id,
        resData.email,
        resData.fullName,
        resData.title,
        resData.deviceId,
        resData.roles
      );

      dispatch({ type: SET_USER, user: user });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

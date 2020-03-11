import Calendar from "../../models/calendar";
import { calendarService } from "../../services/calendar";

export const DELETE_CALENDAR = "DELETE_CALENDAR";
export const CREATE_CALENDAR = "CREATE_CALENDAR";
export const UPDATE_CALENDAR = "UPDATE_CALENDAR";
export const SET_CALENDARS = "SET_CALENDARS";

export const fetchCalendar = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;
    const filterData = {
      filter: {
        where: {
          groupId: {
            like: "5e53975e62398900983c869c"
          }
        },
        include: [
          {
            relation: "group"
          },
          {
            relation: "user"
          },
          {
            relation: "location"
          }
        ]
      }
    };
    try {
      // any async code you want!
      // const response = await fetch(
      //   "https://doctorcalendar.eu-gb.mybluemix.net/calendars",
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //       "params": filterData
      //     }
      //   }
      // );

      const response = await calendarService.getReminderService(filterData);

      if (response.error) {
        const errorResData = response.error;
        console.log("ERROR", errorResData);

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
        // console.log("ERROR");
      }

      const resData = response;
      console.log("resData", resData[0]);

      const loadedCalendars = [];
      for (const key in resData) {
        loadedCalendars.push(
          new Calendar(
            resData[key].id,
            resData[key].date,
            resData[key].description,
            resData[key].type,
            resData[key].userId,
            resData[key].groupId,
            resData[key].locationId,
            resData[key].createdDate,
            resData[key].updatedDate,
            resData[key].createdUserId,
            resData[key].updatedUserId
          )
        );
      }

      dispatch({
        type: SET_CALENDARS,
        calendars: loadedCalendars,
        userCalendars: loadedCalendars.filter(prod => prod.userId === userId)
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

export const deleteCalendar = calendarId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shoppingapp-a4b90.firebaseio.com/calendars/${calendarId}.json?auth=${token}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      // throw new Error("Something went wrong!");
      const errorResData = await response.json();
      console.log("ERROR", errorResData);

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

    dispatch({ type: DELETE_CALENDAR, pid: calendarId });
  };
};

export const createCalendar = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://shoppingapp-a4b90.firebaseio.com/calendars.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );
    // .then(response => {})
    // .catch(error => {});

    const resData = await response.json();

    dispatch({
      type: CREATE_CALENDAR,
      calendarData: {
        id: resData.name,
        title: title,
        description: description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateCalendar = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://shoppingapp-a4b90.firebaseio.com/calendars/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_CALENDAR,
      pid: id,
      calendarData: {
        title: title,
        description: description,
        imageUrl
      }
    });
  };
};

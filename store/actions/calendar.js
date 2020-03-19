import moment from "moment";
import { Calendar, User, Location, Group } from "../../models/index";
import { calendarService } from "../../services/calendar";

export const DELETE_CALENDAR = "DELETE_CALENDAR";
export const CREATE_CALENDAR = "CREATE_CALENDAR";
export const UPDATE_CALENDAR = "UPDATE_CALENDAR";
export const SET_CALENDARS = "SET_CALENDARS";
export const DAILY_CALENDARS = "DAILY_CALENDARS";

export const fetchCalendar = filterData => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
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

      const loadedCalendars = [];
      for (const key in resData) {
        loadedCalendars.push({
          id: key,
          calendar: resData[key]
            ? new Calendar(
                resData[key].id,
                new Date(resData[key].date),
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
            : {},
          group: resData[key].group
            ? new Group(resData[key].group.id, resData[key].group.name)
            : {},
          location: resData[key].location
            ? new Location(
                resData[key].location.id,
                resData[key].location.name,
                resData[key].location.colorCode,
                resData[key].location.groupId
              )
            : {},
          user: resData[key].user
            ? new User(
                resData[key].user.id,
                resData[key].user.email,
                resData[key].user.fullName,
                resData[key].user.title,
                resData[key].user.deviceId,
                resData[key].user.roles,
                resData[key].user.createdDate,
                resData[key].user.updatedDate
              )
            : {}
        });
      }

      dispatch({
        type: SET_CALENDARS,
        calendars: loadedCalendars.sort((a, b) => {
          if (a.calendar.date > b.calendar.date) {
            return 1;
          }
          if (a.calendar.date < b.calendar.date) {
            return -1;
          }
          return 0;
        }),
        userCalendars: loadedCalendars
          .filter(duty => duty.user.id === userId)
          .sort((a, b) => {
            if (a.calendar.date > b.calendar.date) {
              return 1;
            }
            if (a.calendar.date < b.calendar.date) {
              return -1;
            }
            return 0;
          }),
        mountCalendars: loadedCalendars
          .filter(
            duty =>
              duty.user.id === userId &&
              moment(duty.calendar.date).format("Y-MM") ===
                moment().format("Y-MM")
          )
          .sort((a, b) => {
            if (a.calendar.date > b.calendar.date) {
              return 1;
            }
            if (a.calendar.date < b.calendar.date) {
              return -1;
            }
            return 0;
          }),
        dailyCalendars: []
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

export const dailyCalendar = date => {
  return async (dispatch, getState) => {
    try {
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

      const loadedCalendars = [];
      for (const key in resData) {
        loadedCalendars.push({
          id: key,
          calendar: resData[key]
            ? new Calendar(
                resData[key].id,
                new Date(resData[key].date),
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
            : {},
          group: resData[key].group
            ? new Group(resData[key].group.id, resData[key].group.name)
            : {},
          location: resData[key].location
            ? new Location(
                resData[key].location.id,
                resData[key].location.name,
                resData[key].location.colorCode,
                resData[key].location.groupId
              )
            : {},
          user: resData[key].user
            ? new User(
                resData[key].user.id,
                resData[key].user.email,
                resData[key].user.fullName,
                resData[key].user.title,
                resData[key].user.deviceId,
                resData[key].user.roles,
                resData[key].user.createdDate,
                resData[key].user.updatedDate
              )
            : {}
        });
      }

      dispatch({
        type: DAILY_CALENDARS,
        dailyCalendars: loadedCalendars
          .filter(
            duty =>
              moment(duty.calendar.date).format("Y-MM-DD") ===
              moment(date).format("Y-MM-DD")
          )
          .sort((a, b) => {
            if (a.calendar.date > b.calendar.date) {
              return 1;
            }
            if (a.calendar.date < b.calendar.date) {
              return -1;
            }
            return 0;
          })
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

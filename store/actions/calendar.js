import moment from "moment";
import { extendMoment } from "moment-range";
import { Calendar, User, Location, Group } from "../../models/index";
import { calendarService } from "../../services/calendar";

export const DELETE_CALENDAR = "DELETE_CALENDAR";
export const CREATE_CALENDAR = "CREATE_CALENDAR";
export const UPDATE_CALENDAR = "UPDATE_CALENDAR";
export const SET_CALENDARS = "SET_CALENDARS";
export const DAILY_CALENDARS = "DAILY_CALENDARS";

export const fetchCalendar = (filterData) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await calendarService.getCalendars(filterData);

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
      }

      const resData = response;

      const loadedCalendars = [];
      for (const key in resData) {
        loadedCalendars.push({
          id: key,
          calendar: resData[key]
            ? new Calendar(
                resData[key].id,
                new Date(resData[key].startDate),
                new Date(resData[key].endDate),
                resData[key].description,
                resData[key].type,
                resData[key].userId,
                resData[key].groupId,
                resData[key].locationId,
                resData[key].isDraft,
                resData[key].status,
                resData[key].isWeekend,
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
            : {},
        });
      }

      dispatch({
        type: SET_CALENDARS,
        calendars: loadedCalendars.sort((a, b) => {
          if (a.calendar.startDate > b.calendar.startDate) {
            return 1;
          }
          if (a.calendar.startDate < b.calendar.startDate) {
            return -1;
          }
          return 0;
        }),
        userCalendars: loadedCalendars.filter(
          (duty) => duty.user.id === userId
        ),
        mountCalendars: loadedCalendars.filter(
          (duty) =>
            duty.user.id === userId &&
            duty.calendar.type === 1 &&
            moment(duty.calendar.startDate).format("Y-MM") ===
              moment().format("Y-MM")
        ),
        noDutyCalendars: loadedCalendars
          .filter(
            (duty) =>
              duty.user.id === userId &&
              duty.calendar.type !== 0 &&
              duty.calendar.type !== 1
          )
          .sort((a, b) => {
            if (a.calendar.startDate > b.calendar.startDate) {
              return -1;
            }
            if (a.calendar.startDate < b.calendar.startDate) {
              return 1;
            }
            return 0;
          }),
        dailyCalendars: [],
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

export const dailyCalendar = (date) => {
  return async (dispatch, getState) => {
    try {
      if (!getState().user.user.groups) {
        return;
      }
      if (getState().user.user.groups.length <= 0) {
        return;
      }
      const groupId = getState().user.user.groups[0].id;
      const filterData = {
        filter: {
          where: {
            groupId: {
              like: groupId,
            },
          },
          include: [
            {
              relation: "group",
            },
            {
              relation: "user",
            },
            {
              relation: "location",
            },
          ],
        },
      };

      const response = await calendarService.getCalendars(filterData);

      if (response.error) {
        const errorResData = response.error;
        console.log("ERROR", errorResData);

        const errorId = errorResData.error.message;
        let message = "Something went wrong!";
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
                new Date(resData[key].startDate),
                new Date(resData[key].endDate),
                resData[key].description,
                resData[key].type,
                resData[key].userId,
                resData[key].groupId,
                resData[key].locationId,
                resData[key].isDraft,
                resData[key].status,
                resData[key].isWeekend,
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
            : {},
        });
      }

      dispatch({
        type: DAILY_CALENDARS,
        dailyCalendars: loadedCalendars
          .filter(
            (duty) =>
              duty.calendar.type === 1 &&
              moment(duty.calendar.startDate).format("Y-MM-DD") ===
                moment(date).format("Y-MM-DD")
          )
          .sort((a, b) => {
            if (a.calendar.startDate > b.calendar.startDate) {
              return 1;
            }
            if (a.calendar.startDate < b.calendar.startDate) {
              return -1;
            }
            return 0;
          }),
      });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

export const deleteCalendar = (calendarId) => {
  return async (dispatch, getState) => {
    try {
      const response = await calendarService.deleteCalendar(calendarId);

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
      }

      dispatch({ type: DELETE_CALENDAR, pid: calendarId });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
};

export const createCalendar = (calendar) => {
  return async (dispatch, getState) => {
    try {
      // const token = getState().auth.token;
      const userId = getState().auth.userId;
      const groupId = getState().user.user.groups[0].id;
      const status = 1;
      // const guid = (
      //   GUID4() +
      //   GUID4() +
      //   GUID4() +
      //   GUID4() +
      //   GUID4() +
      //   GUID4()
      // ).toLowerCase();
      // const momentRange = extendMoment(moment);
      // const start = moment(calendar.date).format(
      //   "YYYY-MM-DD[T]hh:mm:ss.sss[Z]"
      // );
      // const end = moment(calendar.date2).format("YYYY-MM-DD[T]hh:mm:ss.sss[Z]");
      // const range = momentRange.range(start, end);

      const leaveDays = [];
      // for (let date of range.by("day")) {
      leaveDays.push({
        userId,
        groupId,
        status,
        startDate: moment(calendar.date).format("YYYY-MM-DD[T]12:00:00.000[Z]"),
        endDate: moment(calendar.date2).format("YYYY-MM-DD[T]12:00:00.000[Z]"),
        description: calendar.description,
        type: calendar.type,
        isWeekend:
          moment(calendar.date).isoWeekday() === 6 ||
          moment(calendar.date).isoWeekday() === 7,
      });
      // }
      // return;

      // const reminder = {
      //   locationId: this.props.activeLocationId,
      //   groupId: "5e53975e62398900983c869c",
      //   userId: user.user.id,
      //   date: moment(destination.droppableId).format("YYYY-MM-DD[T]hh:mm:ss.sss[Z]"), - date: "2020-03-12T12:00:00.000Z"
      //   type: 0
      // }

      const response = await calendarService.createCalendarBulk(leaveDays);

      return;

      dispatch({
        type: CREATE_CALENDAR,
        calendarData: {
          id: resData.id,
          title: title,
          description: description,
          imageUrl,
          price,
          ownerId: userId,
        },
      });
    } catch (error) {
      const errorResData = error.data;
      let message = "Sistem yöneticinize başvurunuz!";
      message = errorResData.error.message;
      if (errorResData.error.details) {
        console.log("errorResData", errorResData.error);

        // message = errorResData.error.details[0].message;
        message = "Sistem yöneticinize başvurunuz!";
      }
      throw new Error(message);
    }
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
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
        imageUrl,
      },
    });
  };
};

const GUID4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

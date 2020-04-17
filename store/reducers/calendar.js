// import CALENDARS from "../../data/dummy-data";
import {
  DELETE_CALENDAR,
  CREATE_CALENDAR,
  UPDATE_CALENDAR,
  SET_CALENDARS,
  DAILY_CALENDARS,
} from "../actions/calendar";
// import Calendar from "../../models/calendar";
import Calendar from "../../models/calendar";
import moment from "moment";

const initialState = {
  availableCalendars: [],
  userCalendars: [],
  mountCalendars: [],
  dailyCalendars: [],
  noDutyCalendars: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CALENDARS: {
      //----------------Gruplama kodu---------------------------------
      // const leaveCalendars = [];
      // const result = action.noDutyCalendars.reduce(function(r, a) {
      //   r[a.calendar.calendarGroupId] = r[a.calendar.calendarGroupId] || [];
      //   r[a.calendar.calendarGroupId].push(a);
      //   return r;
      // }, Object.create(null));

      // for (const key in result) {
      //   leaveCalendars.push({
      //     id: key,
      //     calendar: {
      //       ...result[key][0].calendar,
      //       date2: result[key][result[key].length - 1].calendar.date
      //     }
      //   });
      // }
      //--------------------------------------------------------------

      return {
        availableCalendars: action.calendars,
        userCalendars: action.userCalendars,
        mountCalendars: action.mountCalendars,
        dailyCalendars: action.dailyCalendars,
        noDutyCalendars: action.noDutyCalendars,
      };
    }
    case DAILY_CALENDARS: {
      return {
        ...state,
        dailyCalendars: action.dailyCalendars,
      };
    }
    case CREATE_CALENDAR: {
      const newCalendar = new Calendar(
        action.calendarData.id,
        action.calendarData.startDate,
        action.calendarData.endDate,
        action.calendarData.description,
        action.calendarData.type,
        action.calendarData.userId,
        action.calendarData.groupId,
        action.calendarData.locationId,
        action.calendarData.isDraft,
        action.calendarData.status,
        action.calendarData.isWeekend,
        action.calendarData.sourceDate,
        action.calendarData.createdDate,
        action.calendarData.updatedDate,
        action.calendarData.createdUserId,
        action.calendarData.updatedUserId
      );
      return {
        ...state,
        availableCalendars: state.availableCalendars.concat(newCalendar),
        userCalendars: state.userCalendars.concat(newCalendar),
        mountCalendars: state.availableCalendars.concat(newCalendar),
        dailyCalendars: state.availableCalendars.concat(newCalendar),
        noDutyCalendars: state.availableCalendars.concat(newCalendar),
      };
    }
    case UPDATE_CALENDAR: {
      const calendarIndex = state.userCalendars.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedCalendar = new Calendar(
        action.pid,
        state.userCalendars[calendarIndex].ownerId,
        action.calendarData.title,
        action.calendarData.imageUrl,
        action.calendarData.description,
        state.userCalendars[calendarIndex].price
      );
      const updatedUserCalendars = [...state.userCalendars];
      updatedUserCalendars[calendarIndex] = updatedCalendar;
      const availableCalendarIndex = state.userCalendars.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableCalendars = [...state.availableCalendars];
      updatedAvailableCalendars[availableCalendarIndex] = updatedCalendar;
      return {
        ...state,
        availableCalendars: updatedAvailableCalendars,
        userCalendars: updatedUserCalendars,
      };
    }
    case DELETE_CALENDAR: {
      return {
        ...state,
        userCalendars: state.userCalendars.filter(
          (calendar) => calendar.id !== action.pid
        ),
        availableCalendars: state.availableCalendars.filter(
          (calendar) => calendar.id !== action.pid
        ),
        noDutyCalendars: state.noDutyCalendars.filter(
          (calendar) => calendar.id !== action.pid
        ),
        mountCalendars: state.mountCalendars.filter(
          (calendar) => calendar.id !== action.pid
        ),
        dailyCalendars: state.dailyCalendars.filter(
          (calendar) => calendar.id !== action.pid
        ),
      };
    }
  }
  return state;
};

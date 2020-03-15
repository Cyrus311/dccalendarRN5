// import CALENDARS from "../../data/dummy-data";
import {
  DELETE_CALENDAR,
  CREATE_CALENDAR,
  UPDATE_CALENDAR,
  SET_CALENDARS,
  DAILY_CALENDARS
} from "../actions/calendar";
// import Calendar from "../../models/calendar";
import Calendar from "../../models/calendar";

const initialState = {
  availableCalendars: [],
  userCalendars: [],
  mountCalenders: [],
  dailyCalenders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CALENDARS: {
      return {
        availableCalendars: action.calendars,
        userCalendars: action.userCalendars,
        mountCalenders: action.mountCalenders,
        dailyCalenders: action.dailyCalenders
      };
    }
    case DAILY_CALENDARS: {
      return {
        ...state,
        dailyCalenders: action.dailyCalenders
      };
    }
    case CREATE_CALENDAR: {
      const newCalendar = new Calendar(
        action.calendarData.id,
        action.calendarData.ownerId,
        action.calendarData.title,
        action.calendarData.imageUrl,
        action.calendarData.description,
        action.calendarData.price
      );
      return {
        ...state,
        availableCalendars: state.availableCalendars.concat(newCalendar),
        userCalendars: state.userCalendars.concat(newCalendar)
      };
    }
    case UPDATE_CALENDAR: {
      const calendarIndex = state.userCalendars.findIndex(
        prod => prod.id === action.pid
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
        prod => prod.id === action.pid
      );
      const updatedAvailableCalendars = [...state.availableCalendars];
      updatedAvailableCalendars[availableCalendarIndex] = updatedCalendar;
      return {
        ...state,
        availableCalendars: updatedAvailableCalendars,
        userCalendars: updatedUserCalendars
      };
    }
    case DELETE_CALENDAR: {
      return {
        ...state,
        userCalendars: state.userCalendars.filter(
          calendar => calendar.id !== action.pid
        ),
        availableCalendars: state.availableCalendars.filter(
          calendar => calendar.id !== action.pid
        )
      };
    }
  }
  return state;
};

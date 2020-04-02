import request from "../data/apiCentral";

const getCalendars = filterData => {
  return request({
    url: "/calendars",
    method: "GET",
    params: filterData
  });
};

const createCalendar = data => {
  return request({
    url: "/calendars",
    method: "POST",
    data: data
  });
};

const createCalendarBulk = data => {
  return request({
    url: "/calendars/bulk",
    method: "POST",
    data: data
  });
};

const deleteCalendar = id => {
  return request({
    url: "/calendars/" + id,
    method: "DELETE"
  });
};

export const calendarService = {
  getCalendars,
  createCalendar,
  createCalendarBulk,
  deleteCalendar
};

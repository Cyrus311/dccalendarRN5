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

const deleteCalendar = id => {
  return request({
    url: "/calendars/" + id,
    method: "DELETE"
  });
};

export const calendarService = {
  getCalendars,
  createCalendar,
  deleteCalendar
};

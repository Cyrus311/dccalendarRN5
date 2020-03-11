import request from "../data/apiCentral";

const getReminderService = filterData => {
  return request({
    url: "/calendars",
    method: "GET",
    params: filterData
  });
};

const createReminderService = data => {
  return request({
    url: "/calendars",
    method: "POST",
    data: data
  });
};

const deleteReminderService = id => {
  return request({
    url: "/calendars/" + id,
    method: "DELETE"
  });
};

export const calendarService = {
  getReminderService,
  createReminderService,
  deleteReminderService
};

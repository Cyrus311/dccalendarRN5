// import * as moment from "moment";
var moment = require("moment");

class Calendar {
  constructor(
    id,
    date,
    description,
    type,
    userId,
    groupId,
    locationId,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.date = date;
    this.description = description;
    this.type = type;
    this.userId = userId;
    this.groupId = groupId;
    this.locationId = locationId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }

  get readableDate() {
    return moment(this.date).format("Do MMMM YYYY, hh:mm");
  }
}

export default Calendar;

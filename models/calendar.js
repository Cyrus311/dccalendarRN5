import moment from "moment";
import "moment/locale/tr";
// var moment = require("moment");

class Calendar {
  constructor(
    id,
    date,
    description,
    type,
    userId,
    groupId,
    locationId,
    calendarGroupId,
    isDraft,
    status,
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
    this.calendarGroupId = calendarGroupId;
    this.isDraft = isDraft;
    this.status = status;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }

  get readableDate() {
    return moment(this.date).format("DD MMM");
  }
}

export default Calendar;

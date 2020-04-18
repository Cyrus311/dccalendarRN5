import moment from "moment";
import "moment/locale/tr";
// var moment = require("moment");

class Calendar {
  constructor(
    id,
    startDate,
    endDate,
    description,
    type,
    userId,
    groupId,
    locationId,
    isDraft,
    status,
    isWeekend,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.type = type;
    this.userId = userId;
    this.groupId = groupId;
    this.locationId = locationId;
    this.isDraft = isDraft;
    this.status = status;
    this.isWeekend = isWeekend;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }

  get readableDate() {
    return moment(this.startDate).format("DD MMM");
  }
}

export default Calendar;

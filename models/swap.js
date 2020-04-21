class Swap {
  constructor(
    id,
    description,
    sourceCalendarId,
    targetCalendarId,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.description = description;
    this.sourceCalendarId = sourceCalendarId;
    this.targetCalendarId = targetCalendarId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }
}

export default Swap;

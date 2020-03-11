class Location {
  constructor(
    id,
    name,
    colorCode,
    groupId,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.name = name;
    this.colorCode = colorCode;
    this.groupId = groupId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }
}

export default Location;

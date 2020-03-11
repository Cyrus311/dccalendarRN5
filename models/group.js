class Group {
  constructor(
    id,
    name,
    parentId,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }
}

export default Group;

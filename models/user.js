class User {
  constructor(
    id,
    email,
    fullName,
    title,
    deviceId,
    roles,
    groups,
    platform,
    createdDate,
    updatedDate,
    createdUserId,
    updatedUserId
  ) {
    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.title = title;
    this.deviceId = deviceId;
    this.roles = roles;
    this.groups = groups;
    this.platform = platform;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.createdUserId = createdUserId;
    this.updatedUserId = updatedUserId;
  }
}

export default User;

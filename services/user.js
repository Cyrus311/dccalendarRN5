import request from "../data/apiCentral";

const getUsers = filterData => {
  return request({
    url: "/user-groups",
    method: "GET",
    params: filterData
  });
};

//return userId and name
const userMe = () => {
  return request({
    url: `/users/me`,
    method: "GET",
    data: null
  });
};

const userInfo = id => {
  return request({
    url: `/users/${id}`,
    method: "GET",
    data: null
  });
};

export const userService = {
  getUsers,
  userMe,
  userInfo
};

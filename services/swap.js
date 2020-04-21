import request from "../data/apiCentral";

const getSwapRequests = (filterData) => {
  return request({
    url: "/swapRequests",
    method: "GET",
    params: filterData,
  });
};

export const swapRequestService = {
  getSwapRequests,
};

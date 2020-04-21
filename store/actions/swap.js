import Swap from "../../models/swap";
import { swapRequestService } from "../../services/swap";

export const SET_SWAP = "SET_SWAP";
export const CREATE_SWAP = "CREATE_SWAP";

export const fetchSwap = (filterData) => {
  return async (dispatch, getState) => {
    try {
      // const response = await swapRequestService.getSwapRequests(filterData);

      // if (response.error) {
      //   const errorResData = response.error;
      //   console.log("ERROR", errorResData);
      // }

      // const resData = response;

      const swaps = [];
      swaps.push(
        new Swap(
          "dsdlkslkl232",
          "description",
          "5e995d22d696db009d280cc9",
          "5e995d8cd696db009d280cca"
        )
      );

      dispatch({ type: SET_SWAP, swaps: swaps });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const createSwap = () => {
  return async (dispatch, getState) => {
    try {
      // const response = await swapRequestService.getSwapRequests(filterData);

      // if (response.error) {
      //   const errorResData = response.error;
      //   console.log("ERROR", errorResData);
      // }

      // const resData = response;

      const guid = (
        GUID4() +
        GUID4() +
        GUID4() +
        GUID4() +
        GUID4() +
        GUID4()
      ).toLowerCase();

      const swap = new Swap(
        guid,
        "description",
        "5e995d22d696db009d280cc9",
        "5e995d8cd696db009d280cca"
      );
      dispatch({ type: CREATE_SWAP, swap: swap });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

const GUID4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

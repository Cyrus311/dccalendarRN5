import { SET_SWAP, CREATE_SWAP } from "../actions/swap";
import Swap from "../../models/swap";

const initialState = { swaps: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SWAP: {
      return { swaps: action.swaps };
    }
    case CREATE_SWAP: {
      return {
        ...state,
        swaps: state.swaps.concat(action.swap),
      };
    }
  }

  return state;
};

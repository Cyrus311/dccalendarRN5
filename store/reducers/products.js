import PRODUCTS from "../../data/dummy-data";

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prop => prop.ownerId === "u1")
};

export default (state = initialState, action) => {
  return state;
};

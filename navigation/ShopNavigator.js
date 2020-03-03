import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ProductOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";

import Colors from "../constants/Colors";

const ProductNavigator = createStackNavigator(
  {
    ProductOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : ""
      },
      headerTitleStyle: {
        fontFamily: "open-sans-bold"
      },
      headerBackTitleStyle: {
        fontFamily: "open-sans"
      },
      headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
    }
  }
);

// const OrdersNavigator = createStackNavigator({});

export default createAppContainer(ProductNavigator);

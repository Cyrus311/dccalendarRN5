import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList
} from "@react-navigation/drawer";
import { Platform, SafeAreaView, Button, View } from "react-native";
import { useDispatch } from "react-redux";

import DutyOverviewScreen, {
  screenOptions as dutyOverviewScreenOptions
} from "../screens/DutyOverviewScreen";
import DutyDetailScreen, {
  screenOptions as dutyDetailScreenOptions
} from "../screens/DutyDetailScreen";
import CartScreen, {
  screenOptions as cartScreenOptions
} from "../screens/CartScreen";
import LeavesScreen, {
  screenOptions as leavesScreenOptions,
  screenOptions2 as leavesScreenOptions2
} from "../screens/LeavesScreen";
import UserProductScreen, {
  screenOptions as userProductScreenOptions
} from "../screens/UserProductScreen";
import LeaveAddScreen, {
  screenOptions as leaveAddScreenOptions
} from "../screens/LeaveAddScreen";
import AuthScreen, {
  screenOptions as authScreenOptions
} from "../screens/AuthScreen";
import StartupScreen from "../screens/StartupScreen";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as authAction from "../store/actions/auth";

const defaultNavOptions = {
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
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name="ProductOverview"
        component={DutyOverviewScreen}
        options={dutyOverviewScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="DutyDetail"
        component={DutyDetailScreen}
        options={dutyDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="Cart"
        component={CartScreen}
        options={cartScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="Orders"
        component={LeavesScreen}
        options={leavesScreenOptions2}
      />
      <ProductsStackNavigator.Screen
        name="AddLeave"
        component={LeaveAddScreen}
        options={leaveAddScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

// const ProductsNavigator = createStackNavigator(
//   {
//     ProductOverview: ProductOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
//   },
//   {
//     navigationOptions: {
//       // eslint-disable-next-line react/display-name
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
  return (
    <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <OrdersStackNavigator.Screen
        name="Orders"
        component={LeavesScreen}
        options={leavesScreenOptions}
      />
    </OrdersStackNavigator.Navigator>
  );
};

// const OrdersNavigator = createStackNavigator(
//   {
//     Orders: LeavesScreen
//   },
//   {
//     navigationOptions: {
//       // eslint-disable-next-line react/display-name
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === "android" ? "md-list" : "ios-list"}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen
        name="UserProducts"
        component={UserProductScreen}
        options={userProductScreenOptions}
      />
      <AdminStackNavigator.Screen
        name="EditProduct"
        component={LeaveAddScreen}
        options={leaveAddScreenOptions}
      />
    </AdminStackNavigator.Navigator>
  );
};

// const AdminNavigator = createStackNavigator(
//   {
//     UserProducts: UserProductScreen,
//     EditProduct: EditProductsScreen
//   },
//   {
//     navigationOptions: {
//       // eslint-disable-next-line react/display-name
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();
  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, padding: 20 }}>
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <DrawerItemList {...props} />
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authAction.logout());
                  // props.navigation.navigate("Auth");
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Nöbetlerim"
        component={ProductsNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="İzinlerim"
        component={OrdersNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Ayarlar"
        component={AdminNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

// const ShopNavigator = createDrawerNavigator(
//   {
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: AdminNavigator
//   },
//   {
//     contentOptions: {
//       activeTintColor: Colors.primary
//     },
//     // eslint-disable-next-line react/display-name
//     contentComponent: props => {
//       const dispatch = useDispatch();
//       return (
//         <View style={{ flex: 1, padding: 20 }}>
//           <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
//             <DrawerNavigatorItems {...props} />
//             <Button
//               title="Logout"
//               color={Colors.primary}
//               onPress={() => {
//                 dispatch(authAction.logout());
//                 // props.navigation.navigate("Auth");
//               }}
//             />
//           </SafeAreaView>
//         </View>
//       );
//     }
//   }
// );

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

// const AuthNavigator = createStackNavigator(
//   {
//     Auth: AuthScreen
//   },
//   {
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const MainNavigator = createSwitchNavigator({
//   Startup: StartupScreen,
//   Auth: AuthNavigator,
//   Shop: ShopNavigator
// });

// export default createAppContainer(MainNavigator);

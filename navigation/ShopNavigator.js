import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList
} from "@react-navigation/drawer";
import {
  Platform,
  SafeAreaView,
  Button,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

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
import LeaveAddScreen, {
  screenOptions as leaveAddScreenOptions
} from "../screens/LeaveAddScreen";
import AuthScreen, {
  screenOptions as authScreenOptions
} from "../screens/AuthScreen";
import SettingScreen, {
  screenOptions as settingScreenOptions
} from "../screens/SettingScreen";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as authAction from "../store/actions/auth";
import * as userAction from "../store/actions/user";
import TitleText from "../components/UI/TitleText";

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
        name="DutyOverview"
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

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={settingScreenOptions}
      />
      {/* <AdminStackNavigator.Screen
        name="EditProduct"
        component={LeaveAddScreen}
        options={leaveAddScreenOptions}
      /> */}
    </AdminStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAction.fetchUser());
  }, [dispatch]);

  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, padding: 20 }}>
            <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
              <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../assets/success.png")}
                    // source={{
                    //   uri:
                    //     'https://cdn.pixabay.com/photo/2016/05/05/23/52/mountain-summit-1375015_960_720.jpg'
                    // }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text>Merhaba,</Text>
                  <TitleText> {user.fullName} </TitleText>
                </View>
              </View>
              <DrawerItemList {...props} />
              <Button
                title="Çıkış"
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
              name={Platform.OS === "android" ? "md-medkit" : "ios-medkit"}
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
              name={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
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
              name={Platform.OS === "android" ? "md-settings" : "ios-settings"}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  imageContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: (Dimensions.get("window").width * 0.3) / 2,
    borderWidth: 3,
    borderColor: "black",
    overflow: "hidden",
    marginVertical: Dimensions.get("window").height / 50
    // alignSelf: "center"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  textContainer: { alignItems: "center" }
});

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

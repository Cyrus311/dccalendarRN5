import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Platform,
  SafeAreaView,
  Button,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import DutyOverviewScreen, {
  screenOptions as dutyOverviewScreenOptions,
} from "../screens/DutyOverviewScreen";
import DutyDetailScreen, {
  screenOptions as dutyDetailScreenOptions,
} from "../screens/DutyDetailScreen";
import LeavesScreen, {
  screenOptions as leavesScreenOptions,
} from "../screens/LeavesScreen";
import LeaveAddScreen, {
  screenOptions as leaveAddScreenOptions,
} from "../screens/LeaveAddScreen";
import AuthScreen, {
  screenOptions as authScreenOptions,
} from "../screens/AuthScreen";
import SettingScreen, {
  screenOptions as settingScreenOptions,
} from "../screens/SettingScreen";
// import SwapScreen, {
//   screenOptions as swapScreenOptions,
// } from "../screens/SwapScreen";
// import SwapRequestsScreen, {
//   screenOptions as swapRequestsScreenOptions,
// } from "../screens/SwapRequestsScreen";

import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as authAction from "../store/actions/auth";
import * as userAction from "../store/actions/user";
import TitleText from "../components/UI/TitleText";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const DutyScreenStackNavigator = createStackNavigator();

export const DutyNavigator = () => {
  return (
    <DutyScreenStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <DutyScreenStackNavigator.Screen
        name="DutyOverview"
        component={DutyOverviewScreen}
        options={dutyOverviewScreenOptions}
      />
      <DutyScreenStackNavigator.Screen
        name="DutyDetail"
        component={DutyDetailScreen}
        options={dutyDetailScreenOptions}
      />
    </DutyScreenStackNavigator.Navigator>
  );
};

// const DutyStackNavigator = createStackNavigator();

// export const DutyNavigator = () => {
//   return (
//     <DutyStackNavigator.Navigator
//       mode="modal"
//       screenOptions={defaultNavOptions}
//     >
//       <DutyStackNavigator.Screen
//         name="Duty"
//         component={DutyScreenNavigator}
//         options={{ headerShown: false }}
//       />
//       <DutyStackNavigator.Screen
//         name="Swap"
//         component={SwapScreen}
//         options={swapScreenOptions}
//       />
//     </DutyStackNavigator.Navigator>
//   );
// };

const LeaveStackNavigator = createStackNavigator();

export const LeaveNavigator = () => {
  return (
    <LeaveStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <LeaveStackNavigator.Screen
        name="Leaves"
        component={LeavesScreen}
        options={leavesScreenOptions}
      />
      <LeaveStackNavigator.Screen
        name="AddLeave"
        component={LeaveAddScreen}
        options={leaveAddScreenOptions}
      />
    </LeaveStackNavigator.Navigator>
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
    </AdminStackNavigator.Navigator>
  );
};

// const SwapRequestStackNavigator = createStackNavigator();

// export const SwapRequestNavigator = () => {
//   return (
//     <SwapRequestStackNavigator.Navigator screenOptions={defaultNavOptions}>
//       <SwapRequestStackNavigator.Screen
//         name="SwapRequestsScreen"
//         component={SwapRequestsScreen}
//         options={swapRequestsScreenOptions}
//       />
//     </SwapRequestStackNavigator.Navigator>
//   );
// };

const MainDrawerNavigator = createDrawerNavigator();

export const MainNavigator = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAction.fetchUser());
  }, [dispatch]);

  return (
    <MainDrawerNavigator.Navigator
      drawerContent={(props) => {
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
                  <Text style={styles.textContainer}>Merhaba,</Text>
                  <TitleText style={styles.textContainer}>
                    {user.fullName}
                  </TitleText>
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
        activeTintColor: Colors.primary,
      }}
    >
      <MainDrawerNavigator.Screen
        name="Nöbetlerim"
        component={DutyNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-medkit" : "ios-medkit"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <MainDrawerNavigator.Screen
        name="İzinlerim"
        component={LeaveNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      <MainDrawerNavigator.Screen
        name="Hesabım"
        component={AdminNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-person" : "md-person"}
              size={23}
              color={props.color}
            />
          ),
        }}
      />
      {/* <MainDrawerNavigator.Screen
        name="Takas Talepleri"
        component={SwapRequestNavigator}
        options={{
          // eslint-disable-next-line react/display-name
          drawerIcon: (props) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-settings" : "ios-settings"}
              size={23}
              color={props.color}
            />
          ),
        }}
      /> */}
    </MainDrawerNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").width * 0.3,
    borderRadius: (Dimensions.get("window").width * 0.3) / 2,
    borderWidth: 3,
    borderColor: Colors.tertiary,
    overflow: "hidden",
    marginVertical: Dimensions.get("window").height / 50,
    // alignSelf: "center"
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: { alignItems: "center", color: Colors.tertiary },
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

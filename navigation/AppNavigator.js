import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MainNavigator, AuthNavigator } from "./MainNavigator";
import StartupScreen from "../screens/StartupScreen";

const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuth && <MainNavigator />}
        {!isAuth && didTryAutoLogin && <AuthNavigator />}
        {!isAuth && !didTryAutoLogin && <StartupScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;

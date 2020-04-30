import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import FlatButton from "../components/UI/FlatButton";
import HeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const FORM_UPDATE = "FORM_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [tryEmailExist, setTryEmailExist] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const isEmailCheck = useSelector((state) => state.auth.isEmailCheck);
  const dispatch = useDispatch();

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidty) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidty,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
      fullName: "",
    },
    inputValidities: {
      email: false,
      password: false,
      fullName: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      setIsSignup(false);
      setTryEmailExist(false);
      Alert.alert("Hata Oluştu!", error, [
        {
          text: "Tamam",
          style: "destructive",
          onPress: () => {
            setError(null);
          },
        },
      ]);
    }
  }, [error]);

  useEffect(() => {
    const tryRegisterPushNotification = async () => {
      await registerForPushNotificationsAsync();
    };
    tryRegisterPushNotification();
  }, [dispatch]);

  useEffect(() => {
    if (isEmailCheck) {
      setIsSignup(false);
    } else if (tryEmailExist) {
      setIsSignup(true);
    }
  }, [isEmailCheck, isSignup, tryEmailExist]);

  useEffect(() => {
    props.navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          {tryEmailExist && (
            <Item
              title="Back"
              iconName={
                Platform.OS === "android" ? "md-arrow-back" : "ios-arrow-back"
              }
              onPress={() => {
                setError(null);
                setTryEmailExist(false);
                setIsLoading(false);
                setIsSignup(false);
              }}
            />
          )}
        </HeaderButtons>
      ),
    });
  }, [tryEmailExist]);

  const checkMailHandler = async () => {
    if (!formState.inputValidities.email) {
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.checkEmail(formState.inputValues.email));

      setTryEmailExist(true);
      setIsLoading(false);
      setIsSignup(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setIsSignup(false);
    }
  };

  const forgotPasswordHandler = async () => {
    if (!formState.inputValidities.email) {
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.forgot(formState.inputValues.email));

      setTryEmailExist(false);
      setIsLoading(false);
      setIsSignup(false);
      Alert.alert("Başarılı!", "Lütfen e-posta kutunuzu kontrol ediniz.", [
        { text: "Okay" },
      ]);
    } catch (error) {
      setError(error.message);
      setTryEmailExist(false);
      setIsLoading(false);
      setIsSignup(false);
    }
  };

  const authHandler = async () => {
    const proceed = isSignup
      ? !formState.formIsValid
      : !formState.inputValidities.email || !formState.inputValidities.password;
    if (proceed) {
      return;
    }

    let action;
    if (isSignup && tryEmailExist) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.fullName,
        expoPushToken
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      if (isSignup) {
        setIsLoading(false);
        setTryEmailExist(false);
        setIsSignup(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setTryEmailExist(false);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      // console.log(token);
      setExpoPushToken(token);
    } else {
      // alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ImageBackground
        source={require("../assets/back6.jpg")}
        style={styles.gradient}
        resizeMode="cover"
        // blurRadius={10}
      >
        {/* <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.gradient}
        > */}
        <Card style={styles.authContainer}>
          {/* scrollView açılınca ilk tıklamada klavye kapanıyor ama butona basılmıyor, ikinci tıklamada butona basılıyor */}
          {/* <ScrollView> */}
          <Input
            id="email"
            label="E-Mail"
            keyboardType="email-address"
            textContentType="emailAddress"
            required
            email
            autoCapitalize="none"
            autoCorrect={false}
            errorText="E-Mail adresi hatalı."
            onInputChange={inputChangeHandler}
            initialValue=""
            returnKeyType="next"
            onSubmitEditing={checkMailHandler}
          />
          {isSignup && (
            <Input
              id="fullName"
              label="Ad Soyad"
              keyboardType="default"
              textContentType="username"
              required
              minLength={5}
              autoCapitalize="words"
              errorText="Lütfen tam adınızı giriniz."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
          )}
          {tryEmailExist && (
            <Input
              id="password"
              label="Şifre"
              keyboardType="default"
              secureTextEntry
              textContentType="password"
              required
              minLength={8}
              autoCapitalize="none"
              errorText="Lütfen geçerli bir şifre giriniz. Minimum 8 karakter."
              onInputChange={inputChangeHandler}
              initialValue=""
              returnKeyType="done"
              onSubmitEditing={authHandler}
            />
          )}
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : !tryEmailExist ? (
              <Button
                title="Devam Et"
                color={Colors.primary}
                disabled={!formState.inputValidities.email}
                onPress={checkMailHandler}
              />
            ) : (
              <View>
                <Button
                  title={isSignup ? "Kayıt Ol" : "Giriş Yap"}
                  color={Colors.primary}
                  disabled={
                    isSignup
                      ? !formState.formIsValid
                      : !formState.inputValidities.email ||
                        !formState.inputValidities.password
                  }
                  onPress={authHandler}
                />
                {!isSignup && (
                  <FlatButton
                    text="Şifremi Unuttum"
                    styleButton={styles.forgotPasswordButton}
                    styleButtonText={styles.forgotPasswordButtonText}
                    onPress={forgotPasswordHandler}
                  />
                )}
              </View>
            )}
          </View>
          {/* </ScrollView> */}
        </Card>
        {/* </LinearGradient> */}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = (navData) => {
  // const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: "Omnicali",
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
  forgotPasswordButton: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  forgotPasswordButtonText: {
    color: Colors.tertiary,
    fontSize: 12,
  },
});

export default AuthScreen;

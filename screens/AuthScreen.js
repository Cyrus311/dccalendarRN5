import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const FORM_UPDATE = "FORM_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [tryEmailExist, setTryEmailExist] = useState(false);
  const isEmailCheck = useSelector(state => state.auth.isEmailCheck);
  const dispatch = useDispatch();

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidty) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidty,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
      fullname: ""
    },
    inputValidities: {
      email: false,
      password: false,
      fullname: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  useEffect(() => {
    if (isEmailCheck) {
      setIsSignup(false);
    } else if (tryEmailExist) {
      setIsSignup(true);
    }
  }, [isEmailCheck, isSignup, tryEmailExist]);

  const checkMailHandler = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.checkEmail(formState.inputValues.email));

      setTryEmailExist(true);
      setIsLoading(false);
      // props.navigation.navigate("Shop");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setIsSignup(false);
    }
  };

  const authHandler = async () => {
    let action;
    if (isSignup && tryEmailExist) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
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
      // props.navigation.navigate("Shop");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setTryEmailExist(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              autoCorrect={false}
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            {isSignup && (
              <Input
                id="fullname"
                label="Name"
                keyboardType="default"
                required
                minLength={5}
                autoCapitalize="words"
                errorText="Please enter a name."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            )}
            {tryEmailExist && (
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password."
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            )}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : !tryEmailExist ? (
                <Button
                  title="Submit"
                  color={Colors.primary}
                  onPress={checkMailHandler}
                />
              ) : (
                <Button
                  title={isSignup ? "Sign Up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;

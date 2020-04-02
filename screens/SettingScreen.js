import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Picker,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform
} from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../components/UI/FlatButton";
import { titleEnum } from "../constants/titleEnum";
import * as calendarActions from "../store/actions/calendar";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";

export default function SettingScreen(props) {
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const reviewSchema = yup.object({});

  const handleFromSubmit = async values => {
    try {
      setError(null);
      await dispatch(calendarActions.createCalendar(values));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Hata Oluştu!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Formik
          initialValues={{
            description: "",
            type: 2,
            date: new Date(),
            date2: new Date()
          }}
          validationSchema={reviewSchema}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleFromSubmit(values);
          }}
        >
          {props => (
            <View>
              <Picker
                // passing value directly from formik
                selectedValue={props.values.type}
                // changing value in formik
                onValueChange={itemValue =>
                  props.setFieldValue("type", itemValue)
                }
              >
                <Picker.Item
                  label="Ünvan Seçiniz"
                  value={props.initialValues.type}
                  key={0}
                />
                <Picker.Item label={titleEnum[1]} value={1} key={1} />
                <Picker.Item label={titleEnum[2]} value={2} key={2} />
                <Picker.Item label={titleEnum[3]} value={3} key={3} />
                <Picker.Item label={titleEnum[4]} value={4} key={4} />
                <Picker.Item label={titleEnum[5]} value={4} key={5} />
              </Picker>

              <FlatButton onPress={props.handleSubmit} text="kaydet" />
            </View>
          )}
        </Formik>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center"
  }
});

export const screenOptions = navData => {
  return {
    headerTitle: "Ayarlar",
    // eslint-disable-next-line react/display-name
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

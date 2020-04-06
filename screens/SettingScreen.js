import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Picker,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../components/UI/FlatButton";
import { titleEnum } from "../constants/titleEnum";
import * as userActions from "../store/actions/user";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/Colors";

export default function SettingScreen(props) {
  const [error, setError] = useState();
  const user = useSelector((state) => state.user.user);
  const [title, setTitle] = useState(user.title);
  const dispatch = useDispatch();

  const reviewSchema = yup.object({});

  const handleFormSubmit = async (values) => {
    try {
      setError(null);
      await dispatch(userActions.updateUser(user.id, values));
      Alert.alert("Başarılı!", "Değişiklik yapıldı.", [{ text: "Okay" }]);
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
            title: title,
          }}
          validationSchema={reviewSchema}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleFormSubmit(values);
          }}
        >
          {(props) => (
            <View>
              <Picker
                // passing value directly from formik
                selectedValue={props.values.title}
                // changing value in formik
                onValueChange={(itemValue) => {
                  setTitle(itemValue);
                  props.setFieldValue("title", itemValue);
                }}
              >
                <Picker.Item
                  label="Ünvan Seçiniz"
                  value={props.initialValues.title}
                  key={0}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={titleEnum[1]}
                  value={titleEnum[1]}
                  key={1}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={titleEnum[2]}
                  value={titleEnum[2]}
                  key={2}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={titleEnum[3]}
                  value={titleEnum[3]}
                  key={3}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={titleEnum[4]}
                  value={titleEnum[4]}
                  key={4}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={titleEnum[5]}
                  value={titleEnum[5]}
                  key={5}
                />
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
    paddingHorizontal: 20,
    backgroundColor: Colors.backColor,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },
});

export const screenOptions = (navData) => {
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
    ),
  };
};

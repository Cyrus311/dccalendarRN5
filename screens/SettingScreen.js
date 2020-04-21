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
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../components/UI/FlatButton";
// import { titleEnum } from "../constants/titleEnum";
import * as userActions from "../store/actions/user";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function SettingScreen(props) {
  const [error, setError] = useState();
  const user = useSelector((state) => state.user.user);
  // const [title, setTitle] = useState(user.title);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [isPasswordUpdate, setisPasswordUpdate] = useState(false);
  const dispatch = useDispatch();

  const reviewSchema = yup.object({
    fullName: yup
      .string()
      .required("Zorunlu Alan!")
      .min(5, "Lütfen tam adınızı giriniz."),
    email: yup
      .string()
      .email("E-Mail adresi hatalı.")
      .required("Zorunlu Alan!"),
    isPasswordUpdate: yup.bool(),
    oldPassword: yup.string().when("isPasswordUpdate", {
      is: () => isPasswordUpdate,
      then: yup
        .string()
        .required("Zorunlu Alan!")
        .min(8, "En az 8 karakter giriniz."),
      otherwise: yup.string().notRequired(),
    }),
    currentPassword: yup.string().when("isPasswordUpdate", {
      is: () => isPasswordUpdate,
      then: yup
        .string()
        .required("Zorunlu Alan!")
        .min(8, "En az 8 karakter giriniz."),
      otherwise: yup.string().notRequired(),
    }),
  });

  const handleFormSubmit = async (values) => {
    try {
      setError(null);
      await dispatch(userActions.updateUser(user.id, values));
      setFullName(values.fullName);
      setEmail(values.email);
      setisPasswordUpdate(false);
      Alert.alert("Başarılı!", "Değişiklik yapıldı.", [{ text: "Okay" }]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setisPasswordUpdate(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

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
            // title: title,
            fullName: fullName,
            email: email,
          }}
          validationSchema={reviewSchema}
          onSubmit={async (values, actions) => {
            await handleFormSubmit(values);
            actions.resetForm();
          }}
        >
          {(props) => (
            <View>
              {!isPasswordUpdate ? (
                <View>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      style={styles.Icon}
                      name={
                        Platform.OS === "android" ? "md-person" : "ios-person"
                      }
                      size={30}
                    />
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={Colors.textColor}
                      underlineColorAndroid="transparent"
                      onChangeText={props.handleChange("fullName")}
                      onBlur={props.handleBlur("fullName")}
                      value={props.values.fullName}
                    />
                  </View>
                  <Text style={styles.errorText}>
                    {props.touched.fullName && props.errors.fullName}
                  </Text>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      style={styles.Icon}
                      name={Platform.OS === "android" ? "md-mail" : "ios-mail"}
                      size={30}
                    />
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={Colors.textColor}
                      underlineColorAndroid="transparent"
                      onChangeText={props.handleChange("email")}
                      onBlur={props.handleBlur("email")}
                      value={props.values.email.trim()}
                    />
                  </View>
                  <Text style={styles.errorText}>
                    {props.touched.email && props.errors.email}
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      style={styles.Icon}
                      name={Platform.OS === "android" ? "md-key" : "ios-key"}
                      size={30}
                    />
                    <TextInput
                      secureTextEntry
                      style={styles.input}
                      placeholderTextColor={Colors.textColor}
                      placeholder="Şifre"
                      underlineColorAndroid="transparent"
                      onChangeText={props.handleChange("oldPassword")}
                      onBlur={props.handleBlur("oldPassword")}
                      value={props.values.oldPassword}
                    />
                  </View>
                  <Text style={styles.errorText}>
                    {props.errors.oldPassword}
                  </Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      style={styles.Icon}
                      name={Platform.OS === "android" ? "md-key" : "ios-key"}
                      size={30}
                    />
                    <TextInput
                      secureTextEntry
                      style={styles.input}
                      placeholderTextColor={Colors.textColor}
                      placeholder=" Yeni Şifre"
                      underlineColorAndroid="transparent"
                      onChangeText={props.handleChange("currentPassword")}
                      onBlur={props.handleBlur("currentPassword")}
                      value={props.values.currentPassword}
                    />
                  </View>
                  <Text style={styles.errorText}>
                    {props.errors.currentPassword}
                  </Text>
                </View>
              )}

              {/* <Picker
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
              </Picker> */}

              {!isPasswordUpdate && (
                <FlatButton
                  styleButton={styles.passwordButton}
                  styleButtonText={styles.passwordButtonText}
                  onPress={() => {
                    setisPasswordUpdate(!isPasswordUpdate);
                  }}
                  text="Şifre Güncelle"
                />
              )}

              <FlatButton
                onPress={props.handleSubmit}
                text="kaydet"
                disabled={true}
              />
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
    paddingVertical: 20,
    textAlignVertical: "center",
    backgroundColor: Colors.backColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.textColor,
    padding: 10,
    borderRadius: 6,
  },
  Icon: { paddingHorizontal: 10, color: Colors.textColor },
  picker: { color: Colors.textColor },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.textColor,
  },
  errorText: {
    color: Colors.danger,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },
  passwordButton: {
    backgroundColor: Colors.primary,
    marginVertical: 30,
  },
  passwordButtonText: {},
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "Hesabım",
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

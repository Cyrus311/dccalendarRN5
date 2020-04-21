import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Picker,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import FlatButton from "../components/UI/FlatButton";
import { typeEnum } from "../constants/typeEnum";
import * as calendarActions from "../store/actions/calendar";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function LeaveAddScreen(props) {
  // const [datetime, setDatetime] = useStateWithCallback(new Date(), () =>
  //   setDatePickerVisibility(Platform.OS === "ios")
  // );
  // const [datetimeEnd, setDatetimeEnd] = useStateWithCallback(new Date(), () =>
  //   setDatePickerVisibilityEnd(Platform.OS === "ios")
  // );
  const [datetime, setDatetime] = useState(new Date());
  const [datetimeEnd, setDatetimeEnd] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleEnd, setDatePickerVisibilityEnd] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const reviewSchema = yup.object({
    date: yup.date().required("Zorunlu Alan!"),
    date2: yup
      .date()
      .required("Zorunlu Alan!")
      .test(
        "is-endDate-bigger",
        "Başlangıç tarihi Bitiş tarihinden büyük olamaz!",
        (val) => {
          return moment(val).isSameOrAfter(datetime, "day");
        }
      )
      .test(
        "is-days-moreThen30",
        "30 günden fazla izin talep edilemez!",
        (val) => {
          return moment(val).diff(datetime, "days") <= 30;
        }
      ),
    description: yup
      .string()
      .required("Zorunlu Alan!")
      .min(8, "En az 8 karakter!"),
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePickerEnd = () => {
    setDatePickerVisibilityEnd(true);
  };

  const hideDatePickerEnd = () => {
    setDatePickerVisibilityEnd(false);
  };

  const handleConfirm = (date) => {
    setDatetime(date);
    setDatetimeEnd(date);
  };

  const handleConfirmEnd = (date) => {
    setDatetimeEnd(date);
  };

  const handleFormSubmit = async (values) => {
    try {
      setError(null);
      await dispatch(calendarActions.createCalendar(values));
      props.navigation.navigate("Leaves");
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
            date2: new Date(),
          }}
          validationSchema={reviewSchema}
          onSubmit={(values, actions) => {
            actions.resetForm();
            handleFormSubmit(values);
          }}
        >
          {(props) => (
            <View>
              <TouchableWithoutFeedback onPress={showDatePicker}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    style={styles.Icon}
                    name={
                      Platform.OS === "android" ? "md-calendar" : "ios-calendar"
                    }
                    size={30}
                  />
                  <Text style={styles.input}>
                    {moment(datetime).format("DD MMMM YYYY")}
                  </Text>
                  <DateTimePickerModal
                    confirmTextIOS="Seç"
                    cancelTextIOS="İptal"
                    headerTextIOS="Başlangıç Tarihi"
                    isVisible={isDatePickerVisible}
                    minimumDate={new Date(moment())}
                    date={datetime}
                    mode="date"
                    locale="tr"
                    onConfirm={(date) => {
                      hideDatePicker();
                      props.setFieldValue("date", date);
                      props.setFieldValue("date2", date);
                      handleConfirm(date);
                    }}
                    onCancel={hideDatePicker}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.errorText}>
                {props.touched.date && props.errors.date}
              </Text>
              <TouchableWithoutFeedback onPress={showDatePickerEnd}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    style={styles.Icon}
                    name={
                      Platform.OS === "android" ? "md-calendar" : "ios-calendar"
                    }
                    size={30}
                  />
                  <Text style={styles.input}>
                    {moment(datetimeEnd).format("DD MMMM YYYY")}
                  </Text>
                  <DateTimePickerModal
                    confirmTextIOS="Seç"
                    cancelTextIOS="İptal"
                    headerTextIOS="Bitiş Tarihi"
                    isVisible={isDatePickerVisibleEnd}
                    minimumDate={props.values.date}
                    date={datetimeEnd}
                    mode="date"
                    locale="tr"
                    onConfirm={(date) => {
                      hideDatePickerEnd();
                      props.setFieldValue("date2", date);
                      handleConfirmEnd(date);
                    }}
                    onCancel={hideDatePickerEnd}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.errorText}>
                {props.touched.date2 && props.errors.date2}
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={Colors.textColor}
                  underlineColorAndroid="transparent"
                  multiline
                  minHeight={60}
                  placeholder="Açıklama"
                  onChangeText={props.handleChange("description")}
                  onBlur={props.handleBlur("description")}
                  value={props.values.description}
                />
              </View>
              <Text style={styles.errorText}>
                {props.touched.description && props.errors.description}
              </Text>

              <Picker
                // passing value directly from formik
                selectedValue={props.values.type}
                // changing value in formik
                onValueChange={(itemValue) =>
                  props.setFieldValue("type", itemValue)
                }
              >
                <Picker.Item
                  label="İzin Tipi Seçiniz"
                  value={props.initialValues.type}
                  key={2}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[8]}
                  value={8}
                  key={8}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[2]}
                  value={2}
                  key={2}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[7]}
                  value={7}
                  key={7}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[3]}
                  value={3}
                  key={3}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[4]}
                  value={4}
                  key={4}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[5]}
                  value={5}
                  key={5}
                />
                <Picker.Item
                  color={Colors.textColor}
                  label={typeEnum[6]}
                  value={6}
                  key={6}
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
});

export const screenOptions = (navData) => {
  return {
    headerTitle: "İzin Ekle",
  };
};

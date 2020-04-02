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
import { typeEnum } from "../constants/typeEnum";
import * as calendarActions from "../store/actions/calendar";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";

export default function LeaveAddScreen(props) {
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
        val => {
          return moment(val).isSameOrAfter(datetime, "day");
        }
      )
      .test(
        "is-days-moreThen30",
        "30 günden fazla izin talep edilemez!",
        val => {
          return moment(val).diff(datetime, "days") <= 30;
        }
      ),
    description: yup
      .string()
      .required("Zorunlu Alan!")
      .min(8)
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

  const handleConfirm = date => {
    setDatetime(date);
    hideDatePicker();
  };

  const handleConfirmEnd = date => {
    setDatetimeEnd(date);
    hideDatePicker();
  };

  const handleFromSubmit = async values => {
    try {
      setError(null);
      await dispatch(calendarActions.createCalendar(values));
      props.navigation.navigate("DutyOverview");
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
              <TouchableWithoutFeedback onPress={showDatePicker}>
                <View style={{ flexDirection: "row" }}>
                  <Button title="Başlangıç: " onPress={showDatePicker} />
                  <Text style={styles.input}>
                    {moment(datetime).format("DD MMMM YYYY")}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    // minimumDate={new Date(moment())}
                    date={props.values.date}
                    mode="date"
                    locale="tr"
                    onConfirm={date => {
                      props.setFieldValue("date", date);
                      handleConfirm(date);
                      hideDatePicker();
                    }}
                    onCancel={hideDatePicker}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.errorText}>
                {props.touched.date && props.errors.date}
              </Text>
              <TouchableWithoutFeedback onPress={showDatePickerEnd}>
                <View style={{ flexDirection: "row" }}>
                  <Button title="Bitiş: " onPress={showDatePickerEnd} />
                  <Text style={styles.input}>
                    {moment(datetimeEnd).format("DD MMMM YYYY")}
                  </Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisibleEnd}
                    // minimumDate={new Date(moment())}
                    date={props.values.date2}
                    mode="date"
                    locale="tr"
                    onConfirm={date => {
                      props.setFieldValue("date2", date);
                      handleConfirmEnd(date);
                      hideDatePickerEnd();
                    }}
                    onCancel={hideDatePickerEnd}
                  />
                </View>
              </TouchableWithoutFeedback>
              <Text style={styles.errorText}>
                {props.touched.date2 && props.errors.date2}
              </Text>

              <TextInput
                style={styles.input}
                multiline
                minHeight={60}
                placeholder="Açıklama"
                onChangeText={props.handleChange("description")}
                onBlur={props.handleBlur("description")}
                value={props.values.description}
              />
              <Text style={styles.errorText}>
                {props.touched.description && props.errors.description}
              </Text>

              <Picker
                // passing value directly from formik
                selectedValue={props.values.type}
                // changing value in formik
                onValueChange={itemValue =>
                  props.setFieldValue("type", itemValue)
                }
              >
                <Picker.Item
                  label="İzin Tipi Seçiniz"
                  value={props.initialValues.type}
                  key={2}
                />
                <Picker.Item label={typeEnum[2]} value={2} key={2} />
                <Picker.Item label={typeEnum[3]} value={3} key={3} />
                <Picker.Item label={typeEnum[4]} value={4} key={4} />
                <Picker.Item label={typeEnum[5]} value={5} key={5} />
                <Picker.Item label={typeEnum[6]} value={6} key={6} />
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
    headerTitle: "İzin Ekle"
  };
};

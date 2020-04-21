import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import DutyItem from "../components/items/DutyItem";
import * as calendarActions from "../store/actions/calendar";
import Colors from "../constants/Colors";
import ArrowIcon from "../components/UI/ArrowIcon";

const DutyDetailScreen = (props) => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  const plistOfDate = getDaysArray(year, month);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [listOfDate, setListOfDate] = useState(plistOfDate);
  const [activeIndex, updActiveIndex] = useState(-1);
  const duty = useSelector((state) => state.calendars.dailyCalendars);
  const user = useSelector((state) => state.user.user);
  const [calendar, setCalendar] = useState({});
  const dispatch = useDispatch();
  const calendarObj = JSON.parse(props.route.params.calendar);
  const calendarId = calendarObj ? calendarObj.id : "";
  const [selectedDate, setSelectedDate] = useState(calendarObj.startDate);
  let passedActiveItem = moment(selectedDate).format("D");

  const getItemLayout = (data, index) => ({
    length: 85,
    offset: 85 * index,
    index,
  });

  const _onPress = ({ item }) => {
    setSelectedDate(item.date);
    updActiveIndex(item.id);
  };

  const loadDuty = useCallback(
    async (date) => {
      setError(null);
      setIsRefreshing(true);
      try {
        if (passedActiveItem) {
          updActiveIndex(+passedActiveItem);
          passedActiveItem = null;
        }

        await dispatch(calendarActions.dailyCalendar(date));
      } catch (error) {
        console.log("dutyERROR", error);
        setError(error.message);
      }
      setIsRefreshing(false);
    },
    [dispatch, setIsLoading, setError]
  );

  useEffect(() => {
    const unsubscribe = props.navigation.addListener(
      "focus",
      loadDuty.bind(this, selectedDate)
    );

    return () => {
      unsubscribe();
    };
  }, [loadDuty]);

  useEffect(() => {
    if (calendarId !== "") {
      setCalendar(duty);
    }
  }, [calendarId]);

  useEffect(() => {
    setIsLoading(true);
    loadDuty(selectedDate).then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDuty, activeIndex]);

  let keyExtractor = (item, index) => index.toString();

  let renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() => _onPress({ item })}
        underlayColor="transparent"
        style={[
          styles.viewArea,
          {
            backgroundColor:
              activeIndex === item.id ? Colors.tertiary : "#ffffff",
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.textArea,
              {
                color: activeIndex === item.id ? "#fff" : "#ced4cc",
              },
            ]}
          >
            {item.day}
          </Text>
          <Text
            style={[
              styles.smallTextArea,
              {
                color: activeIndex === item.id ? "#fff" : "#ced4cc",
              },
            ]}
          >
            {item.shortName}
          </Text>
          <Ionicons
            style={styles.icon}
            name="ios-more"
            size={32}
            color="white"
          />
        </View>
      </TouchableHighlight>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Hata Oluştu!</Text>
        <Button
          title="Tekrar Deneyin"
          onPress={loadDuty.bind(this, selectedDate)}
          color={Colors.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.daysContainer}>
        <FlatList
          initialScrollIndex={activeIndex - 2}
          renderItem={(item) => renderItem(item)}
          // ref={ref => {
          //   this.flatListRef = ref;
          // }}
          // initialNumToRender={5}
          getItemLayout={getItemLayout}
          data={listOfDate}
          horizontal={true}
          keyExtractor={keyExtractor}
        />
        <ArrowIcon />
      </View>
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {!isLoading && duty.length === 0 && (
        <View style={[styles.centered]}>
          <View style={styles.noDutyContainer}>
            <Text style={styles.text}>
              Seçili gün için atanmış nöbetçi bulunamadı.
            </Text>
          </View>
        </View>
      )}
      {!isLoading && (
        <View style={styles.dutyContainer}>
          <FlatList
            onRefresh={loadDuty.bind(this, selectedDate)}
            refreshing={isRefreshing}
            data={duty}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <DutyItem
                date={itemData.item.calendar.readableDate}
                location={itemData.item.location}
                description={itemData.item.calendar.description}
                onSelect={() => {}}
                user={itemData.item.user}
                // selectable={user.id !== itemData.item.user.id}
              >
                {/* {user.id !== itemData.item.user.id && (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate("Swap")}
                    style={styles.swapButton}
                  >
                    <Ionicons
                      name={Platform.OS === "android" ? "md-swap" : "ios-swap"}
                      size={30}
                      color={Colors.tertiary}
                    />
                  </TouchableOpacity>
                )} */}
              </DutyItem>
            )}
          />
        </View>
      )}
    </View>
  );
};

export const screenOptions = (navData) => {
  return {
    // headerTitle: navData.route.params.productTitle
    headerTitle: "Nöbetçi Listesi",
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  centered: {
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
  },
  daysContainer: {
    height: "15%",
    width: "100%",
    minHeight: 109,
    flexDirection: "row",
  },
  dutyContainer: { height: "85%" },
  noDutyContainer: {
    flex: 1,
    paddingTop: 15,
  },
  safeArea: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    // maxWidth: 340,
    alignSelf: "center",
    // justifyContent: 'center',
  },
  viewArea: {
    marginRight: 5,
    marginTop: 5,
    minHeight: 102,
    width: 80,
    paddingTop: 10,
    borderWidth: 0.5,
    borderColor: Colors.tertiary,
    borderRadius: 20,
  },
  textArea: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
  },
  smallTextArea: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "400",
    fontSize: 18,
  },
  icon: {
    alignSelf: "center",
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 6,
    paddingHorizontal: 4,
    color: Colors.textColor,
  },
  swapButton: {},
});

const getDaysArray = (year, month) => {
  const monthIndex = month - 1;
  const names = Object.freeze([
    "Paz",
    "Pzt",
    "Sal",
    "Çar",
    "Per",
    "Cum",
    "Cmt",
  ]);
  const date = new Date(year, monthIndex, 1);
  const result = [];
  while (date.getMonth() == monthIndex) {
    result.push(
      {
        id: Number(date.getDate()),
        day: date.getDate(),
        shortName: names[date.getDay()],
        date: moment(date),
      }
      // `${date.getDate()}-${names[date.getDay()]}`
    );
    date.setDate(date.getDate() + 1);
  }
  return result;
};

export default DutyDetailScreen;

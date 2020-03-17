import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as calendarActions from "../../store/actions/calendar";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const DutyDetailScreen = props => {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const year = dateObj.getUTCFullYear();
  const plistOfDate = getDaysArray(year, month);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [listOfDate, setListOfDate] = useState(plistOfDate);
  const [activeIndex, updActiveIndex] = useState(-1);
  const duty = useSelector(state => state.calendars.dailyCalenders);
  const [calendar, setCalendar] = useState({});
  const dispatch = useDispatch();
  const calendarObj = JSON.parse(props.route.params.calendar);
  const calendarId = calendarObj ? calendarObj.id : "";
  const [selectedDate,setSelectedDate] = useState(calendarObj.date);
  let passedActiveItem = moment(selectedDate).format("D");
  console.log("activeIndex", activeIndex);

  const getItemLayout = (data, index) => ({
    length: 85,
    offset: 85 * index,
    index
  });

  const _onPress = ({ item }) => {
    //setPassedItem(-1);
    console.log("sdasdasasd", item.id);
    updActiveIndex(item.id);
    // console.log(passedActiveItem);
  };

  const loadDuty = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log("selectedDate1", selectedDate);
      if (passedActiveItem) {
        console.log("success");
        updActiveIndex(+passedActiveItem);
        passedActiveItem = null;
      }

      await dispatch(calendarActions.dailyCalendar(selectedDate));
    } catch (error) {
      console.log("dutyERROR", error);
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError, setSelectedDate]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", loadDuty);

    return () => {
      unsubscribe();
    };
  }, [loadDuty]);

  useEffect(() => {
    if (calendarId !== "") {
      console.log("setCalendar");      
      setCalendar(duty);
    }
  }, [calendarId]);

  useEffect(() => {
    setIsLoading(true);    
    setSelectedDate(moment("2020-03-07T12:00:00.000Z"));
    loadDuty().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDuty,activeIndex]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title
    });
  };

  let keyExtractor = (item, index) => index.toString();

  let renderItem = ({ item }) => {
    // console.log("item", item);

    return (
      <TouchableHighlight
        onPress={() => _onPress({ item })}
        style={[
          styles.viewArea,
          {
            backgroundColor: activeIndex === item.id ? "#79c962" : "#ffffff"
          }
        ]}
      >
        <View>
          <Text
            style={[
              styles.textArea,
              {
                color: activeIndex === item.id ? "#fff" : "#ced4cc"
              }
            ]}
          >
            {item.day}
          </Text>
          <Text
            style={[
              styles.smallTextArea,
              {
                color: activeIndex === item.id ? "#fff" : "#ced4cc"
              }
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
        <Text>An error occurred!</Text>
        <Button title="Try Again" onPress={loadDuty} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && duty.length === 0) {
    <View style={styles.centered}>
      <Text>No duty found.</Text>
    </View>;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.daysContainer}>
        <FlatList
          initialScrollIndex={activeIndex - 2}
          renderItem={item => renderItem(item)}
          // ref={ref => {
          //   this.flatListRef = ref;
          // }}
          // initialNumToRender={5}
          getItemLayout={getItemLayout}
          data={listOfDate}
          horizontal={true}
          keyExtractor={keyExtractor}
        />

        <View
          style={{
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "flex-end",
            width: "5%"
          }}
        >
          <Ionicons
            name="ios-arrow-forward"
            size={24}
            color="grey"
            style={{ marginTop: "50%" }}
          ></Ionicons>
        </View>
      </View>
      <View style={styles.dutyContainer}>
        <FlatList
          onRefresh={loadDuty}
          refreshing={isRefreshing}
          data={duty}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ProductItem
              date={itemData.item.calendar.readableDate}
              location={itemData.item.location.name}
              description={itemData.item.calendar.description}
              onSelect={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            >
              <Button
                color={Colors.primary}
                title="Detay"
                onPress={() => {
                  selectItemHandler(itemData.item.id, itemData.item.title);
                }}
              />
              <Button
                color={Colors.primary}
                title="Takas"
                onPress={() => {
                  dispatch(cartActions.addToCart(itemData.item));
                }}
              />
            </ProductItem>
          )}
        />
      </View>
    </View>
  );
};

export const screenOptions = navData => {
  return {
    // headerTitle: navData.route.params.productTitle
    headerTitle: "Nöbetçi Listesi"
  };
};

const styles = StyleSheet.create({
  screen: { backgroundColor: Colors.backColor },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  daysContainer: { height: "15%", width: "95%", flexDirection: "row" },
  dutyContainer: { height: "85%" },
  safeArea: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    // maxWidth: 340,
    alignSelf: "center"
    // justifyContent: 'center',
  },
  viewArea: {
    marginRight: 5,
    marginTop: 5,

    // height: '100%',
    width: 80,
    // height: 80,
    paddingTop: 10,
    //paddingBottom: 20,
    borderWidth: 0.5,
    borderColor: "#79c962",
    borderRadius: 20
  },

  textArea: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20
  },
  smallTextArea: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "400",
    fontSize: 18
  },

  icon: {
    alignSelf: "center"
  }
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
    "Cmt"
  ]);
  const date = new Date(year, monthIndex, 1);
  const result = [];
  while (date.getMonth() == monthIndex) {
    result.push(
      {
        id: Number(date.getDate()),
        day: date.getDate(),
        shortName: names[date.getDay()]
      }
      // `${date.getDate()}-${names[date.getDay()]}`
    );
    date.setDate(date.getDate() + 1);
  }
  return result;
};

export default DutyDetailScreen;

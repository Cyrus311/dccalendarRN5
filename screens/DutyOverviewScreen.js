import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";

import DutyItem from "../components/items/DutyItem";
import * as calendarActions from "../store/actions/calendar";
import HeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/Colors";

const DutyOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const duty = useSelector((state) => state.calendars.mountCalendars);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const loadDuty = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    props.navigation.closeDrawer();
    try {
      // filter: {"where":{"date":{"between":["2020-05-01","2020-05-31"]},"groupId":{"like":"5e8db35c3322910099e91a2b"},"type":1},"include":[{"relation":"group"},{"relation":"user"},{"relation":"location"}]}
      if (user.groups && user.groups.length <= 0) {
        Alert.alert(
          "Bağlı grup bulunamadı!",
          "Lütfen sistem yöneticinize başvurunuz",
          [{ text: "Okay" }]
        );
        return;
      }

      const filterData = {
        filter: {
          where: {
            groupId: {
              like: user.groups ? user.groups[0].id : "",
            },
          },
          include: [
            {
              relation: "group",
            },
            {
              relation: "user",
            },
            {
              relation: "location",
            },
          ],
        },
      };
      await dispatch(calendarActions.fetchCalendar(filterData));
    } catch (error) {
      console.log("dutyERROR", error);
      setError(error.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", loadDuty);

    return () => {
      unsubscribe();
    };
  }, [loadDuty]);

  useEffect(() => {
    setIsLoading(true);
    loadDuty().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDuty]);

  const selectItemHandler = (calendar) => {
    props.navigation.navigate("DutyDetail", {
      calendar: JSON.stringify(calendar),
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Hata Oluştu!</Text>
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
    return (
      <View style={styles.centered}>
        <Text style={{ color: Colors.primary }}>Nöbetiniz bulunamadı.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "default" : "dark-content"}
        backgroundColor="#6a51ae"
      />
      <View style={styles.screen}>
        <View style={styles.infoArea}>
          <View>
            <Text style={styles.text}>{moment().format("MMMM")}</Text>
          </View>
        </View>
        <View style={styles.dutyListContainer}>
          <FlatList
            onRefresh={loadDuty}
            refreshing={isRefreshing}
            data={duty}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
              <DutyItem
                date={itemData.item.calendar.readableDate}
                location={itemData.item.location}
                description={itemData.item.calendar.description}
                onSelect={() => {
                  selectItemHandler(itemData.item.calendar);
                }}
                navigatable
              ></DutyItem>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Nöbetlerim",
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
    // eslint-disable-next-line react/display-name
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="DutyDetail"
          iconName={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
          onPress={() => {
            navData.navigation.navigate("DutyDetail", {
              calendar: JSON.stringify({ date: moment() }),
            });
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backColor },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  dutyListContainer: { height: "95%" },
  infoArea: {
    alignItems: "center",
    height: 45,
    borderWidth: 1,
    borderColor: Colors.textColor,
    backgroundColor: Colors.primary,
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    color: Colors.dateText,
  },
});

export default DutyOverviewScreen;

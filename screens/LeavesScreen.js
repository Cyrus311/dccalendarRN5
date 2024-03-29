import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import * as calendarActions from "../store/actions/calendar";
import HeaderButton from "../components/UI/HeaderButton";
import LeaveItem from "../components/items/LeaveItem";
import Colors from "../constants/Colors";

const LeavesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const duty = useSelector((state) => state.calendars.noDutyCalendars);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(ordersActions.fetchOrders()).then(() => {
  //     setIsLoading(false);
  //   });
  // }, [dispatch]);

  const loadDuty = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
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

  const deleteCalendarHandler = async (id) => {
    try {
      await dispatch(calendarActions.deleteCalendar(id));
    } catch (error) {
      console.log("dutyERROR", error);
      setError(error.message);
    }
  };

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
        <ActivityIndicator size="large" color={Colors.textColor} />
      </View>
    );
  }

  if (duty.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>İzin kaydı bulunamadı!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <FlatList
          onRefresh={loadDuty}
          refreshing={isRefreshing}
          data={duty}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <LeaveItem
              date={moment(itemData.item.calendar.startDate).format("DD MMM")}
              date2={moment(itemData.item.calendar.endDate).format("DD MMM")}
              status={itemData.item.calendar.status}
              type={itemData.item.calendar.type}
              description={itemData.item.calendar.description}
              onSelect={() => {}}
              onRemove={() => {
                deleteCalendarHandler(itemData.item.calendar.id);
              }}
              deletable={itemData.item.calendar.status === 3}
            ></LeaveItem>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "İzinlerim",
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
          title="Leave"
          iconName={
            Platform.OS === "android"
              ? "ios-add-circle"
              : "ios-add-circle-outline"
          }
          onPress={() => {
            navData.navigation.navigate("AddLeave");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backColor },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backColor,
  },
});

export default LeavesScreen;

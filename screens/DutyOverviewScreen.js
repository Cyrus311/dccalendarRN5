import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";

import DutyItem from "../components/items/DutyItem";
import * as userActions from "../store/actions/user";
import * as calendarActions from "../store/actions/calendar";
import HeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/Colors";

const DutyOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const duty = useSelector(state => state.calendars.mountCalendars);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const loadDuty = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const filterData = {
        filter: {
          where: {
            groupId: {
              like: user.groups ? user.groups[0].id : ""
            }
          },
          include: [
            {
              relation: "group"
            },
            {
              relation: "user"
            },
            {
              relation: "location"
            }
          ]
        }
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

  const selectItemHandler = calendar => {
    props.navigation.navigate("DutyDetail", {
      calendar: JSON.stringify(calendar)
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
    <View style={styles.centered}>
      <Text>Nöbetiniz bulunamadı.</Text>
    </View>;
  }

  return (
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
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <DutyItem
              date={itemData.item.calendar.readableDate}
              location={itemData.item.location}
              description={itemData.item.calendar.description}
              onSelect={() => {
                selectItemHandler(itemData.item.calendar);
              }}
            >
              <Button
                color={Colors.primary}
                title="Detay"
                onPress={() => {
                  selectItemHandler(itemData.item.calendar);
                }}
              />
              <Button
                color={Colors.primary}
                title="Takas"
                onPress={() => {
                  // dispatch(cartActions.addToCart(itemData.item.calendar.id));
                }}
              />
            </DutyItem>
          )}
        />
      </View>
    </View>
  );
};

export const screenOptions = navData => {
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
          title="Leave"
          iconName={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
          onPress={() => {
            navData.navigation.navigate("Orders");
          }}
        />
        {/* <Item
          title="Cart2"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        /> */}
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: { backgroundColor: Colors.backColor },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  dutyListContainer: { height: "95%" },
  infoArea: {
    alignItems: "center",
    height: "5%"
  },
  text: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 6,
    paddingHorizontal: 4,
    color: Colors.textColor
  }
});

export default DutyOverviewScreen;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../components/UI/HeaderButton";
import LeaveItem from "../components/items/LeaveItem";
import Colors from "../constants/Colors";

const LeavesScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const duty = useSelector(state => state.calendars.noDutyCalendars);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(ordersActions.fetchOrders()).then(() => {
  //     setIsLoading(false);
  //   });
  // }, [dispatch]);

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
    <View style={styles.screen}>
      <FlatList
        data={duty}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <LeaveItem
            date={moment(itemData.item.calendar.date).format("DD MMM")}
            date2={moment(itemData.item.calendar.date2).format("DD MMM")}
            status={itemData.item.calendar.status}
            type={itemData.item.calendar.type}
            description={itemData.item.calendar.description}
            onSelect={() => {}}
            onRemove={() => {}}
            // deletable
          ></LeaveItem>
        )}
      />
    </View>
  );
};

export const screenOptions = navData => {
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
    )
  };
};

export const screenOptions2 = navData => {
  return {
    headerTitle: "İzinlerim",
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
    )
  };
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backColor },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backColor
  }
});

export default LeavesScreen;

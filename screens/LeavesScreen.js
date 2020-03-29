import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Button
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../components/UI/HeaderButton";
import DutyItem from "../components/items/DutyItem";
import * as ordersActions from "../store/actions/orders";
import Colors from "../constants/Colors";

const LeavesScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const orders = useSelector(state => state.orders.orders);
  const duty = useSelector(state => state.calendars.noDutyCalendars);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(ordersActions.fetchOrders()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (duty.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders found!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={duty}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <DutyItem
          date={itemData.item.calendar.readableDate}
          type={itemData.item.calendar.type}
          location={itemData.item.location}
          description={itemData.item.calendar.description}
          onSelect={() => {}}
          deletable
        >
          <Button color={Colors.primary} title="İptal" onPress={() => {}} />
        </DutyItem>
      )}
    />
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" }
});

export default LeavesScreen;

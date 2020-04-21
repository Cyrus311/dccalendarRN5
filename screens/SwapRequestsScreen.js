import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector, useDispatch } from "react-redux";
import * as swapActions from "../store/actions/swap";
import SwapItem from "../components/items/SwapItem";
import Colors from "../constants/Colors";

const SwapRequestsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const swap = useSelector((state) => state.swap.swaps);
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
      await dispatch(swapActions.fetchSwap(filterData));
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

  if (swap.length === 0) {
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
          data={swap}
          keyExtractor={(item) => item.id}
          renderItem={(itemData) => (
            <SwapItem
              onSelect={() => {}}
              onRemove={() => {}}
              // deletable
            ></SwapItem>
          )}
        />
      </View>
      <View style={styles.centered}>
        <Button
          title="Tekrar Deneyin"
          onPress={() => {
            dispatch(swapActions.createSwap());
          }}
          color={Colors.primary}
        />
      </View>
    </SafeAreaView>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: "Takas İstekleri",
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

export default SwapRequestsScreen;

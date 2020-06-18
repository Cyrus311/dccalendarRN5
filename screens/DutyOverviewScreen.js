import React, { useState, useEffect, useCallback } from "react";
import DropDownPicker from "react-native-dropdown-picker";
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
  // Vibration,
} from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
// import { Notifications } from "expo";
import * as Calendar from "expo-calendar";

import DutyItem from "../components/items/DutyItem";
import * as calendarActions from "../store/actions/calendar";
import HeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/Colors";
import { customVariables } from "../constants/customVariables";

const DutyOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [listOfMount, setListOfMount] = useState([]);
  const [selectedMount, setSelectedMount] = useState({
    label: moment().format("MMMM"),
    value: moment().format("Y-MM"),
  });
  const [error, setError] = useState();
  // const [notification, setNotification] = useState({});
  const duty = useSelector((state) => state.calendars.mountCalendars);

  const publishedCalendars = useSelector(
    (state) => state.calendars.publishedCalendars
  );
  const [isPublished, setIsPublished] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const loadDuty = useCallback(
    async (data) => {
      setError(null);
      setIsRefreshing(true);
      props.navigation.closeDrawer();

      try {
        // filter: {"where":{"date":{"between":["2020-05-01","2020-05-31"]},"groupId":{"like":"5e8db35c3322910099e91a2b"},"type":1},"include":[{"relation":"group"},{"relation":"user"},{"relation":"location"}]}
        if (user.groups && user.groups.length <= 0) {
          Alert.alert(
            "Bağlı grup bulunamadı!",
            "Lütfen sistem yöneticinize başvurunuz",
            [{ text: "Tamam" }]
          );
          return;
        }
        const groupId = user.groups ? user.groups[0].id : "";
        if (groupId) {
          const filterData = {
            filter: {
              where: {
                groupId: {
                  like: groupId,
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
          await dispatch(calendarActions.fetchCalendar(filterData, data));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsRefreshing(false);
      }
    },
    [dispatch, setIsLoading, setError, user]
  );

  useEffect(() => {
    if (publishedCalendars) {
      const isPublished = publishedCalendars[0]
        ? !publishedCalendars[0].calendar.isDraft
        : false;
      setIsPublished(isPublished);
    }
  }, [publishedCalendars]);

  useEffect(() => {
    let result = [];
    for (let index = 0; index < 12; index++) {
      let item = {
        label: moment().month(index).format("MMMM"),
        value: moment().month(index).format("Y-MM"),
      };
      result.push(item);
    }
    setListOfMount(result);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener(
      "focus",
      loadDuty.bind(this, selectedMount)
    );
    // const _notificationSubscription = Notifications.addListener(
    //   _handleNotification
    // );
    return () => {
      unsubscribe();
    };
  }, [loadDuty, selectedMount]);

  //Example
  // useEffect(() => {
  //   async function fetchData() {
  //     // You can await here
  //     const response = await MyAPI.getData(someId);
  //     // ...
  //   }
  //   fetchData();
  // }, [someId]); // Or [] if effect doesn't need props or state

  const onChangeMount = async (selectedMount) => {
    try {
      setSelectedMount({
        label: selectedMount.label,
        value: selectedMount.value,
      });
    } catch (error) {
      console.log("err", error);
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Back"
            iconName={Platform.OS === "android" ? "md-alarm" : "ios-alarm"}
            onPress={() => {
              if (isPublished) {
                syncNativeCalendar(duty);
              }
            }}
          />
          )
          <Item
            title="DutyDetail"
            iconName={Platform.OS === "android" ? "md-calendar" : "md-calendar"}
            onPress={() => {
              if (isPublished) {
                props.navigation.navigate("DutyDetail", {
                  calendar: JSON.stringify({ date: moment() }),
                });
              }
            }}
          />
          )
        </HeaderButtons>
      ),
    });
  }, [duty, isPublished]);

  useEffect(() => {
    setIsLoading(true);
    loadDuty(selectedMount).then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadDuty, selectedMount]);

  const selectItemHandler = (calendar) => {
    props.navigation.navigate("DutyDetail", {
      calendar: JSON.stringify(calendar),
    });
  };

  const getOmniCaliCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const omnicaliCalendar = calendars.filter(
      (each) => each.title === customVariables.CALENDAR_NAME
    );
    return omnicaliCalendar[0];
  };

  const syncNativeCalendar = async (duty) => {
    try {
      if (!duty) {
        return;
      }
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const defaultCalendar =
          Platform.OS === "ios"
            ? await Calendar.getDefaultCalendarAsync()
            : {
                source: {
                  isLocalAccount: true,
                  name: customVariables.CALENDAR_NAME,
                },
              };
        const omniCaliCalendar = await getOmniCaliCalendarSource();
        if (omniCaliCalendar) {
          await Calendar.deleteCalendarAsync(omniCaliCalendar.id);
        }
        const newCalendarID = await Calendar.createCalendarAsync({
          title: customVariables.CALENDAR_NAME,
          color: "blue",
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultCalendar.source.id,
          source: defaultCalendar.source,
          name: "internalCalendarName",
          ownerAccount: "personal",
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        for (const item of duty) {
          await Calendar.createEventAsync(newCalendarID, {
            title: item.location.name,
            startDate: item.calendar.startDate,
            endDate: item.calendar.endDate,
            notes: item.calendar.description,
            allDay: true,
            availability: Calendar.Availability.BUSY,
            alarms: [{ relativeOffset: -900 }],
          });
        }
        if (duty.length === 0) {
          Alert.alert("Nöbetiniz bulunmamaktadır!", "", [{ text: "Tamam" }]);
          return;
        }
        Alert.alert(
          "Takvim eşitleme başarılı!",
          "Nöbetleriniz cihaz takviminize aktarılmıştır.",
          [{ text: "Tamam" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Takvim eşitleme sırasında hata oluştu!",
        // "Lütfen sistem yöneticinize başvurunuz",
        error.message,
        [{ text: "Okay" }]
      );
    }
  };

  // const _handleNotification = (notification) => {
  //   Vibration.vibrate();
  //   // console.log(notification);
  //   setNotification(notification);
  // };

  // useEffect(() => {
  //   if (notification.data) {
  //     Alert.alert("Mesajınız Var!", notification.data.message, [
  //       {
  //         text: "Tamam",
  //         style: "destructive",
  //         onPress: () => {
  //           loadDuty();
  //         },
  //       },
  //     ]);
  //   }
  // }, [notification]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Hata Oluştu!</Text>
        <Button
          title="Tekrar Dene"
          onPress={loadDuty.bind(this, selectedMount)}
          color={Colors.primary}
        />
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

  if (!isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={Platform.OS === "android" ? "default" : "dark-content"}
        />
        <View style={styles.screen}>
          <View style={styles.infoArea}>
            <View>
              {listOfMount.length == 12 && (
                <DropDownPicker
                  defaultValue={selectedMount.value}
                  dropDownMaxHeight={400}
                  items={listOfMount}
                  arrowColor={"white"}
                  arrowStyle={{ marginLeft: 10 }}
                  style={{
                    zIndex: 0,
                    borderWidth: 0,
                    backgroundColor: Colors.primary,
                    width: 80,
                  }}
                  containerStyle={{ backgroundColor: Colors.primary }}
                  labelStyle={{ color: "white" }}
                  dropDownStyle={{
                    border: "none",
                    backgroundColor: Colors.primary,
                  }}
                  onChangeItem={(item) => {
                    onChangeMount(item);
                  }}
                />
              )}

              {/* <Text style={styles.text}>{moment().format("MMMM")}</Text> */}
            </View>
          </View>

          <View style={styles.dutyListContainer}>
            {!isPublished && (
              <View style={styles.centered}>
                <Text style={{ color: Colors.primary }}>
                  Takvim henüz yayınlanmamış.
                </Text>
                {/* <Button title="Tekrar Dene" onPress={loadDuty} color={Colors.primary} /> */}
              </View>
            )}

            {duty.length === 0 && (
              <View style={styles.centered}>
                <Text style={{ color: Colors.primary }}>
                  Nöbetiniz bulunamadı.
                </Text>
                {/* <Button title="Tekrar Dene" onPress={loadDuty} color={Colors.primary} /> */}
              </View>
            )}

            {isPublished && (
              <FlatList
                onRefresh={loadDuty.bind(this, selectedMount)}
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
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
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
  };
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.backColor },
  centered: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  dutyListContainer: { height: "95%", zIndex: -1 },
  infoArea: {
    alignItems: "center",
    height: 45,
    borderWidth: 1,
    borderColor: Colors.textColor,
    backgroundColor: Colors.primary,
  },
});

export default DutyOverviewScreen;

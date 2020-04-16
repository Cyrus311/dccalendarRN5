import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ArrowIcon from "../UI/ArrowIcon";

import Card from "../UI/Card";
import Colors, { locationColors } from "../../constants/Colors";
import { typeEnum } from "../../constants/typeEnum";

const DutyItem = (props) => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  if (!props.navigatable) {
    TouchableComponent = View;
  }

  return (
    <Card style={styles.duty}>
      <View style={styles.touchable}>
        <TouchableComponent onPress={props.onSelect} useForeground>
          <View style={styles.dutyContainer}>
            <View style={styles.gradientContainer}>
              {props.user ? (
                <View
                  backgroundColor={locationColors[props.location.colorCode]}
                  style={styles.locationColorContainer}
                ></View>
              ) : (
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  style={styles.gradient}
                >
                  <Text style={styles.date} numberOfLines={2}>
                    {props.date}
                  </Text>
                </LinearGradient>
              )}
            </View>

            {props.user ? (
              <View
                style={
                  props.children
                    ? styles.locationContainer
                    : styles.wideLocationContainer
                }
              >
                <Text style={styles.location}>
                  {props.type ? typeEnum[props.type] : props.location.name}
                </Text>
                <Text style={styles.user}>{props.user.fullName}</Text>
                <Text style={styles.description}>
                  {props.description
                    ? props.description.trim()
                    : "Açıklama yok"}
                </Text>
              </View>
            ) : (
              <View style={styles.locationContainer}>
                <Text style={styles.location}>
                  {props.type ? typeEnum[props.type] : props.location.name}
                </Text>
                <Text style={styles.description}>
                  {props.description
                    ? props.description.trim()
                    : "Açıklama yok"}
                </Text>
              </View>
            )}

            {!!props.children && (
              <View style={styles.iconContainer}>{props.children}</View>
            )}

            {props.navigatable && <ArrowIcon />}
          </View>
        </TouchableComponent>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  duty: {
    height: 90,
    margin: 10,
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  dutyContainer: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  gradientContainer: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  locationContainer: {
    width: "80%",
    height: "100%",
  },
  wideLocationContainer: {
    width: "90%",
    height: "100%",
  },
  date: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.dateText,
    textAlign: "center",
  },
  location: {
    backgroundColor: "transparent",
    // fontFamily: "open-sans-bold",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 6,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.tertiary,
  },
  user: {
    backgroundColor: "transparent",
    fontFamily: "open-sans",
    fontSize: 14,
    color: Colors.tertiary,
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 12,
    color: Colors.gray,
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  iconContainer: {
    flex: 2,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationColorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DutyItem;

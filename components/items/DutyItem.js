import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Card from "../UI/Card";
import Colors, { color } from "../../constants/Colors";
import { typeEnum } from "../../constants/typeEnum";

const DutyItem = props => {
  let TouchableComponent = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.duty}>
      <View style={styles.touchable}>
        <TouchableComponent onPress={props.onSelect} useForeground>
          <View style={styles.dutyContainer}>
            <View style={styles.gradientContainer}>
              {props.user ? (
                <View
                  backgroundColor={color[props.location.colorCode]}
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
              <View style={styles.wideLocationContainer}>
                <Text style={styles.location}>
                  {props.type ? typeEnum[props.type] : props.location.name}
                </Text>
                <Text style={styles.description}>{props.user.fullName}</Text>
                {!props.deletable && (
                  <View style={styles.actions}>{props.children}</View>
                )}
              </View>
            ) : (
              <View
                style={
                  props.deletable
                    ? styles.deletableContainer
                    : styles.locationContainer
                }
              >
                <Text style={styles.location}>
                  {props.type ? typeEnum[props.type] : props.location.name}
                </Text>
                <Text style={styles.description}>{props.description}</Text>
                {!props.deletable && (
                  <View style={styles.actions}>{props.children}</View>
                )}
              </View>
            )}
            {props.deletable && (
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={props.onRemove}
                  style={styles.deleteButton}
                >
                  <Ionicons
                    name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                    size={27}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableComponent>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  duty: {
    height: 90,
    margin: 10
  },
  touchable: {
    borderRadius: 10,
    overflow: "hidden"
  },
  dutyContainer: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
    flexDirection: "row"
  },
  gradientContainer: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center"
  },
  locationContainer: {
    width: "80%",
    height: "100%"
  },
  wideLocationContainer: {
    width: "90%",
    height: "100%"
  },
  deletableContainer: {
    width: "60%",
    height: "100%"
  },
  date: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.whiteText
  },
  location: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
    paddingHorizontal: 4
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 12,
    color: "#888",
    paddingHorizontal: 4
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "35%",
    paddingHorizontal: 10
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  locationColorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  deleteButton: {}
});

export default DutyItem;

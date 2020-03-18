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

import Card from "../UI/Card";
import Colors from "../../constants/Colors";

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
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.gradient}
              >
                <Text style={styles.date} numberOfLines={2}>
                  {props.date}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.locationContainer}>
              <Text style={styles.location}>{props.location}</Text>
              <Text style={styles.description}>{props.description}</Text>
              <View style={styles.actions}>{props.children}</View>
            </View>
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
  date: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.textColor
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
    height: "30%",
    paddingHorizontal: 10
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default DutyItem;

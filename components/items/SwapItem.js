import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import Card from "../UI/Card";
import Colors from "../../constants/Colors";

const SwapItem = (props) => {
  return (
    <Card style={styles.duty}>
      <View style={styles.touchable}>
        <View style={styles.dutyContainer}>
          <View style={styles.gradientContainer}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.gradient}
            >
              <Text style={styles.date}>{props.date}</Text>
              {props.date !== props.date2 && (
                <Text style={{ color: Colors.dateText }}> - </Text>
              )}
              {props.date !== props.date2 && (
                <Text style={styles.date}>{props.date2}</Text>
              )}
            </LinearGradient>
          </View>
          <View style={styles.locationContainer}>
            <Text numberOfLines={1} style={styles.location}>
              dada
            </Text>
            <Text numberOfLines={1} style={styles.description}>
              {props.description ? props.description.trim() : "Açıklama yok"}
            </Text>
          </View>
          <View style={styles.gradientContainer}>
            <LinearGradient
              colors={[Colors.primary, Colors.tertiary]}
              style={styles.gradient}
            >
              <Text style={styles.date}>{props.date}</Text>
              {props.date !== props.date2 && (
                <Text style={{ color: Colors.dateText }}> - </Text>
              )}
              {props.date !== props.date2 && (
                <Text style={styles.date}>{props.date2}</Text>
              )}
            </LinearGradient>
          </View>
        </View>
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
    width: "73%",
    height: "100%",
  },
  date: {
    backgroundColor: "transparent",
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.dateText,
  },
  location: {
    backgroundColor: "transparent",
    // fontFamily: "open-sans-bold",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 6,
    marginVertical: 4,
    paddingHorizontal: 4,
    color: Colors.tertiary,
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 12,
    color: Colors.gray,
    marginVertical: 4,
    paddingHorizontal: 4,
  },
  statusContainer: {
    width: 90,
    marginTop: 8,
    marginHorizontal: 4,
    elevation: 5,
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainerWaitColor: {
    backgroundColor: Colors.gradientEnd,
  },
  statusContainerAprovedColor: {
    backgroundColor: Colors.gradientStart,
  },
  status: {
    backgroundColor: "transparent",
    fontFamily: "open-sans",
    fontSize: 12,
  },
  statusWaitColor: {
    color: Colors.dateText,
  },
  statusAprovedColor: {
    color: Colors.tertiary,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {},
});

export default SwapItem;

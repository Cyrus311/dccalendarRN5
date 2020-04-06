import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ArrowIcon = (props) => (
  <View
    style={{
      ...styles.iconContainer,
      ...props.style,
    }}
  >
    <Ionicons
      name="ios-arrow-forward"
      size={20}
      color="#888"
      style={{ ...styles.icon, ...props.style }}
    ></Ionicons>
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    width: "4%",
  },
  icon: { alignSelf: "center" },
});

export default ArrowIcon;

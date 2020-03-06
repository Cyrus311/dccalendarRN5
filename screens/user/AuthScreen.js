import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";

const AuthScreen = props => {
  return (
    <View>
      <Card style={styles.authContainer}>
        <ScrollView></ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
    authContainer:{}
});

export default AuthScreen;

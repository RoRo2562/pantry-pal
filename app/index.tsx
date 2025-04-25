import { Text, View, StyleSheet } from "react-native";
import { Link, Redirect } from "expo-router";

export default function Index() {
  return (
    <Redirect href="/(auth)/login" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faedcd"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#bc6c25"
  }
})
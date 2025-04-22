import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function About() {
  return (
    <View
      style={styles.container}
    >
      <Text>This is about</Text>
      <Link href={"/barcode"} style = {styles.button}> Go to about</Link>
    </View>
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
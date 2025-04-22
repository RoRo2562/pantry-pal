import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Hello Expo</Text>
      <Link href={"/barcode"} style = {styles.button}> Go to barcode</Link>
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
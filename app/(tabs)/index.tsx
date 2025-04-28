import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Slider from "@/components/Slider";
import { PantrySlider } from "@/data/PantrySlider";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
      <Slider itemList={PantrySlider}/>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex:4}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEFAE0"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#bc6c25"
  }
})
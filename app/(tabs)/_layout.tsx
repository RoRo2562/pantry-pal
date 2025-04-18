import { Tabs } from "expo-router";

export default function RootLayout() {
  return <Tabs >
    <Tabs.Screen name="(tabs)" options={{headerTitle: "PantryPal", headerLeft: ()=> <></>} }/>
    <Tabs.Screen name="about" />
    </Tabs>;
}

import { Tabs } from "expo-router";

export default function TabLayout() {
  return <Tabs >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="pantry" />
      <Tabs.Screen name="recipes" />
      <Tabs.Screen name="barcode" />
    </Tabs>;
}

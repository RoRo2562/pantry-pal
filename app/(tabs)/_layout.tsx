import { Tabs } from "expo-router";
import {Ionicons,AntDesign, Entypo} from "@expo/vector-icons"
import { COLORS } from "@/constants/theme";


export default function TabLayout() {
  return <Tabs screenOptions={{
    tabBarShowLabel: false,
    headerShown:false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.grey,
    tabBarStyle: {
      backgroundColor: "#FEFAE0",
      borderTopWidth: 0,
      position: "absolute",
      elevation: 0,
      height: 50,
      paddingBottom: 8,
    }
  }}>
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({size,color}) => <Ionicons name="home" size={size} color={color}/>,
        sceneStyle:{
          backgroundColor: COLORS.background,
          marginBottom: 50,
        }
      }}/>
      <Tabs.Screen name="pantry" options={{
        tabBarIcon: ({size,color}) => <Entypo name="shopping-basket" size={size} color={color}/>,
        sceneStyle:{
          backgroundColor: COLORS.background,
          paddingTop: 0, paddingBottom: 50 
        }
      }}/>
      <Tabs.Screen name="foodIdentifier" options={{
        tabBarIcon: ({size,color}) => <AntDesign name="scan1" size={size} color={color}/>,
        sceneStyle:{
          backgroundColor: COLORS.background,
          paddingTop: 0, paddingBottom: 50
        }
      }}/>
      
    </Tabs>;
}

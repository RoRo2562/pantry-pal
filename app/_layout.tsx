import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { PantryProvider } from "./pantry/[pantryType]/addToPantry";
import { COLORS } from "@/constants/theme";


export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <PantryProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <InitialLayout />
        </SafeAreaView>
        </PantryProvider>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>

  );
}

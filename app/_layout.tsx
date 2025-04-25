import { Stack, Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { View,Text } from "react-native";
import InitialLayout from "@/components/InitialLayout";

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

// if (!publishableKey){
//   throw new Error(
//     'Missing Publishable Key'
//   )
// }

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    console.error("Publishable Key is missing WITHIN the component!");
    // Optionally render an error message to the screen instead of throwing
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>
          Error: Missing Clerk Publishable Key. Please check your .env.local file and restart the server.
        </Text>
      </View>
    );
    // Or, if you still want to throw (less user-friendly in production):
    // throw new Error('Missing Publishable Key');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFAE0' }}>
            <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

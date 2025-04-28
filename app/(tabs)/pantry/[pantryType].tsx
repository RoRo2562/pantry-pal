import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api'; // Adjust the path to your api

export default function PantryItemsScreen() {
  const { pantryType } = useLocalSearchParams();

  const pantryItems = useQuery(api.pantry.getByUserAndType, {
    pantryType: pantryType as "pantry" | "fridge" | "freezer" | "freshbox", // Type cast for safety
  });

  if (!pantryItems) {
    return <Text>Loading pantry items...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        {pantryType} Items
      </Text>
      {pantryItems.length === 0 ? (
        <Text>No items in this {pantryType} yet.</Text>
      ) : (
        <FlatList
          data={pantryItems}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 8, borderWidth: 1, padding: 8, borderRadius: 5 }}>
              <Text>Title: {item.title}</Text>
              {/* Display other item details */}
            </View>
          )}
        />
      )}
    </View>
  );
}
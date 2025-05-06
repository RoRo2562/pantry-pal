import { View, Text, FlatList, Button, TouchableOpacity,StyleSheet } from 'react-native';
import { Link, router, useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api'; // Adjust the path to your api
import BarcodeScannerModal from '@/components/barcode';
import { useState } from 'react';

export default function PantryItemsScreen() {
  const { pantryType } = useLocalSearchParams();
  const router = useRouter();

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
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      <Link href={'/pantry/[pantryType]/addToPantry'}>Add Item to {pantryType}</Link>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  listItem: {
    marginBottom: 8,
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50', // Green
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#00B8D4', // Cyan
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
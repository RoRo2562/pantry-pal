import { View, Text, Modal, TouchableOpacity, FlatList, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Camera } from 'expo-camera';
import { Id } from '@/convex/_generated/dataModel';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '@clerk/clerk-expo';

interface AddItemForm {
    foodName: string;
    quantityValue: string;
    quantityUnit: string;
    iconUrl: string;
    expiryDate: string;
    pantryType: 'pantry' | 'fridge' | 'freezer' | 'freshbox'; // Add pantryType to form
  }

  // Define your icon options
const iconOptions = [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
    { name: 'Milk', value: 'milk' },
    { name: 'Bread', value: 'bread' },
    { name: 'Eggs', value: 'eggs' },
    { name: 'Custom', value: 'custom' },
];

const quantityUnits = ['piece', 'gram', 'ml', 'kg', 'lb', 'oz', 'count'];

interface FoodItem {
    _id: string;
    name: string;
    // Add other relevant food properties like brand, etc.
  }

export default function addItem() {
    const { user } = useUser();
    const addItemToPantry = useMutation(api.pantryItem.addItem);
    const [formData, setFormData] = useState<AddItemForm>({
        foodName: '',
        quantityValue: '',
        quantityUnit: 'piece',
        iconUrl: iconOptions[0].value,
        expiryDate: '',
        pantryType: 'pantry', // Default pantry type
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const [showFoodList, setShowFoodList] = useState(false);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);
  const [newFoodName, setNewFoodName] = useState('');
  const [showNewFoodReview, setShowNewFoodReview] = useState(false);
  const [storageId, setStorageId] = useState<Id<"_storage"> | null>(null);
  const cameraRef = useRef<typeof Camera>(null); // Ref for the camera

      // Load foods from Convex
    //   useEffect(() => {
    //     const fetchedFoods = getFoods();
    //     if (fetchedFoods) {
    //         setFoods(fetchedFoods);
    //     }
    // }, [getFoods]);

  // Get camera permission on mount
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasCameraPermission(status === 'granted');
        })();
    }, []);

    // Fetch or create a default storage ID.
    useEffect(() => {
        const fetchDefaultStorageId = async () => {
            const newStorageId: Id<"_storage"> = "storageId" as Id<"_storage">; // Replace
            setStorageId(newStorageId);
        };

        fetchDefaultStorageId();
    }, []);

    const handleInputChange = (field: keyof AddItemForm, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

  const handleFoodSelect = (food: FoodItem | null) => {
    setSelectedFood(food);
    if (food) {
      setFormData({ ...formData, foodName: food.name });
    } else {
      setFormData({ ...formData, foodName: '' });
    }
    setShowFoodList(false);
  };

    const handleBarcodeScanned = useCallback(async (data: any) => { // Changed arg type
        setIsScanningBarcode(false);
        if(data.data){ //check if data exists
          setBarcodeData(data.data);
          setNewFoodName('');
          setShowNewFoodReview(true);
        }
    }, []);

  const handleAddNewFood = async () => {
        if (!newFoodName.trim()) {
            Alert.alert('Error', 'Please enter a food name.');
            return;
        }

        const newFoodId = await addFood({ name: newFoodName });
        if(newFoodId){
          // Add to local state
            setFoods(prevFoods => [...prevFoods, {_id: newFoodId, name: newFoodName}]);
            handleFoodSelect({_id: newFoodId, name: newFoodName});
            setShowNewFoodReview(false);
            setBarcodeData(null);
        }
        else{
          Alert.alert("Error", "Failed to add new food item");
        }
    };

    const handleAddPantryItem = async () => {
        if (isSubmitting || !storageId) return;

        // Basic validation
        if (!formData.foodName.trim() || !formData.quantityValue.trim() || !formData.expiryDate.trim()) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        const quantityValueNum = Number(formData.quantityValue);
        if (isNaN(quantityValueNum)) {
            Alert.alert('Error', 'Quantity must be a number.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (user) {
              const foodId = selectedFood?._id || uuidv4();

                await addItemToPantry({
                    userId: user.id as Id<"users">,
                    pantryType: formData.pantryType,
                    iconUrl: formData.iconUrl === 'custom' ? customIcon || '' : formData.iconUrl,
                    title: formData.foodName,
                    expiryDate: formData.expiryDate,
                    quantityValue: quantityValueNum,
                    quantityUnit: formData.quantityUnit,
                    foodId: foodId as Id<"foodItems">,
                    storageId: storageId,
                });

                setFormData({
                    foodName: '',
                    quantityValue: '',
                    quantityUnit: 'piece',
                    iconUrl: iconOptions[0].value,
                    expiryDate: '',
                    pantryType: 'pantry'
                });
                setSelectedFood(null);
                setCustomIcon(null);
                Alert.alert('Success', 'Item added to pantry!');
            } else {
                Alert.alert('Error', 'You must be logged in to add items to your pantry.');
            }
        } catch (error: any) {
            Alert.alert('Error', `Failed to add item: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert(
              'Permission Denied',
              'Sorry, we need camera roll permissions to select an icon.'
          );
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
      });

      if (!result.canceled) {
          setCustomIcon(result.assets[0].uri);
          setFormData({ ...formData, iconUrl: 'custom' });
      }
  };

  const startBarcodeScanner = () => {
        if (hasCameraPermission) {
            setIsScanningBarcode(true);
            setBarcodeData(null);
        } else {
            Alert.alert(
                'Permission Denied',
                'Please enable camera access to scan barcodes.'
            );
        }
    };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.formContainer}>
      <Text style={styles.title}>Add Item to Pantry</Text>

      {/* Food Name Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Food Name</Text>
          <TouchableOpacity style={styles.foodSelectButton} onPress={() => setShowFoodList(true)}>
              <Text>{selectedFood ? selectedFood.name : 'Select Food'}</Text>
          </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Or type food name..."
          value={formData.foodName}
          onChangeText={(text) => handleInputChange('foodName', text)}
        />
          <TouchableOpacity style={styles.barcodeButton} onPress={startBarcodeScanner}>
            <Text>Scan Barcode</Text>
          </TouchableOpacity>
      </View>

      {/* Quantity and Unit */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.quantityInput}
          placeholder="Enter quantity"
          value={formData.quantityValue}
          onChangeText={(text) => handleInputChange('quantityValue', text)}
          keyboardType="numeric"
        />
        <View style={styles.selectContainer}>
          <Picker
            selectedValue={formData.quantityUnit}
            onValueChange={(value) => handleInputChange('quantityUnit', value)}
          >
            {quantityUnits.map((unit) => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Expiry Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expiry Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.expiryDate}
          onChangeText={(text) => handleInputChange('expiryDate', text)}
          keyboardType="default"
        />
      </View>

      {/* Pantry Type Selection */}
      <View style={styles.inputGroup}>
          <Text style={styles.label}>Pantry Type</Text>
          <View style={styles.selectContainer}>
              <Picker
                  selectedValue={formData.pantryType}
                  onValueChange={(value) => handleInputChange('pantryType', value as AddItemForm['pantryType'])}
              >
                  <Picker.Item label="Pantry" value="pantry" />
                  <Picker.Item label="Fridge" value="fridge" />
                  <Picker.Item label="Freezer" value="freezer" />
                  <Picker.Item label="Freshbox" value="freshbox" />
              </Picker>
          </View>
      </View>

      {/* Icon Selection */}
      <View style={styles.inputGroup}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={formData.iconUrl}
              onValueChange={(value) => {
                  if (value === 'custom') {
                  }
                  else{
                    handleInputChange('iconUrl', value)
                    setCustomIcon(null);
                  }
              }}
            >
              {iconOptions.map((icon) => (
                <Picker.Item key={icon.value} label={icon.name} value={icon.value} />
              ))}
            </Picker>
          </View>
          {formData.iconUrl === 'custom' && (
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text>Pick Custom Icon</Text>
            </TouchableOpacity>
          )}
          {customIcon && (
            <Image source={{ uri: customIcon }} style={styles.selectedIcon} />
          )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAddPantryItem} disabled={isSubmitting || !storageId}>
        <Text style={styles.submitButtonText}>{isSubmitting ? 'Adding...' : 'Add Item'}</Text>
      </TouchableOpacity>

      {/* Food List Modal */}
      <Modal visible={showFoodList} animationType="slide">
          <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Food</Text>
              <FlatList
                  data={foods}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => handleFoodSelect(item)}
                      >
                          <Text>{item.name}</Text>
                      </TouchableOpacity>
                  )}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowFoodList(false)}>
                  <Text>Close</Text>
              </TouchableOpacity>
          </View>
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal visible={isScanningBarcode} animationType="slide">
          <View style={{ flex: 1 }}>
              {hasCameraPermission && (
                <Camera
                  ref={cameraRef}
                  style={StyleSheet.absoluteFillObject}
                  type={CameraType.back}
                  onBarCodeScanned={handleBarcodeScanned}
                  barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13], // Specify barcode type
                  }}
                />
              )}
              <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setIsScanningBarcode(false)}
              >
                  <Text>Cancel</Text>
              </TouchableOpacity>
              {barcodeData && (
                  <Text style={{ position: 'absolute', bottom: 50, color: 'white', fontSize: 16, alignSelf: 'center' }}>
                      Barcode Data: {barcodeData}
                  </Text>
              )}
          </View>
      </Modal>

      {/* New Food Review Modal */}
      <Modal visible={showNewFoodReview} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Review New Food</Text>
          <Text>Barcode Data: {barcodeData}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Food Name"
            value={newFoodName}
            onChangeText={setNewFoodName}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddNewFood}>
              <Text>Add Food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowNewFoodReview(false);
                setBarcodeData(null);
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  </ScrollView>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'semibold',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        width: '40%',
    },
    selectContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 0,
        overflow: 'hidden',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imagePickerButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
        width: '50%'
    },
    selectedIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginTop: 10,
    },
    foodSelectButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        marginBottom: 10,
    },
    barcodeButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        width: '50%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        color: 'white',
        marginTop: 10,
    }
});
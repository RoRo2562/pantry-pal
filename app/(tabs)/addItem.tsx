import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Camera } from 'expo-camera';
import { Id } from '@/convex/_generated/dataModel';
import { Picker } from '@react-native-picker/picker';
import { useUser } from '@clerk/clerk-expo';
import BarcodeScannerModal from './barcode';

interface AddFoodItemForm {
    name: string;
    barcode?: string;
    brand?: string;
    imageUrl?: string;
    ingredients?: string;
    calories?: string; // Changed to number | undefined
    protein?: string | undefined;
    fat?: string | undefined;
    carbohydrates?: string | undefined;
    fiber?: string | undefined;
    sugars?: string | undefined;
    sodium?: string | undefined;
    salt?: string;
    saturatedFat?: string;
    calcium?: string;
    iron?: string;
    potassium?: string;
}


export default function AddFoodItemScreen() {
    const { user } = useUser();
    const addFoodItem = useMutation(api.foodItem.addFood); // Renamed mutation
    const [formData, setFormData] = useState<AddFoodItemForm>({
        name: '',
        barcode: '',
        brand: '',
        imageUrl: '',
        ingredients: '',
        calories: '',
        protein: undefined,
        fat: undefined,
        carbohydrates: undefined,
        fiber: undefined,
        sugars: undefined,
        sodium: undefined,
        salt: '',
        saturatedFat: '',
        calcium: '',
        iron: '',
        potassium: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBarcodeModalVisible, setIsBarcodeModalVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


    // Get camera permission on mount
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, [hasCameraPermission]);


    const handleInputChange = (field: keyof AddFoodItemForm, value: string) => {
        const newValue = 
        field === 'calories' 
        || field === 'protein' 
        || field === 'fat' 
        || field === 'carbohydrates' 
        || field === 'fiber' 
        || field === 'sugars' 
        || field === 'sodium'
            ? Number(value) || undefined  // Convert to number or undefined if empty
            : value;
        setFormData({ ...formData, [field]: newValue });
    };

    const handleBarcodeScanned = (data:AddFoodItemForm) => { // Changed data type to string
        setIsBarcodeModalVisible(false);
        console.log(data);
        setFormData({
          name: data.name,
          barcode: data.barcode,
          brand: data.brand,    
          imageUrl: data.imageUrl,
          ingredients: data.ingredients,
          calories: data.calories,
          protein: data.protein,
          fat: data.fat,
          carbohydrates: data.carbohydrates,
          fiber: data.fiber,
          sugars: data.sugars,
          sodium: data.sodium,
          salt: data.salt,
          saturatedFat: data.saturatedFat,
          calcium: data.calcium,
          iron: data.iron,
          potassium: data.potassium,
        }) // Store barcode
    };

    const handleCloseBarcodeScanner = () => {
        setIsBarcodeModalVisible(false);
    };


    const handleAddFoodItem = async () => {
        if (isSubmitting) return;

        // Basic validation -  Name is required
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter the food name.');
            return;
        }

        setIsSubmitting(true);
        console.log('Form data:', formData);
        try {
            const newFoodId = await addFoodItem(formData); // Pass the entire form data
            if (newFoodId) {
                Alert.alert('Success', 'Food item added successfully!');
                // Reset form
                setFormData({
                  name: '',
                  barcode: '',
                  brand: '',
                  imageUrl: '',
                  ingredients: '',
                  calories: '',
                  protein: undefined,
                  fat: undefined,
                  carbohydrates: undefined,
                  fiber: undefined,
                  sugars: undefined,
                  sodium: undefined,
                  salt: '',
                  saturatedFat: '',
                  calcium: '',
                  iron: '',
                  potassium: '',
                });
            } else {
                Alert.alert('Error', 'Failed to add food item.');
            }
        } catch (error: any) {
            Alert.alert('Error', `Failed to add food item: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };


    const startBarcodeScanner = () => {
        setIsBarcodeModalVisible(true);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Add Food Item</Text>

                {/* Name Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter food name"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />
                </View>

                {/* Barcode Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Barcode</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter barcode"
                        value={formData.barcode || ''}
                        onChangeText={(text) => handleInputChange('barcode', text)}
                        keyboardType="default"
                    />
                    <TouchableOpacity style={styles.barcodeButton} onPress={startBarcodeScanner}>
                        <Text>Scan Barcode</Text>
                    </TouchableOpacity>
                </View>

                {/* Brand Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Brand</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter brand"
                        value={formData.brand}
                        onChangeText={(text) => handleInputChange('brand', text)}
                    />
                </View>

                {/* Image URL Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter image URL"
                        value={formData.imageUrl}
                        onChangeText={(text) => handleInputChange('imageUrl', text)}
                        keyboardType="url"
                    />
                </View>

                {/* Ingredients Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ingredients</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter ingredients"
                        value={formData.ingredients}
                        onChangeText={(text) => handleInputChange('ingredients', text)}
                        multiline
                    />
                </View>

                {/* Calories Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Calories</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter calories"
                        value={formData.calories?.toString() || ''}
                        onChangeText={(text) => handleInputChange('calories', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Protein Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Protein</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter protein (g)"
                        value={formData.protein?.toString() || ''}
                        onChangeText={(text) => handleInputChange('protein', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Fat Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fat</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter fat (g)"
                        value={formData.fat?.toString() || ''}
                        onChangeText={(text) => handleInputChange('fat', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Carbohydrates Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Carbohydrates</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter carbohydrates (g)"
                        value={formData.carbohydrates?.toString() || ''}
                        onChangeText={(text) => handleInputChange('carbohydrates', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Fiber Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Fiber</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter fiber (g)"
                        value={formData.fiber?.toString() || ''}
                        onChangeText={(text) => handleInputChange('fiber', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Sugar Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sugar</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter sugar (g)"
                        value={formData.sugars?.toString() || ''}
                        onChangeText={(text) => handleInputChange('sugars', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Sodium Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Sodium</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter sodium (mg)"
                        value={formData.sodium?.toString() || ''}
                        onChangeText={(text) => handleInputChange('sodium', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Salt Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Salt</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter salt (g)"
                        value={formData.salt?.toString() || ''}
                        onChangeText={(text) => handleInputChange('salt', text)}
                        keyboardType="numeric"
                    />
                </View>
                {/* Saturated Fat Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Saturated Fat</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter saturated fat (g)"
                        value={formData.saturatedFat?.toString() || ''}
                        onChangeText={(text) => handleInputChange('saturatedFat', text)}
                        keyboardType="numeric"
                    />
                </View>
                {/* Calcium Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Calcium</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter calcium (mg)"
                        value={formData.calcium?.toString() || ''}
                        onChangeText={(text) => handleInputChange('calcium', text)}
                        keyboardType="numeric"
                    />
                </View>
                {/* Iron Input */}
                <View style={styles.inputGroup}>  
                    <Text style={styles.label}>Iron</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter iron (mg)"
                        value={formData.iron?.toString() || ''}
                        onChangeText={(text) => handleInputChange('iron', text)}
                        keyboardType="numeric"
                    />
                </View>
                {/* Potassium Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Potassium</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter potassium (mg)"
                        value={formData.potassium?.toString() || ''}
                        onChangeText={(text) => handleInputChange('potassium', text)}
                        keyboardType="numeric"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleAddFoodItem} disabled={isSubmitting}>
                    <Text style={styles.submitButtonText}>{isSubmitting ? 'Adding...' : 'Add Food Item'}</Text>
                </TouchableOpacity>

                {/* Barcode Scanner Modal */}
                <BarcodeScannerModal
                    isVisible={isBarcodeModalVisible}
                    onClose={handleCloseBarcodeScanner}
                    onBarcodeScanned={handleBarcodeScanned}
                    hasCameraPermission={hasCameraPermission}
                />


            </View>
        </ScrollView>
    );
}

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
    modalButton: {
        padding: 10,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        color: 'white',
        marginTop: 10,
    }
});


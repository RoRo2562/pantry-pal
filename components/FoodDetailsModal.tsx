import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView , Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AddFoodItemForm } from '@/app/(tabs)/searchFood';


interface FoodDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    foodItem: AddFoodItemForm | null;
}

const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({ isVisible, onClose, foodItem }) => {
    const [localFoodItem, setLocalFoodItem] = useState<any | null>(foodItem);

    useEffect(() => {
        setLocalFoodItem(foodItem);
    }, [foodItem]);


    if (!isVisible) return null;

    const nutrientKeys = [
        { key: 'calories', label: 'Calories' },
        { key: 'protein', label: 'Protein' },
        { key: 'fat', label: 'Fat' },
        { key: 'carbohydrates', label: 'Carbohydrates' },
        { key: 'fiber', label: 'Fiber' },
        { key: 'sugars', label: 'Sugars' },
        { key: 'sodium', label: 'Sodium' },
        { key: 'salt', label: 'Salt' },
        { key: 'saturatedFat', label: 'Saturated Fat' },
        { key: 'calcium', label: 'Calcium' },
        { key: 'iron', label: 'Iron' },
        { key: 'potassium', label: 'Potassium' },
    ];

    const getDisplayValue = (value: any) => {
        if (value === undefined || value === null) {
            return 'N/A';
        }
        return String(value);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" color="black" size={24} />
                    </TouchableOpacity>
                    <ScrollView style={styles.modalInnerContent}>
                        {localFoodItem && (
                            <>
                                {localFoodItem.imageUrl && (
                                    <Image
                                        source={{ uri: localFoodItem.imageUrl }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={styles.productName}>{localFoodItem.name || 'No Name'}</Text>
                                <Text style={styles.brandName}>{localFoodItem.brand || 'No Brand'}</Text>
                                <Text style={styles.barcode}>Barcode: {localFoodItem.barcode || 'N/A'}</Text>

                                <View style={styles.nutritionSection}>
                                    <Text style={styles.nutritionTitle}>Nutrition Information</Text>
                                    <View style={styles.nutritionTable}>
                                        {nutrientKeys.map((item) => (
                                            <View key={item.key} style={styles.nutritionRow}>
                                                <Text style={styles.nutritionLabel}>{item.label}</Text>
                                                <Text style={styles.nutritionValue}>
                                                    {getDisplayValue(localFoodItem[item.key])}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* You can add more sections for ingredients, etc. here */}
                                {localFoodItem.ingredients && (
                                    <View style={styles.ingredientsSection}>
                                        <Text style={styles.sectionTitle}>Ingredients</Text>
                                        <Text style={styles.ingredientsText}>{localFoodItem.ingredients}</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        overflowY: 'auto',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    modalInnerContent: {
        width: '100%',
    },
      productImage: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 15,
        borderRadius: 8,
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    brandName: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 5,
        textAlign: 'center',
    },
    barcode: {
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    nutritionSection: {
        marginTop: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    nutritionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nutritionTable: {
        marginTop: 5,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#f2f2f2',
    },
    nutritionLabel: {
        fontWeight: 'bold',
        flex: 1,
    },
    nutritionValue: {
        flex: 1,
        textAlign: 'right',
    },
      ingredientsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ingredientsText: {
        fontSize: 16,
        lineHeight: 22,
    },
});

export default FoodDetailsModal;

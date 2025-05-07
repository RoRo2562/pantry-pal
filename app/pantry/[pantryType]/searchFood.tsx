import React, { useState, useCallback, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, ActivityIndicator, Keyboard } from 'react-native';
// Import the interface
import { COLORS } from '@/constants/theme';
import FoodDetailsModal from '@/components/FoodDetailsModal';
import BarcodeScannerModal from '@/components/BarcodeModal';
import { Ionicons } from '@expo/vector-icons';
import BarcodeModal from '@/components/barcode';
import { router, useLocalSearchParams } from 'expo-router';
import { PantryContext, usePantry } from './addToPantry';


export interface AddFoodItemForm {
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

const FoodSearch = () => {
    const [searchName, setSearchName] = useState('');
    const [searchResults, setSearchResults] = useState<AddFoodItemForm[]>([]);
    const [isSearching, setIsSearching] = useState(false); // Track loading state
    const [page, setPage] = useState(1); // Track the current page
    const [hasMore, setHasMore] = useState(true); // Track if there are more results to load
    const [loadingMore, setLoadingMore] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBarcodeScannerVisible, setIsBarcodeScannerVisible] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState<AddFoodItemForm | null>(null);
    const { selectedItem,setSelectedItem,selectedBarcode,setSelectedBarcode } = usePantry()




    const handleSearchByName = async (newPage: number = 1) => {
        if (!searchName.trim()) {
            Alert.alert('Error', 'Please enter a food name to search.');
            return;
        }
        Keyboard.dismiss(); // Dismiss the keyboard after search

        if (newPage === 1) {
            setIsSearching(true);
            setHasMore(true);
            setPage(1);
        }
        setLoadingMore(true); // Set loading to true before fetching

        try {
            const response = await fetch(
                `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
                    searchName
                )}&search_simple=1&json=1&page=${newPage}`
            );
            const result = await response.json();

            if (result.products && result.products.length > 0) {
                const foodItems: AddFoodItemForm[] = result.products.map((product: any) => ({
                    name: product?.product_name || '',
                    barcode: product?.code || '',
                    brand: product?.brands || '',
                    imageUrl: product?.image_url || '@/assets/images/alcohol.png',
                    ingredients: product?.ingredients_text || '',
                    calories:
                        product.nutriments?.['energy-kcal_100g'] != null
                            ? product.nutriments?.['energy-kcal_100g'] + 'kcal'
                            : undefined,
                    protein: product.nutriments?.proteins_100g + product.nutriments?.proteins_unit || undefined,
                    fat: product.nutriments?.fat_100g + product.nutriments?.fat_unit || undefined,
                    carbohydrates: product.nutriments?.carbohydrates_100g + product.nutriments?.carbohydrates_unit || undefined,
                    salt: product.nutriments?.salt_100g + product.nutriments?.salt_unit || undefined,
                    saturatedFat: product.nutriments?.['saturated-fat_100g'] + product.nutriments?.saturated_fat_unit || undefined,
                    sodium: product.nutriments?.sodium_100g + product.nutriments?.sodium_unit || undefined,
                    sugars: product.nutriments?.sugars_100g + product.nutriments?.sugars_unit || undefined,
                    fiber: product.nutriments?.fiber_100g + product.nutriments?.fiber_unit || undefined,
                    calcium: product.nutriments?.calcium_100g + product.nutriments?.calcium_unit || undefined,
                    iron: product.nutriments?.iron_100g + product.nutriments?.iron_unit || undefined,
                    potassium: product.nutriments?.potassium_100g + product.nutriments?.potassium_unit || undefined,
                }));
                // Filter results for a more lenient match
                const filteredResults = foodItems.filter(item =>
                    item.name.toLowerCase().includes(searchName.toLowerCase())
                );

                if (newPage === 1) {
                    setSearchResults(filteredResults);
                } else {
                    setSearchResults(prevResults => [...prevResults, ...filteredResults]);
                }
                setPage(prevPage => prevPage + 1);
                if (filteredResults.length < 20) { // Example page size is 20
                    setHasMore(false);
                }

            } else {
                if (newPage === 1) {
                    setSearchResults([]);
                }
                setHasMore(false);
            }
        } catch (error: any) {
            Alert.alert('Error', `Error searching for food: ${error.message}`);
            setSearchResults([]);
            setHasMore(false);
        } finally {
            setIsSearching(false); // Set loading to false after fetching
            setLoadingMore(false);
        }
    };

    const selectSearchResult = (foodItem: AddFoodItemForm) => {
        setSelectedFoodItem(foodItem);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedFoodItem(null);
    };

    const handleCloseBarcodeScanner = () => {
        setIsBarcodeScannerVisible(false);
    };

    const renderItem = useCallback(
        ({ item }: { item: AddFoodItemForm }) => (
            <TouchableOpacity style={styles.searchResultItem} onPress={() => selectSearchResult(item)}>
                
                <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.foodImage}
                    defaultSource={require('@/assets/images/alcohol.png')} // Provide a placeholder
                />

                <Text style={styles.foodNameText}>{item.name}</Text>
                <Text style={styles.foodBrandText}>{item.brand}</Text>
                <Text style={styles.foodBarcodeText}>{item.barcode}</Text>
            </TouchableOpacity>
        ),
        [selectSearchResult]
    );

    const handleConfirmSelection = () => {
        if (selectedFoodItem) {
            setSelectedItem(selectedFoodItem.name || '' ); // Update context
            setSelectedBarcode(selectedFoodItem.barcode || '')
            router.back();
        }
        handleCloseModal();
    };

    const keyExtractor = useCallback((item: AddFoodItemForm) => item.barcode || item.name, []);

    const loadMore = useCallback(() => {
        if (hasMore && !loadingMore) {
            handleSearchByName(page);
        }
    }, [hasMore, loadingMore, page, handleSearchByName]);


    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
        );
    };

    function handleBarcodeScanned(data: AddFoodItemForm): void {
        setSelectedFoodItem(data);
        setIsBarcodeScannerVisible(false);
        selectSearchResult(data); // Pass the scanned data to the parent component
        setIsModalVisible(true); // Show the food details modal
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                      <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Search Food Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter food name to search"
                    value={searchName}
                    onChangeText={setSearchName}
                    onSubmitEditing={() => {
                        setPage(1);
                        setHasMore(true);
                        handleSearchByName(1);
                    }} // Trigger search on Enter key
                    returnKeyType="search"
                />
                <TouchableOpacity >
                    <Ionicons
                        name="barcode"
                        size={24}
                        color="black"
                        onPress={() => setIsBarcodeScannerVisible(true)}
                        style={{ position: 'absolute', right: 10, top: 12 }} // Adjust position as needed
                    />
                </TouchableOpacity>
            </View>

            {isSearching && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            )}

            {searchResults.length > 0 && (
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    style={styles.searchResultsContainer}
                    numColumns={2} 
                    columnWrapperStyle={styles.row} // Apply row style
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5} // Load more when 50% of the list is scrolled
                    ListFooterComponent={renderFooter}
                />
            )}
            <FoodDetailsModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                foodItem={selectedFoodItem}
                onConfirm={handleConfirmSelection} // Pass the confirm function
            />

            <BarcodeModal
                isVisible={isBarcodeScannerVisible}
                onClose={handleCloseBarcodeScanner}
                onBarcodeScanned={handleBarcodeScanned}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
      backButtonText: {
        color: COLORS.primary,
        textAlign: 'center',
      },
    container: {
        padding: 20,
        backgroundColor: COLORS.background,
        minHeight:900
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
        color: 'black',
        backgroundColor: 'white',
        
    },
    searchButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        width: '50%',
    },
    searchResultsContainer: {
        marginTop: 20,
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10, // Add spacing between rows
    },
    searchResultItem: {
        flex: 1, // Evenly distribute items within a row
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 5, // Add horizontal margin between items
        elevation: 3,
        alignItems: 'center', // Center content within the card
    },
    searchResultItemText: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
        textAlign: 'center',
    },
    foodImage: {
        width: 150, // Adjust width to fit within the card
        height: 150, // Set a fixed height for the image
        borderRadius: 8,
        marginBottom: 5,
        resizeMode: 'contain', // Ensure the image fits within the bounds
    },
    foodNameText: {
        fontSize: 16,
        fontWeight: 'semibold',
        color: '#333',
        marginTop: 5,
        textAlign: 'center',
        overflow: 'hidden',
        lineHeight: 20, // Add this
        maxHeight: 40,  //and this
    },
    foodBrandText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
        textAlign: 'center',
        marginBottom: 5,
    },
    foodBarcodeText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
        textAlign: 'center',
    },
    loadingContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingMoreContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    loadingMoreText: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
});

export default FoodSearch;


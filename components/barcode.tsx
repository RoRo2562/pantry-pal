import React, { useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator, Image } from 'react-native';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    onBarcodeScanned: (data: AddFoodItemForm) => void;
}

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

const BarcodeModal: React.FC<ModalProps> = ({
    isVisible,
    onClose,
    onBarcodeScanned,
}) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [nutriscoreUri, setNutriscoreUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Request camera permissions when the modal becomes visible
    useEffect(() => {
        if (isVisible) {
            (async () => {
                const { status } = await requestPermission();
                if (status !== 'granted') {
                    setError('Permission to access camera was denied');
                }
            })();

        }
    }, [isVisible, requestPermission]);

    if (!isVisible) return null;

    if (!permission) {
        return <View />;
    }

    if (!permission.granted && !error) { //check for error.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }
    if (error) { //show error message
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
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
        if (scanned) return; // Prevent multiple scans

        try {
            setScanned(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${data}.json`);
            const result = await response.json();
            const foodItem: AddFoodItemForm = {
                name: result.product?.product_name || 'N/A',
                barcode: result.code,
                brand: result.product?.brands || 'N/A',
                imageUrl: result.product?.image_url || '',
                ingredients: result.product?.ingredients_text || 'N/A',
                calories: result.product?.nutriments?.['energy-kcal_100g'] ? result.product.nutriments['energy-kcal_100g'] + "kcal" : undefined,
                protein: result.product?.nutriments?.proteins_100g || undefined,
                fat: result.product?.nutriments?.fat_100g || undefined,
                carbohydrates: result.product?.nutriments?.carbohydrates_100g || undefined,
                salt: result.product?.nutriments?.salt_100g || undefined,
                saturatedFat: result.product?.nutriments?.saturated_fat_100g || undefined,
                sodium: result.product?.nutriments?.sodium_100g || undefined,
                sugars: result.product?.nutriments?.sugars_100g || undefined,
                fiber: result.product?.nutriments?.fiber_100g || undefined,
                calcium: result.product?.nutriments?.calcium_100g || undefined,
                iron: result.product?.nutriments?.iron_100g || undefined,
                potassium: result.product?.nutriments?.potassium_100g || undefined,
            };
            setScanned(false)
            onBarcodeScanned(foodItem); // Pass the raw barcode data to the parent

            if (result.status === 1 && result.product) {
                if (result.product.nutriscore_grade) {
                    setNutriscoreUri(`https://static.openfoodfacts.org/images/misc/nutriscore-${result.product.nutriscore_grade}-new-en.svg`);
                } else {
                    setNutriscoreUri(null); // Or some default/message
                }
            } else {
                setError("Product not found.");
            }
        } catch (error: any) {
            console.error(error);
            setError("Failed to fetch product data.");
        } finally {
            setLoading(false);
        }
    };

    const rescan = () => {
        setScanned(false);
        setNutriscoreUri(null);
        setError(null);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            style={styles.modal} // Apply modal styles directly
        >
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                                  <Ionicons name="close" color="black" size={24} />
                                      </TouchableOpacity>

                {permission?.granted && (
                    <View style={styles.cameraContainer}>
                        <CameraView
                            style={styles.camera}
                            facing={facing}
                            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: ['upc_a', 'upc_e'],
                            }}
                        />
                        
                    </View>
                )}

                <View style={styles.overlay}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.text}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    )}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity style={styles.rescanButton} onPress={rescan}>
                                <Text style={styles.text}>Rescan</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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

    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for the entire screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        flex: 1,
         // Keep modal content transparent
        borderRadius: 8,
        paddingHorizontal:'10%',
        paddingVertical:'30%',           // Remove padding
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cameraContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between', // Push content to edges
        alignItems: 'center',
        paddingBottom: 20, // Add some padding at the bottom
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#000'
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 200,
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 18,
    },
    errorContainer: {
        backgroundColor: 'rgba(255,0,0,0.8)',
        padding: 10,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
        width: '100%',
    },
    flipButton: {
        backgroundColor: '#3b82f6',
        padding: 10,
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 8,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    rescanButton: {
        backgroundColor: '#3b82f6',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    productInfoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    productInfoText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Add this missing style:
    message: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
});

export default BarcodeModal;


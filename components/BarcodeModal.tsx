import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, ActivityIndicator,Image } from 'react-native';


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

const BarcodeScannerModal: React.FC<ModalProps>  = ({
  isVisible,
  onClose,
  onBarcodeScanned,
}: {
  isVisible: boolean;
  onClose: () => void;
  onBarcodeScanned: (data: AddFoodItemForm) => void;
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [nutriscoreUri, setNutriscoreUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isVisible) return null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
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
        name: result.product?.product_name,
        barcode: result.code,
        brand: result.product.brands || '',
        imageUrl: result.product.image_url || '',
        ingredients: result.product.ingredients_text || '',
        calories: result.product.nutriments?.['energy-kcal_100g'] + "kcal" || undefined,
        protein: result.product.nutriments?.proteins_100g || undefined,
        fat: result.product.nutriments?.fat_100g || undefined,
        carbohydrates: result.product.nutriments?.carbohydrates_100g || undefined,
        salt: result.product.nutriments?.salt_100g || undefined,
        saturatedFat: result.product.nutriments?.saturated_fat_100g || undefined,
        sodium: result.product.nutriments?.sodium_100g || undefined,
        sugars: result.product.nutriments?.sugars_100g || undefined,
        fiber: result.product.nutriments?.fiber_100g || undefined,
        calcium: result.product.nutriments?.calcium_100g || undefined,
        iron: result.product.nutriments?.iron_100g || undefined,
        potassium: result.product.nutriments?.potassium_100g || undefined,
      }
      onBarcodeScanned(foodItem); // Pass the raw barcode data to the parent

      if (result.status === 1 && result.product) {
        // console.log(result.product.quantity);
        // console.log(result.product.nutriments);
        // console.log(result.product.ingredients_text);

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
            >
                {/* <View style={styles.modalOverlay}> */}
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                    <Ionicons name="close" color="black" size={24} />
                        </TouchableOpacity>
                        <View style={styles.modalInnerContent}>
                            {permission?.granted && (
                                <View style={{ flex: 1}}>
                                <CameraView
                                    style={styles.camera}
                                    facing={facing}
                                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                                    barcodeScannerSettings={{
                                    barcodeTypes: ['upc_a', 'upc_e'],
                                    }}
                                />
                            {/* <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                                <Text style={styles.text}>Flip Camera</Text>
                            </TouchableOpacity> */}
                            </View>
                            )}

                    {/* {loading && (
                        <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    )} */}
                    {/* {error && (
                        <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.rescanButton} onPress={rescan}>
                            <Text style={styles.text}>Rescan</Text>
                        </TouchableOpacity>
                        </View>)} */}
                        </View> 
                    </View>
                {/* </View> */}
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
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  camera: {
    flex: 1,

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

export default BarcodeScannerModal;
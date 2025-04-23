import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, Image } from 'react-native';
import { SvgUri } from 'react-native-svg'; // Install react-native-svg-uri
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [nutriscore, setNutriscore] = useState('');
  const [datap, setDatap] = useState<any>(null); // Use a proper type if you have OpenFoodFacts API model
  const navigation = useNavigation<any>();

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
    try {
      setScanned(true);
      
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${data}.json`);
      const result = await response.json();
      // console.log(result.product.product_quantity)
      // console.log(result.product.product_quantity_unit)
      console.log(result.product.quantity)
      console.log(result.product.nutriments)
      console.log(result.product.ingredients_text)
      setDatap(result.product);
      setNutriscore(`https://static.openfoodfacts.org/images/misc/nutriscore-${result.product.nutriscore_grade}-new-en.svg`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch product data.");
    }
  };

  const rescan = () => {
    setScanned(false);
    setDatap(null);
    setNutriscore('');
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['upc_a', 'upc_e'],
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <ScrollView>
        <View style={styles.contentContainer}>
          {datap ? (
            <View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {datap.image_url && (
                  <Image source={{ uri: datap.image_url }} resizeMode='contain' style={{ width: 200, height: 200 }} />
                )}
                {datap.image_ingredients_url && (
                  <Image source={{ uri: datap.image_ingredients_url }} resizeMode='contain' style={{ width: 200, height: 200 }} />
                )}
              </View>
              <Text style={styles.bigt}>{datap.product_name}</Text>
              <Text style={styles.bigt}>Nutriscore: {datap.nutriscore_grade?.toUpperCase()}</Text>
              <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                {nutriscore && (
                  <SvgUri uri={nutriscore} width="150" height="50" />
                )}
              </View>
              <Text>Protein per 100g: {datap.nutriments.proteins_100g}</Text>
              <Text>Kj per : {datap.nutriments["energy-kj_100g"]}</Text>
              <Text>Quantity: {datap.quantity}</Text>
            </View>
          ) : (
            <Text>No product data available.</Text>
          )}

          {scanned && (
            <View style={styles.mb}>
              <Button title="Tap to Scan Again" onPress={rescan} />
            </View>
          )}

          {datap && (
            <Button title="More Details" onPress={() => navigation.navigate("Product", { datap })} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  mb: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  bigt: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
});

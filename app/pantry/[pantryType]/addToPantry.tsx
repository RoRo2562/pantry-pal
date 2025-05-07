import { View, Text, TouchableOpacity,StyleSheet, TextInput,Image, ScrollView } from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { router, useLocalSearchParams, useRouter } from 'expo-router'
import { COLORS } from '@/constants/theme';
import { Ionicons, FontAwesome, EvilIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import IconModal from '@/components/IconModal';
import { iconOptions } from '@/constants/data';
import RNDateTimePicker from '@react-native-community/datetimepicker';

// Create the context
export const PantryContext = createContext<{
  selectedItem: string;
  setSelectedItem: (name: string) => void;
  selectedBarcode: string;
  setSelectedBarcode: (barcode: string) => void;
} | null>(null);


// Create a Provider for the context
export const PantryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedBarcode,setSelectedBarcode] = useState('')

  const contextValue = {
    selectedItem,
    setSelectedItem,
    selectedBarcode,
    setSelectedBarcode
  };

  return (
    <PantryContext.Provider value={contextValue}>
      {children}
    </PantryContext.Provider>
  );
};

// Custom hook to use the context
export const usePantry = () => {
  const context = useContext(PantryContext);
  if (!context) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};


export default function AddToPantry() {
  const router = useRouter();
  const { selectedItem, setSelectedItem,selectedBarcode,setSelectedBarcode} = usePantry();

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    expiryDate: new Date(),
    iconUrl: '@/assets/images/pork.png',
    
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(iconOptions[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(formData.expiryDate);

  const handleImageSelect = (image:{name:string,uri:any}) => {
    setSelectedImage(image);
    setIsModalVisible(false);
    // If you still want to store a reference, you can store the name or URI
    handleInputChange('iconUrl', image.uri);
  };


  function handleInputChange(field: string, value: string): void {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    console.log(formData)
  }

  function handleFoodSelect(food: any) {
    handleInputChange('barcode', food.barcode);
  }

  const goToSearchFood = () => {
    router.push('/pantry/[pantryType]/searchFood');
  };

    useEffect(() => {
        if (selectedItem) {
            handleInputChange('barcode', selectedBarcode);
            console.log(selectedItem)
            handleInputChange('name', selectedItem);
        }
    }, [selectedItem]);
  return (
    <View style={styles.screenContainer}>
      <View style={styles.titleContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>AddToPantry</Text>

      </View>
      
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter food name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
              />
          </View>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Icon</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                {selectedImage ? (
                  <Image source={selectedImage.uri} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                ) : (
                  <Text>No Icon selected</Text>
                )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Food Item</Text>
            <TouchableOpacity
              style={styles.foodItemSelect}
              onPress={goToSearchFood} // Pass empty string, or some identifier
            >
              <Text style={styles.input}>
                {formData.barcode ? formData.name + " - " + formData.barcode  : 'Select Food Item'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <RNDateTimePicker
                value={formData.expiryDate} // Required: The currently selected date
                mode="date" // Optional: The mode (e.g., "date", "time", or "datetime")
                display="default" // Optional: The display style (e.g., "default", "spinner", or "calendar")
                onChange={(event, date) => {
                  if (date) {
                    
                    handleInputChange('expiryDate', date.toDateString()); // Update the formData
                  }
                }}
              />
          </View>

      <IconModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onImageSelect={handleImageSelect}/>

      </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
},
titleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 20,
  paddingBottom: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
},
  backButtonText: {
    color: COLORS.primary,
    textAlign: 'center',
  },
  container: {
      flex: 1,
      backgroundColor: COLORS.background,
      padding: 20,
      minHeight: 500
  },
  formContainer: {
      borderRadius: 12,
      padding: 20,
      elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    flex: 1,
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
      backgroundColor: '#fff',
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
  
  foodItemSelect: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.background,
    borderRadius: 8
  },
  foodItemText: {
    fontSize: 16,
    color: COLORS.primary
  },
});




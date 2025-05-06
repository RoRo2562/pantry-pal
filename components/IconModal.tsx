import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { iconOptions } from '@/constants/data'; // Adjust the path to your icon options

export default function IconModal({ isVisible, onClose, onImageSelect }: { isVisible: boolean; onClose: () => void; onImageSelect: (image: {name:string,uri:string}) => void }) {

  const renderImage = (imageUri: any) => {
    return (
      <Image source={imageUri} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" color="black" size={24} />
          </TouchableOpacity>
          <ScrollView style={styles.modalInnerContent}>
            <Text>Select an Image:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}> 
              {iconOptions.map((image) => (
                <TouchableOpacity key={image.name} onPress={() => onImageSelect(image)} style={styles.imageOption}> 
                  <View style={styles.imageContainer}>
                    <Image source={image.uri} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                  </View>
                  <Text style={styles.imageLabel}>{image.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

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
  imageOption: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    width: 80, // Adjust as needed for your layout
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 25, // Optional: for a circular look
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLabel: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 12,
    color: 'gray',
  },
});
import React, { useState } from 'react';
import { Button, View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const GOOGLE_VISION_API_KEY = 'AIzaSyAyRot5JwKaVjztuB8KhhPvPk7XcjWZ8iw';

const FoodVision = () => {
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLabels([]);
    setLoading(true);

    const result = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      setImage(result.assets[0].uri);

      const body = {
        requests: [
          {
            image: { content: base64 },
            features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
          },
        ],
      };

      try {
        const res = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      
        const resultText = await res.text();
        console.log("Vision API response text:", resultText);
      
        const json = JSON.parse(resultText);
        const labelResults = json.responses[0]?.labelAnnotations || [];
        const foodLabels = labelResults.map((l) => l.description);
        setLabels(foodLabels);
      } catch (error) {
        console.error("Error during Vision API call:", error);
        alert("Failed to analyze image. Please try again.");
      } finally {
        setLoading(false);  // Ensures loading spinner stops
      }
    } else {
      setLoading(false);  // Stops loading if image is not selected
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take Photo of Food" onPress={pickImage} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {labels.length > 0 && (
        <View style={styles.labelBox}>
          <Text style={styles.labelTitle}>🍽️ Food Labels:</Text>
          {labels.map((label, idx) => (
            <Text key={idx}>- {label}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  image: { width: 250, height: 250, marginTop: 20, borderRadius: 10 },
  labelBox: { marginTop: 20, alignItems: "flex-start" },
  labelTitle: { fontWeight: "bold", fontSize: 18 },
});

export default FoodVision;

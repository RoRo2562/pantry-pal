import { View, Text,Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { PantrySliderType } from '@/data/PantrySlider'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
const { width } = Dimensions.get('screen');

type Props = {
  item: PantrySliderType,
  index: number,
  scrollX: SharedValue<number>,
}

export default function SliderItem({item, index,scrollX}: Props) {
    const rnAnimatedStyle = useAnimatedStyle(() => {
        return{
            transform: [
                {
                    translateX: interpolate(scrollX.value, 
                        [(index-1)*width, index*width, (index+1)*width], 
                        [-width *0.4, 0, width*0.4],
                        Extrapolation.CLAMP
                ),
                },
            ],
        }
    })
  return (
    <Animated.View style={[styles.itemContainer,rnAnimatedStyle ]}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: item.color, width: width*0.5, borderRadius: 20, padding: 20}}>
        <Text>{item.title}</Text>
        <Image
            source={item.image}
            style={{ width: 100, height: 100 }}
        />
        </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        width: width,
    },
})
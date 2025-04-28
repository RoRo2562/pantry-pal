import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { PantrySlider, PantrySliderType } from '@/data/PantrySlider'
import SliderItem from './SliderItem'
import Animated, {useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated'

type Props = {
    itemList: PantrySliderType[]
}

export default function Slider({itemList}: Props) {
    const scrollX = useSharedValue(0);

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    })
  return (
    <View>
      <Animated.FlatList 
        data={itemList} 
        renderItem={({item,index}) => (<SliderItem item={item} index={index} scrollX={scrollX}/>)} 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        onScroll={onScrollHandler}
        style={{flex:1}}/>
        
        
    </View>
  )
}
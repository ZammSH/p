import { StyleSheet, Text, View, FlatList, Image, Dimensions } from "react-native"
import React, { useEffect, useRef, useState } from "react"

export default function Slider() {

    const flatListRef = useRef()

    const [activateIndex, setActivateIndex] = useState(0)

    //AutoScroll

    useEffect(() => {
        let interval = setInterval(() => {
            if (activateIndex === sliderData.length-1){
                flatListRef.current.scrollToIndex({
                    index: 0,
                    animation: true,
                })
            }
            else {
                flatListRef.current.scrollToIndex({
                    index: activateIndex+1,
                    animation: true,
                })
            }
        },2000)

        return () => clearInterval(interval)
    })

    const getItemLayout = (data, index) => ({
        length: Dimensions.get('screen').width*0.9,
        offset: (Dimensions.get('screen').width*0.9) *index,
        index: index
    })
    
    const sliderData = [
        {
            id: "0",
            image: require("./../../assets/images/slider/slider1.jpeg")
        },
        {
            id: "1",
            image: require("./../../assets/images/slider/slider2.jpg")
        },
        {
            id: "2",
            image: require("./../../assets/images/slider/slider3.jpeg")
        },

    ]

    const renderItem = ({item, index}) => {
        return (<View>
            <Image source={item.image} style={styles.images} />
        </View>)
    }

    const handleScroll = (event) => {
        
        //Se obtiene la posición del Scroll
        const scrollPosition = event.nativeEvent.contentOffset.x
        //console.log({scrollPosition})

        const index = Math.round(scrollPosition / (Dimensions.get('screen').width*0.9))
        //console.log({index})

        setActivateIndex(index)


    }

    const renderDotIndicators = () => {
        return sliderData.map((dot, index) => {

            if (activateIndex === index){
                return (
                    <View key={index} style={styles.dots2}></View>
                )
            }
            else {
                return (
                    <View key={index} style={styles.dots}></View>
                )
            }
        })
    }

    return (
        <View>
            <FlatList 
                data={sliderData}
                ref={flatListRef}
                getItemLayout={getItemLayout}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal={true}
                pagingEnabled={true}
                onScroll={handleScroll}
            />
            <View style={styles.dotContainer}>
                {renderDotIndicators()}
            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({
    images: {
        height: 200,
        width: Dimensions.get('screen').width*0.9,
        borderRadius: 15,
        marginRight: 15
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    dots: {
        backgroundColor: 'red',
        height: 10, 
        width: 10, 
        borderRadius: 5,
        marginHorizontal: 6,
    },
    dots2: {
        backgroundColor: 'green',
        height: 10, 
        width: 10, 
        borderRadius: 5,
        marginHorizontal: 6,
    }  
})
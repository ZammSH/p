import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from '../../components/home/header'
import Categories from '../../components/home/categories'
import Slider from '../../components/home/Slider'

export default function Home() {
    return (
        <View style={styles.container}>
            <Header />
            <Slider />
            <Categories />
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 20, 
        marginTop: 20
    }
})
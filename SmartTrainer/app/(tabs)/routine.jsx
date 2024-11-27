import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Calendar from '../../components/routine/calendar'

export default function Routine() {
    return (
        <View style={styles.container}>
            <Calendar/>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 20, 
        marginTop: 20
    }
})
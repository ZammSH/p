import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyProfile from '../../components/profile/myProfile'

export default function Profile() {
    return (
        <View style={styles.container}>
           <MyProfile/>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        padding: 20, 
        marginTop: 20,
        flex: 1
    }
})
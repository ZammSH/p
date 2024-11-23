import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
export default function tabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'yellow'
            }}>
            <Tabs.Screen name='home'
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon:({color}) => <Ionicons name="home" size={24} color={color} />
                }}/>
            <Tabs.Screen name='routine'
                options={{
                    title: 'Routine',
                    headerShown: false,
                    tabBarIcon:({color}) => <FontAwesome6 name="dumbbell" size={24} color={color} />
                }}/>
            <Tabs.Screen name='stats'
                options={{
                    title: 'Stats',
                    headerShown: false,
                    tabBarIcon:({color}) => <Ionicons name="stats-chart" size={24} color={color} />
                }}/>
            <Tabs.Screen name='profile'
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon:({color}) => <Ionicons name="person-circle" size={24} color={color} />
                }}/>

        </Tabs>
    )
}
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                // Aquí obtendrás las notificaciones del usuario, por ejemplo, del servidor
                // Para fines demostrativos, usaremos un array estático.
                setNotifications([
                    { id: '1', message: 'Tienes un nuevo mensaje' },
                    { id: '2', message: 'Tu rutina ha sido actualizada' },
                    { id: '3', message: 'Recuerda realizar tu entrenamiento de hoy' },
                ]);
            }
        };

        fetchNotifications();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.message}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Notificaciones</Text>
            </View>
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.notificationList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    notificationList: {
        padding: 10,
    },
    notificationItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    notificationText: {
        fontSize: 16,
        color: '#333',
    },
});

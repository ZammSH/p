import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Recuperar el nombre del usuario
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.nombre); // Asume que `nombre` está en los datos del usuario
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcome}>Bienvenida</Text>
        <Text style={styles.userName}>{userName || 'UserName'}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 99,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

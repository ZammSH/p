import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
        <View>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.userName}>UserName</Text>
        </View>
        <Image style={styles.userImage}></Image>
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
    fontSize: 18
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

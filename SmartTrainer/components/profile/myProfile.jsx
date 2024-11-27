import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'


const profilePicture = require("./../../assets/images/profile/profile.png")

export default function MyProfile () {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topSection}>
                    <View style={styles.propicArea}>
                        <Image source={profilePicture} style={styles.propic}/>
                    </View>
                    <Text style={styles.name}>UserName</Text>
                    <Text style={styles.membership}>Premium</Text>
                </View>

                <View style={styles.buttonList}>
                    <TouchableOpacity style={styles.buttonSection} activeOpacity="contain">
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Ionicons name="person" size={30} color="black" />
                            </View>
                            <Text style={styles.buttonName}>Cuenta</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity="contain">
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Ionicons name="help" size={30} color="black" />
                            </View>
                            <Text style={styles.buttonName}>Ayuda</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity="contain" onPress={() => router.push('/')}>
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Ionicons name="log-out" size={30} color="black" />
                            </View>
                            <Text style={styles.buttonName}>Cerrar Sesión</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity="contain">
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Ionicons name="notifications" size={30} color="black" />
                            </View>
                            <Text style={styles.buttonName}>Notificaciones</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonSection} activeOpacity="contain">
                        <View style={styles.buttonArea}>
                            <View style={styles.iconArea}>
                                <Ionicons name="settings" size={30} color="black" />
                            </View>
                            <Text style={styles.buttonName}>Configuración</Text>
                        </View>
                        <View style={styles.sp}></View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1
    },
    topSection: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    propicArea: {
        width: 170,
        height: 170,
        borderRadius: '100%',
        borderWidth: 2,
        borderColor: 'black'
    },
    propic: {
        width: '100%',
        height: '100%',
        borderRadius: 100
    }, 
    name: {
        marginTop: 20,
        color: 'black',
        fontSize: 32,
        fontWeight: 'bold'
    },
    membership: {
        color: 'black',
        fontSize: 18,
    },
    buttonList: {
        marginTop: 20
    },
    buttonSection: {
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 25,
        paddingRight: 25
    },
    buttonArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconArea: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonName: {
        width: 300,
        fontSize: 20,
        color: 'black',
        marginLeft: 20,
    },
    sp: {
        width: 400,
        marginTop: 10,
        height: 1,
        backgroundColor: 'gray'
    }
})
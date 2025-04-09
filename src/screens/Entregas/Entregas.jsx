import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Entregas = () => {
    const navigation = useNavigation()

    const handleGoHome = () => {
        navigation.navigate("Home")
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoHome} style={styles.arrowButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Minhas Entregas</Text>
            </View>
            <Text style={styles.text}>Entregas</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#e4e5f5',
        elevation: 3,
    },
    arrowButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 50,
    },
})

export default Entregas
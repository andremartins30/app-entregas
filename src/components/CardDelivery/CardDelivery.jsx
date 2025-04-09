import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const DeliveryCard = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Entrega Disponível</Text>
            <Text style={styles.detail}>Cliente: João da Silva</Text>
            <Text style={styles.detail}>Endereço: Av. Julio Campos, 1000</Text>
            <Text style={styles.detail}>Data: 10/04/2025</Text>
            <Text style={styles.detail}>Horário: 14:00</Text>
            <Text style={styles.detail}>Status: Pendente</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 14,
        marginBottom: 5,
    },
})

export default DeliveryCard
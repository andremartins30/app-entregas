import React, { useState } from "react"
import { Text, StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import CardDelivery from "../../components/CardDelivery/CardDelivery"

export const Home = () => {
    const navigation = useNavigation()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenuToggle = () => setMenuOpen(!menuOpen)
    const handleArrowBack = () => setMenuOpen(false)
    const handleDelivery = () => navigation.navigate("Delivery")
    const handleLogout = () => navigation.navigate("Login")
    const handleEntregas = () => navigation.navigate("Entregas")

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenuToggle}>
                    <Ionicons name="menu" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {menuOpen && (
                <View style={styles.drawer}>
                    <View style={styles.drawerHeaderContainer}>
                        <Text style={styles.drawerHeader}>Menu</Text>
                        <TouchableOpacity style={styles.arrowButton} onPress={handleArrowBack}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* Container principal para as opções do menu */}
                    <View style={styles.drawerContent}>
                        <TouchableOpacity onPress={handleEntregas} style={styles.menuItemButton}>
                            <Text style={styles.menuItemText}> Minhas Entregas</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Botão "Sair" fica no final do drawer */}
                    <TouchableOpacity onPress={handleLogout} style={styles.menuItemButton}>
                        <Text style={styles.menuItemText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            )}

            <CardDelivery />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
        position: 'relative',
    },
    topBar: {
        flexDirection: 'row',
        marginTop: 50,
        marginLeft: 20,
    },
    menuButton: {
        marginRight: 20,
    },
    arrowButton: {
        padding: 5,
        marginLeft: 10,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 200,
        backgroundColor: '#e5e4f8',
        paddingTop: 50,
        paddingHorizontal: 10,
        elevation: 5,
        zIndex: 1,
        paddingBottom: 10,
    },
    drawerHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    drawerHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Container para os itens do menu
    drawerContent: {
        flex: 1, // Ocupa todo o espaço disponível
    },
    menuItemButton: {
        borderWidth: 0.5,
        borderColor: '#333',
        borderRadius: 2,
        marginBottom: 15,
        padding: 10,
    },
    menuItemText: {
        fontSize: 16,
    },
    text: {
        marginTop: 100,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default Home
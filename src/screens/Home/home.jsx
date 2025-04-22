import React, { useState, useRef, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert, BackHandler, Animated, PanResponder, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from '../../hooks/useAuth';
import Header from "../../components/Header/Header";
import { theme } from '../../constants/theme';
import { useEntrega } from "../../hooks/useEntrega";

export const Home = () => {
    const navigation = useNavigation();
    const { signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-280)).current;
    const { countEntregasDoEntregador } = useEntrega();
    const [avaliableCount, setAvailableCount] = useState(0);

    useEffect(() => {
        countEntregasDoEntregador()
            .then(count => setAvailableCount(count))   // recebe número diretamente
            .catch(err => console.error('Erro ao contar:', err))
    }, [])

    // PanResponder configuration remains the same
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20,
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -50) {
                    closeDrawer();
                } else {
                    Animated.timing(drawerAnim, {
                        toValue: 0,
                        duration: 150,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    // Back button handler remains the same
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                Alert.alert(
                    "Desconectar",
                    "Deseja desconectar do aplicativo?",
                    [
                        {
                            text: "Não",
                            onPress: () => null,
                            style: "cancel"
                        },
                        {
                            text: "Sim",
                            onPress: () => navigation.navigate("Login")
                        }
                    ],
                    { cancelable: false }
                );
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );

            return () => backHandler.remove();
        }, [navigation])
    );

    // Menu functions remain the same
    const openDrawer = () => {
        setMenuOpen(true);
        Animated.timing(drawerAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerAnim, {
            toValue: -280,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setMenuOpen(false));
    };

    const handleMenuToggle = () => {
        if (menuOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    };

    // Navigation handlers
    const handleDelivery = () => navigation.navigate("Delivery");
    const handleVeiculos = () => navigation.navigate("Veiculos");
    const handleEntregas = () => navigation.navigate("Entregas");
    const handleSettingsToggle = () => setSettingsOpen(!settingsOpen);

    const handleLogout = async () => {
        Alert.alert(
            "Desconectar",
            "Deseja desconectar do aplicativo?",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        try {
                            await signOut();
                            navigation.navigate("Login");
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível fazer logout");
                        }
                    }
                }
            ]
        );
    };

    const handleRefresh = async () => {
        try {
            const newCount = await countEntregasDoEntregador();
            if (newCount !== avaliableCount) {
                setAvailableCount(newCount);
                // Opcional: Mostrar uma mensagem de atualização
                Alert.alert(
                    "Atualização",
                    "Novas entregas disponíveis!",
                    [{ text: "OK" }]
                );
            }
        } catch (err) {
            console.error('Erro ao atualizar:', err);
            Alert.alert("Erro", "Não foi possível atualizar as entregas");
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Dashboard"
                showMenu={true}
                onMenuPress={handleMenuToggle}
                onRefreshPress={handleRefresh}
                showRefresh={true}
            />

            {menuOpen && (
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* Menu drawer remains the same */}
            {menuOpen && (
                <Animated.View
                    style={[
                        styles.drawer,
                        { transform: [{ translateX: drawerAnim }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.drawerHeaderContainer}>
                        <Text style={styles.drawerHeader}>Menu</Text>
                        <TouchableOpacity style={styles.arrowButton} onPress={closeDrawer}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.drawerContent}>
                        <TouchableOpacity onPress={handleDelivery} style={styles.menuItemButton}>
                            <Ionicons name="list-outline" size={24} color={theme.colors.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>Entregas Disponíveis</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleEntregas} style={styles.menuItemButton}>
                            <Ionicons name="time" size={24} color={theme.colors.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>Histórico de Entregas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleVeiculos} style={styles.menuItemButton}>
                            <Ionicons name="bicycle-outline" size={24} color={theme.colors.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>Meus Veículos</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Settings menu remains the same */}
                    <TouchableOpacity onPress={handleSettingsToggle} style={styles.menuItemButton}>
                        <Ionicons name="settings-outline" size={24} color={theme.colors.text} style={styles.menuIcon} />
                        <Text style={styles.menuItemText}>Configurações</Text>
                    </TouchableOpacity>

                    {settingsOpen && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity onPress={() => navigation.navigate("Usuarios")} style={styles.dropdownItem}>
                                <Text style={styles.dropdownItemText}>Usuários</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Veiculo")} style={styles.dropdownItem}>
                                <Text style={styles.dropdownItemText}>Veículo</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity onPress={handleLogout} style={[styles.menuItemButton, styles.logoutButton]}>
                        <Ionicons name="log-out" size={24} color="#d32f2f" style={styles.menuIcon} />
                        <Text style={[styles.menuItemText, styles.logoutText]}>Sair</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* New Dashboard Content */}
            <View style={styles.dashboardContainer}>
                <Text style={styles.welcomeText}>Coleta/Entrega</Text>
                <View style={styles.dashboardGrid}>
                    <TouchableOpacity style={styles.dashboardCard} onPress={handleDelivery}>
                        <Text style={styles.cardCount}>{avaliableCount}</Text>
                        <Text style={styles.cardTitle}>Entregas Disponíveis</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dashboardCard}>
                        <Text style={styles.cardCountPend}>R$100,00</Text>
                        <Text style={styles.cardTitle}>Pendências de Pagamentos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dashboardCard} onPress={handleVeiculos}>
                        <Ionicons name="bicycle-outline" size={32} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Veículos Cadastrados</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.dashboardCard} onPress={handleEntregas}>
                        <Ionicons name="time" size={32} color={theme.colors.primary} />
                        <Text style={styles.cardTitle}>Histórico de Entregas</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        position: 'relative',
    },
    // Overlay para capturar toques fora do menu
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 0,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 280,
        backgroundColor: theme.colors.white,
        paddingTop: 50,
        paddingHorizontal: 16,
        elevation: 5,
        zIndex: 1,
    },
    drawerHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    drawerHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    drawerContent: {
        flex: 1,
    },
    menuItemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
    },
    arrowButton: {
        padding: 8,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    logoutButton: {
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        marginTop: 'auto',
        marginBottom: 32,
    },
    logoutText: {
        color: '#d32f2f',
    },
    dropdownMenu: {
        paddingLeft: 32,
        marginBottom: 8,
    },
    dropdownItem: {
        paddingVertical: 8,
    },
    dropdownItemText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    dashboardContainer: {
        flex: 1,
        padding: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    dashboardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    dashboardCard: {
        width: '45%',
        aspectRatio: 1,
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: 8,
    },

    cardCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 8,
    },

    cardCountPend: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.danger,
        marginTop: 8,
    },
});

export default Home;
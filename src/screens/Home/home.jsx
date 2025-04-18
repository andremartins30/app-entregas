import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Alert, BackHandler, ScrollView, Animated, PanResponder, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useEntrega } from '../../hooks/useEntrega';
import { useAuth } from '../../hooks/useAuth';
import Header from "../../components/Header/Header";
import DeliveryCard from "../../components/CardDelivery/CardDelivery";
import { theme } from '../../constants/theme';

export const Home = () => {
    const navigation = useNavigation();
    const { signOut } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { listarEntregasDoEntregador, loading } = useEntrega();
    const [entregas, setEntregas] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const drawerAnim = useRef(new Animated.Value(-280)).current;

    // PanResponder para detectar gesto de arrastar
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

    useEffect(() => {
        carregarEntregas();
    }, []);

    const carregarEntregas = async () => {
        try {
            setRefreshing(true);
            const dados = await listarEntregasDoEntregador();
            setEntregas(dados || []);
        } catch (error) {
            console.error('Erro ao carregar entregas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as entregas');
        } finally {
            setRefreshing(false);
        }
    };

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

    const handleArrowBack = () => closeDrawer();
    const handleDelivery = () => navigation.navigate("Delivery");
    const handleVeiculos = () => navigation.navigate("Veiculos");
    const handleRoute = (entregaId) => {
        navigation.navigate("Route", { entregaId });
    };
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
    const handleEntregas = () => navigation.navigate("Entregas");
    const handleSettingsToggle = () => setSettingsOpen(!settingsOpen);

    return (
        <View style={styles.container}>
            <Header
                title="Home"
                showMenu={true}
                onMenuPress={handleMenuToggle}
                showRefresh={true}
                onRefreshPress={carregarEntregas}
            />

            {menuOpen && (
                <TouchableWithoutFeedback onPress={closeDrawer}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

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
                        <TouchableOpacity style={styles.arrowButton} onPress={handleArrowBack}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.drawerContent}>
                        <TouchableOpacity onPress={handleEntregas} style={styles.menuItemButton}>
                            <Ionicons name="list" size={24} color={theme.colors.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>Minhas Entregas</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleVeiculos} style={styles.menuItemButton}>
                            <Ionicons name="" size={24} color={theme.colors.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>Meus Veículos</Text>
                        </TouchableOpacity>
                    </View>

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

            <ScrollView style={styles.content}>
                <View style={styles.entregasContainer}>
                    {loading || refreshing ? (
                        <DeliveryCard entrega={null} loading={true} />
                    ) : entregas.length > 0 ? (
                        entregas.map((entrega) => (
                            <TouchableOpacity
                                key={entrega.id}
                                onPress={menuOpen ? () => { } : () => handleRoute(entrega.id)}
                                disabled={menuOpen}
                                style={styles.cardContainer}
                            >
                                <DeliveryCard
                                    entrega={entrega}
                                    loading={false}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <DeliveryCard entrega={null} loading={false} />
                    )}
                </View>
            </ScrollView>
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
    content: {
        flex: 1,
        padding: 16,
    },
    entregasContainer: {
        flex: 1,
    },
    cardContainer: {
        marginBottom: 16,
    },
});

export default Home;
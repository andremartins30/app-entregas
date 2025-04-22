import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEntrega } from '../../hooks/useEntrega';
import Header from "../../components/Header/Header";
import DeliveryCard from "../../components/CardDelivery/CardDelivery";
import { theme } from '../../constants/theme';

const Delivery = () => {
    const navigation = useNavigation();
    const { listarEntregasDoEntregador } = useEntrega();
    const [entregas, setEntregas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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

    const handleRoute = (entregaId) => {
        navigation.navigate("Route", { entregaId });
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Header
                title="Entregas"
                showRefresh={true}
                showBack={true}
                onRefreshPress={carregarEntregas}
                onBackPress={handleBack}
            />

            <ScrollView style={styles.content}>
                <View style={styles.entregasContainer}>
                    {loading || refreshing ? (
                        <DeliveryCard entrega={null} loading={true} />
                    ) : entregas.length > 0 ? (
                        entregas.map((entrega) => (
                            <TouchableOpacity
                                key={entrega.id}
                                onPress={() => handleRoute(entrega.id)}
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

export default Delivery;
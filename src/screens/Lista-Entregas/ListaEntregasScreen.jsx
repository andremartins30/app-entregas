import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useEntrega } from '../../hooks/useEntrega';
import DeliveryCard from '../../components/CardDelivery/CardDelivery';

const ListaEntregasScreen = () => {
    const { listarEntregas, loading, error } = useEntrega();
    const [entregas, setEntregas] = useState([]);

    useEffect(() => {
        carregarEntregas();
    }, []);

    const carregarEntregas = async () => {
        try {
            const dados = await listarEntregas();
            setEntregas(dados);
        } catch (error) {
            console.error('Erro ao carregar entregas:', error);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={entregas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <DeliveryCard entrega={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default ListaEntregasScreen; 
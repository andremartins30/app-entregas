import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEntrega } from '../../hooks/useEntrega';
import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ResumoEntrega = () => {
    const route = useRoute();
    const { entrega } = route.params;
    const navigation = useNavigation();
    const { detalhesEntrega } = useEntrega();
    const [detalhes, setDetalhes] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        navigation.goBack();
    };

    const carregarDetalhes = async () => {
        try {
            setLoading(true);
            const dados = await detalhesEntrega(entrega.id);
            setDetalhes(dados);
        } catch (error) {
            console.error('Erro ao carregar detalhes:', error);
            Alert.alert('Erro', 'Não foi possível carregar os detalhes da entrega');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDetalhes();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Header
                    title="Resumo da Entrega"
                    showBack={true}
                    onBackPress={handleBack}
                />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Resumo da Entrega"
                showBack={true}
                onBackPress={handleBack}
            />
            <ScrollView style={styles.content}>
                <View style={styles.statusContainer}>
                    <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
                    <Text style={styles.statusText}>Entrega Finalizada</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Informações da Entrega</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Cliente:</Text>
                        <Text style={styles.value}>{detalhes?.usuario?.nome || 'Não informado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Endereço:</Text>
                        <Text style={styles.value}>{detalhes?.destino || 'Não informado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Data de Entrega:</Text>
                        <Text style={styles.value}>
                            {detalhes?.atualizadaEm
                                ? new Date(detalhes.atualizadaEm).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : 'Não informado'
                            }
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={[styles.value, styles.statusEntregue]}>{detalhes?.status || 'Não informado'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Entregador:</Text>
                        <Text style={styles.value}>{detalhes?.entregador?.nome || 'Não informado'}</Text>
                    </View>

                    {detalhes?.comprovantes && detalhes.comprovantes.length > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Comprovantes:</Text>
                            <Text style={styles.value}>{detalhes.comprovantes.length} arquivo(s)</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 10,
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    statusEntregue: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default ResumoEntrega; 
import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { theme } from '../../constants/theme'

const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Data inválida';
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
    }
};

const StatusProgress = ({ status }) => {
    const getStatusIndex = (status) => {
        const statusOrder = ['PENDENTE', 'EM_TRANSITO', 'ENTREGUE'];
        return statusOrder.indexOf(status);
    };

    const currentStep = getStatusIndex(status);

    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
                {/* Linhas de progresso */}
                <View style={styles.progressLine}>
                    {/* Primeira parte da linha */}
                    <View style={[
                        styles.progressFill,
                        { width: currentStep >= 1 ? '50%' : '0%' }
                    ]} />
                    {/* Segunda parte da linha */}
                    <View style={[
                        styles.progressFill,
                        {
                            width: currentStep >= 2 ? '50%' : '0%',
                            left: '50%'
                        }
                    ]} />
                </View>

                {/* Pontos de status */}
                <View style={[styles.dot, currentStep >= 0 && styles.activeDot]} />
                <View style={[styles.dot, currentStep >= 1 && styles.activeDot]} />
                <View style={[styles.dot, currentStep >= 2 && styles.activeDot]} />
            </View>

            {/* Labels de status com novo alinhamento */}
            <View style={styles.statusLabels}>
                <Text style={[styles.statusText, styles.statusLeft]}>Pendente</Text>
                <Text style={[styles.statusText, styles.statusCenter]}>Em Trânsito</Text>
                <Text style={[styles.statusText, styles.statusRight]}>Entregue</Text>
            </View>
        </View>
    );
};

const DeliveryCard = ({ entrega, loading }) => {
    if (loading) {
        return (
            <View style={styles.card}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!entrega) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Nenhuma entrega disponível</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>#{entrega.id}</Text>
                <Text style={styles.dateText}>{formatDate(entrega.criadaEm)}</Text>
            </View>
            <StatusProgress status={entrega.status} />
            <View style={styles.destinationContainer}>
                <Text style={styles.destinationLabel}>Destino:</Text>
                <Text style={styles.destinationText}>{entrega.destino}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        padding: 20,
        margin: 10,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    progressContainer: {
        marginVertical: 20,
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        height: 30,
    },
    progressLine: {
        position: 'absolute',
        left: '0%',
        right: '0%',
        height: 2,
        backgroundColor: '#E0E0E0',
        top: '50%',
    },
    progressFill: {
        position: 'absolute',
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
        zIndex: 1,
    },
    activeDot: {
        backgroundColor: theme.colors.primary,
    },
    statusLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingHorizontal: 0,
    },
    statusText: {
        fontSize: 12,
        color: theme.colors.text,
    },
    statusLeft: {
        textAlign: 'left',
    },
    statusCenter: {
        textAlign: 'center',
    },
    statusRight: {
        textAlign: 'right',
    },
    destinationContainer: {
        marginTop: 5,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.text,
        opacity: 0.7,
    },
    destinationLabel: {
        fontSize: 14,
        color: theme.colors.text,
    },
    destinationText: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: 2,
    },
})

export default DeliveryCard
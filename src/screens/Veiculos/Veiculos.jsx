import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useState, useEffect } from 'react'
import { veiculosService } from '../../services/veiculoService'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header/Header'

const Veiculos = () => {
    const [veiculos, setVeiculos] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        loadVeiculos()
    }, [])

    const loadVeiculos = async () => {
        try {
            const data = await veiculosService.getUserVeiculos()
            setVeiculos(data)
        } catch (error) {
            console.error('Erro ao carregar veículos:', error)
        }
    }

    const handleGoBack = () => {
        navigation.goBack();
    };

    const renderItem = ({ item }) => (
        <View style={styles.veiculoItem}>
            <Text style={styles.modelo}>{item.modelo}</Text>
            <Text style={styles.placa}>Placa: {item.placa}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Header
                title="Meus Veículos"
                showBack={true}
                onBackPress={handleGoBack}
            />
            <FlatList
                data={veiculos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
    },
    list: {
        flex: 1,
        padding: 16
    },
    veiculoItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6'
    },
    modelo: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4
    },
    placa: {
        fontSize: 16,
        color: '#6c757d'
    }
})

export default Veiculos
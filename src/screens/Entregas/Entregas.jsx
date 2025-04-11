import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header/Header'
import ListaEntregasScreen from '../Lista-Entregas/ListaEntregasScreen'

const Entregas = () => {
    const navigation = useNavigation()

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNavigateToListaEntregas = () => {
        navigation.navigate('ListaEntregasScreen');
    };

    return (
        <View style={styles.container}>
            <Header
                title="Minhas Entregas"
                showBack={true}
                onBackPress={handleGoBack}
            />
            <TouchableOpacity onPress={handleNavigateToListaEntregas}>
                <Text>Ver lista de entregas</Text>
            </TouchableOpacity>
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
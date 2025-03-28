import { Text, Image, StyleSheet, View } from "react-native"


export const Home = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/call-center-operator-svgrepo-com.png')} style={styles.image} />
            <Text style={styles.text}>Vendas</Text>
            <Image source={require('../../../assets/icons8-entrega-100.png')} style={styles.image} />
            <Text style={styles.text}>Entregas</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItens: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginLeft: 16,
    },
    image: {
        width: 100,
        height: 100,
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
    }
})

export default Home

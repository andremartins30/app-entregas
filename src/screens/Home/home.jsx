import { Text, Image, StyleSheet, View, TouchableOpacity, Alert } from "react-native"
import icons from "../../constants/icons.js"
import { useNavigation } from "@react-navigation/native"


export const Home = () => {

    const navigation = useNavigation()

    const handleDelivery = () => {
        navigation.navigate("Delivery")
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.card}
                onPress={() => Alert.alert("Tela de Vendas")}>
                <Image source={icons.operator} style={styles.image} />
                <Text style={styles.text}>Vendas</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={handleDelivery}>
                <Image source={icons.delivery} style={styles.image} />
                <Text style={styles.text}>Entregas</Text>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        alignItems: "center",
        marginBottom: 60, // Espaçamento entre as Views
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
    }
})

export default Home

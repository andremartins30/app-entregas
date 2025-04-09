import { Text, Image, StyleSheet, View, TouchableOpacity, Alert, ImageBackground } from "react-native"
import icons from "../../constants/icons.js"
import { useNavigation } from "@react-navigation/native"


export const Home = () => {

    const navigation = useNavigation()

    const handleDelivery = () => {
        navigation.navigate("Delivery")
    }

    return (
        <>
            <ImageBackground
                resizeMode="cover"
                source={require('../../assets/background5.png')}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <Image
                    source={require('../../assets/icons/palusa-fix.png')}
                    resizeMode="cover" // ou 'cover', dependendo do comportamento desejado
                    style={{
                        marginTop: 60,
                        width: 270, // ajuste conforme necessário
                        height: 150, // ajuste conforme necessário
                    }}
                />

                <View style={styles.container}>

                    {/* <TouchableOpacity
                    style={styles.card}
                    onPress={() => Alert.alert("Tela de Vendas")}>
                    <Image source={icons.operator} style={styles.image} />
                    <Text style={styles.text}>Vendas</Text>
                </TouchableOpacity> */}

                    <TouchableOpacity
                        style={styles.card}
                        onPress={handleDelivery}>
                        <Image source={icons.delivery} style={styles.image} />
                        <Text style={styles.text}>Coleta & Entrega</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80, // Espaçamento entre as Views
    },
    card: {
        alignItems: "center",
        marginBottom: 60, // Espaçamento entre as Views
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 30,
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#f0f0f0',
    }
})

export default Home

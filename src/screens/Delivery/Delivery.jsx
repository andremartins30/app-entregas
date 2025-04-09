import { Text, View, StyleSheet, TextInput } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { useState } from "react"
import { styles } from "./Delivery.style";
import MyButton from "../../components/mybutton/mybutton.jsx";

const Delivery = (props) => {

    const [myLocation, setMyLocation] = useState({
        latitude: -15.643448, // Latitude inicial
        longitude: -56.159946, // Longitude inicial
    })

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -15.643448,
                    longitude: -56.159946,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {/* Exemplo de marcador no mapa */}
                <Marker
                    coordinate={{
                        latitude: -15.643448,
                        longitude: -56.159946,
                    }}
                    title="Local de Entrega"
                    description="Descrição do local"
                />
            </MapView>
            <View style={styles.footer}>

                <View style={styles.footerFields}>
                    <Text>Origem</Text>
                    <TextInput style={styles.input} />
                </View>

                <View style={styles.footerFields}>
                    <Text>Destino</Text>
                    <TextInput style={styles.input} />
                </View>

            </View>
            <MyButton text="INICIAR ENTREGA" />
        </View>
    )
};

export default Delivery
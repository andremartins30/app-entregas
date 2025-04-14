import React, { useEffect, useState, useRef } from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions, Text, TouchableOpacity, Linking } from 'react-native'
import MapView, { Marker, Polyline, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { routeService } from '../../services/routeService'
import { entregaService } from '../../services/entregaService'
import { useRoute } from '@react-navigation/native'

const destino = { latitude: -15.5989, longitude: -56.0949 } // Cuiabá

export default function RouteScreen() {
    const navigation = useNavigation()
    const [rota, setRota] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [origem, setOrigem] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [infoRota, setInfoRota] = useState({ distancia: 0, duracao: 0 })
    const [entregaIniciada, setEntregaIniciada] = useState(false)
    const [enderecoOrigem, setEnderecoOrigem] = useState('Carregando...')
    const mapRef = useRef(null)
    const route = useRoute()
    const { entregaId } = route.params;


    useEffect(() => {
        const carregarStatusEntrega = async () => {
            try {
                const entrega = await entregaService.listarEntrega(entregaId); // você precisa implementar ou confirmar esse método
                if (entrega.status === 'EM_TRANSITO') {
                    setEntregaIniciada(true);
                } else {
                    setEntregaIniciada(false);
                }
            } catch (error) {
                console.error("Erro ao carregar status da entrega:", error);
            }
        };

        carregarStatusEntrega();
    }, [entregaId]);


    useEffect(() => {
        console.log("ID da entrega:", entregaId)
    }, [entregaId])


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar localização foi negada')
                setCarregando(false)
                return
            }

            try {
                let location = await Location.getCurrentPositionAsync({})
                const novaOrigem = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
                setOrigem(novaOrigem)
                await obterEndereco(novaOrigem.latitude, novaOrigem.longitude)
            } catch (error) {
                setErrorMsg('Erro ao obter localização')
                setCarregando(false)
            }
        })()
    }, [])

    useEffect(() => {
        if (origem) {
            buscarRota()
        }
    }, [origem])

    useEffect(() => {
        if (rota.length > 0 && mapRef.current) {
            setTimeout(() => {
                const padding = {
                    top: 100,
                    right: 50,
                    bottom: 300,
                    left: 50
                }
                mapRef.current.fitToCoordinates(rota, {
                    edgePadding: padding,
                    animated: true
                })
            }, 1000)
        }
    }, [rota])

    async function buscarRota() {
        try {
            const response = await routeService.calculateRoute(origem, destino);
            setRota(response.coordinates);
            setInfoRota({
                distancia: response.distance,
                duracao: response.duration
            });
        } catch (error) {
            console.error('Erro ao buscar rota:', error);
            setErrorMsg('Erro ao calcular rota');
        } finally {
            setCarregando(false);
        }
    }

    async function obterEndereco(latitude, longitude) {
        try {
            const response = await routeService.getLocationInfo(latitude, longitude);
            setEnderecoOrigem(response.address);
        } catch (error) {
            console.error('Erro ao obter endereço:', error);
            setEnderecoOrigem('Endereço não encontrado');
        }
    }


    const abrirGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origem.latitude},${origem.longitude}&destination=${destino.latitude},${destino.longitude}&travelmode=driving`
        Linking.openURL(url)
    }

    const toggleEntrega = async () => {
        try {
            if (!entregaIniciada) {
                // Muda de "PENDENTE" para "EM_TRANSITO"
                await entregaService.atualizarStatusEntrega(entregaId, "EM_TRANSITO");
            } else {
                // Muda de "EM_TRANSITO" para "CONCLUIDO"
                await entregaService.atualizarStatusEntrega(entregaId, "ENTREGUE");
            }

            setEntregaIniciada(!entregaIniciada);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Não foi possível atualizar o status da entrega.");
        }
    }


    if (carregando) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        )
    }

    if (errorMsg) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: (origem?.latitude + destino.latitude) / 2,
                    longitude: (origem?.longitude + destino.longitude) / 2,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }}
            >
                <Marker coordinate={origem} title="Sua Localização" />
                <Marker coordinate={destino} title="Destino" />
                <Polyline coordinates={rota} strokeWidth={5} strokeColor="#007bff" />
            </MapView>

            <View style={styles.deliveryCard}>
                <View style={styles.locationInfo}>
                    <View style={styles.cardHeader}>
                        <View style={styles.locationItem}>
                            <Text style={styles.locationLabel}>Origem:</Text>
                            <Text style={styles.locationText}>{enderecoOrigem}</Text>
                            <Text style={styles.locationAddress}>
                                {origem ? `${origem.latitude.toFixed(4)}, ${origem.longitude.toFixed(4)}` : 'Carregando...'}
                            </Text>
                        </View>
                        <View style={styles.routeInfo}>
                            <Text style={styles.routeInfoText}>{infoRota.distancia.toFixed(1)} km</Text>
                            <Text style={styles.routeInfoText}>{Math.round(infoRota.duracao)} min</Text>
                        </View>
                    </View>
                    <View style={styles.locationDivider} />
                    <View style={styles.cardHeader}>
                        <View style={styles.locationItem}>
                            <Text style={styles.locationLabel}>Destino:</Text>
                            <Text style={styles.locationText}>Cuiabá</Text>
                            <Text style={styles.locationAddress}>
                                {`${destino.latitude.toFixed(4)}, ${destino.longitude.toFixed(4)}`}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.gpsButton} onPress={abrirGoogleMaps}>
                            <Ionicons name="navigate" size={32} color="#007bff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.startButton,
                        entregaIniciada && styles.finishButton
                    ]}
                    onPress={toggleEntrega}
                >
                    <Text style={styles.startButtonText}>
                        {entregaIniciada ? 'FINALIZAR ENTREGA' : 'INICIAR ENTREGA'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        margin: 20
    },
    deliveryCard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    locationInfo: {
        marginBottom: 15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    locationItem: {
        flex: 1,
        marginRight: 10,
    },
    locationLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    locationAddress: {
        fontSize: 12,
        color: '#666',
    },
    locationDivider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    routeInfo: {
        alignItems: 'flex-end',
        backgroundColor: '#f8f9fa',
        padding: 6,
        borderRadius: 5,
    },
    routeInfoText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    startButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpsButton: {
        padding: 10,
        paddingTop: 15,
        marginRight: 5,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    finishButton: {
        backgroundColor: '#28a745',
    },
})
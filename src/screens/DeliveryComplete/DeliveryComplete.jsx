import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    Switch,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { entregaService } from '../../services/entregaService';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryComplete({ route }) {
    const navigation = useNavigation();
    const { entregaId, origem, destino, distancia, duracao } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState('100,00');
    const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
    const [paymentOnSite, setPaymentOnSite] = useState(false);
    const cameraRef = useRef(null);

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhoto(photo.uri);
            setShowCamera(false);
        }
    };

    const handleTakePhoto = () => {
        setShowCamera(true);
    };

    const handleFinishDelivery = async () => {
        if (!photo) {
            Alert.alert('Atenção', 'Por favor, tire uma foto da entrega antes de finalizar.');
            return;
        }

        try {
            await entregaService.atualizarStatusEntrega(entregaId, "ENTREGUE");

            // lógica para enviar a foto e outras informações
            // await entregaService.enviarComprovante(entregaId, photo, receivedAmount, paymentMethod);

            Alert.alert(
                'Sucesso',
                'Entrega finalizada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Home')
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao finalizar entrega:', error);
            Alert.alert('Erro', 'Não foi possível finalizar a entrega. Tente novamente.');
        }
    };

    if (showCamera) {
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.text}>Tirar Foto</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Finalizar Entrega</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.photoPreview} />
                    ) : (
                        <>
                            <Text style={styles.photoButtonText}>📸</Text>
                            <Text style={styles.photoText}>Tirar foto da entrega</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.paymentToggleContainer}>
                    <Text style={styles.paymentToggleText}>Cliente realizou pagamento no local?</Text>
                    <Switch
                        value={paymentOnSite}
                        onValueChange={setPaymentOnSite}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={paymentOnSite ? '#4169e1' : '#f4f3f4'}
                    />
                </View>

                {paymentOnSite && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.label}>Valor Recebido</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.currencySymbol}>$</Text>
                                <TextInput
                                    style={styles.input}
                                    value={receivedAmount}
                                    onChangeText={setReceivedAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>Forma de Pagamento</Text>
                            <View style={styles.paymentOptions}>
                                <TouchableOpacity
                                    style={[
                                        styles.paymentOption,
                                        paymentMethod === 'Pix' && styles.selectedPayment,
                                    ]}
                                    onPress={() => setPaymentMethod('Pix')}
                                >
                                    <Text style={[
                                        styles.paymentOptionText,
                                        paymentMethod === 'Pix' && styles.selectedPaymentText
                                    ]}>Pix</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.paymentOption,
                                        paymentMethod === 'Dinheiro' && styles.selectedPayment,
                                    ]}
                                    onPress={() => setPaymentMethod('Dinheiro')}
                                >
                                    <Text style={[
                                        styles.paymentOptionText,
                                        paymentMethod === 'Dinheiro' && styles.selectedPaymentText
                                    ]}>Dinheiro</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.paymentOption,
                                        paymentMethod === 'Cartão' && styles.selectedPayment,
                                    ]}
                                    onPress={() => setPaymentMethod('Cartão')}
                                >
                                    <Text style={[
                                        styles.paymentOptionText,
                                        paymentMethod === 'Cartão' && styles.selectedPaymentText
                                    ]}>Cartão</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Resumo da Entrega</Text>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Destino:</Text>
                        <Text style={styles.summaryValue}>{destino}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Distância:</Text>
                        <Text style={styles.summaryValue}>{distancia} km</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Tempo:</Text>
                        <Text style={styles.summaryValue}>{duracao} min</Text>
                    </View>
                </View>

                {/* Espaço extra para garantir que o conteúdo não fique atrás do botão */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.finishButton}
                    onPress={handleFinishDelivery}
                >
                    <Text style={styles.finishButtonText}>FINALIZAR ENTREGA</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerRight: {
        width: 40,
    },
    bottomContainer: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    bottomSpacing: {
        height: 10, // Altura extra para garantir espaço para o botão
    },
    paymentToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    paymentToggleText: {
        fontSize: 16,
        color: '#333',
    },
    photoButton: {
        width: '90%',
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    photoButtonText: {
        fontSize: 32,
        marginBottom: 8,
    },
    photoText: {
        fontSize: 16,
        color: '#666',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 50,
    },
    currencySymbol: {
        fontSize: 18,
        marginRight: 8,
        color: '#333',
    },
    input: {
        flex: 1,
        fontSize: 18,
    },
    paymentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentOption: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    selectedPayment: {
        backgroundColor: '#4169e1',
    },
    paymentOptionText: {
        color: '#333',
    },
    selectedPaymentText: {
        color: '#fff',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    finishButton: {
        backgroundColor: '#28a745',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 'auto',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    finishButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
}); 
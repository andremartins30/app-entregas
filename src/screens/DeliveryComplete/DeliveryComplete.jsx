import React, { useState, useRef, useEffect } from 'react';
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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
// Import the entire module for a fallback approach
import * as ImageManipulator from 'expo-image-manipulator';
import { entregaService } from '../../services/entregaService';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api'; // Importar o serviço de API

export default function DeliveryComplete({ route }) {
    const navigation = useNavigation();
    const { entregaId, origem, destino, distancia, duracao } = route.params;
    const [permission, requestPermission] = useCameraPermissions();
    const [photos, setPhotos] = useState([]); // Alterar para armazenar múltiplas fotos
    const [showCamera, setShowCamera] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState('100,00');
    const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
    const [paymentOnSite, setPaymentOnSite] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (!permission?.granted) {
                const { granted } = await requestPermission();
                if (!granted) {
                    Alert.alert(
                        'Permissão necessária',
                        'É necessário conceder permissão para acessar a câmera.',
                        [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ]
                    );
                }
            }
        })();
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const capturedPhoto = await cameraRef.current.takePictureAsync();
                setPhotos((prevPhotos) => [...prevPhotos, capturedPhoto.uri]); // Adicionar nova foto ao array
                setShowCamera(false);
                Alert.alert('Sucesso', 'Foto tirada com sucesso!');
            } catch (error) {
                console.error('Erro ao tirar foto:', error);
                Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
            }
        }
    };

    const deletePhoto = (index) => {
        Alert.alert(
            'Excluir Foto',
            'Tem certeza de que deseja excluir esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
                    },
                },
            ]
        );
    };

    const handleTakePhoto = () => {
        setShowCamera(true);
    };

    const uploadPhotos = async () => {
        const formData = new FormData();

        console.log('Iniciando upload de fotos...');
        console.log('Número de fotos:', photos.length);
        console.log('ID da entrega:', entregaId);

        for (const [index, photoUri] of photos.entries()) {
            try {
                console.log(`Processando imagem ${index + 1} de ${photos.length}`);
                console.log('URI da imagem original:', photoUri);

                let processedUri = photoUri;

                // Tentativa de compactação da imagem
                try {
                    console.log('Tentando compactar a imagem...');
                    if (ImageManipulator.manipulateAsync) {
                        console.log('Chamando ImageManipulator.manipulateAsync...');
                        const result = await ImageManipulator.manipulateAsync(
                            photoUri,
                            [{ resize: { width: 800 } }],
                            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                        );
                        processedUri = result.uri;
                        console.log('Imagem compactada com sucesso:', processedUri);
                    } else {
                        console.log('ImageManipulator.manipulateAsync não está disponível.');
                    }
                } catch (compressionError) {
                    console.error('Erro ao compactar a imagem:', compressionError);
                    console.log('Usando a imagem original sem compactação.');
                }

                const fileName = `entrega-${entregaId}-${Date.now()}-${index}.jpg`;
                console.log('Nome do arquivo gerado:', fileName);

                formData.append('photos', {
                    uri: processedUri,
                    name: fileName,
                    type: 'image/jpeg',
                });

                console.log('Foto adicionada ao FormData:', fileName);
            } catch (error) {
                console.error('Erro ao processar imagem:', error);
                Alert.alert('Erro', 'Não foi possível processar a imagem.');
                return false;
            }
        }

        try {
            console.log('Adicionando entregaId ao FormData...');
            formData.append('entregaId', entregaId);
            console.log('FormData preparado com sucesso.');

            console.log('Enviando requisição para /entregas/upload...');
            const response = await api.post('/entregas/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // Timeout de 30 segundos para uploads grandes
            });

            console.log('Resposta recebida do servidor:', response.status, response.data);

            if (response.status !== 200) {
                throw new Error(`Erro ao enviar fotos para o servidor: ${response.status}`);
            }

            console.log('Fotos enviadas com sucesso!');
            Alert.alert('Sucesso', 'Fotos enviadas com sucesso!');
            return true; // Indica sucesso
        } catch (error) {
            console.error('Erro ao enviar fotos:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
            Alert.alert('Erro', `Não foi possível enviar as fotos: ${errorMessage}`);
            return false; // Indica falha
        }
    };

    const handleFinishDelivery = async () => {
        if (photos.length === 0) {
            Alert.alert('Atenção', 'Por favor, tire pelo menos uma foto da entrega antes de finalizar.');
            return;
        }

        try {
            console.log('Iniciando processo de finalização de entrega');

            // Enviar fotos para a API
            const uploadSuccess = await uploadPhotos();

            if (!uploadSuccess) {
                console.log('Upload falhou, interrompendo finalização da entrega');
                return; // Stop if upload failed
            }

            console.log('Upload bem-sucedido, atualizando status da entrega');

            // Atualizar o status da entrega para ENTREGUE
            await entregaService.atualizarStatusEntrega(entregaId, "ENTREGUE");

            console.log('Entrega finalizada com sucesso!');

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
        if (!permission) {
            return <View style={styles.container}><Text>Verificando permissões...</Text></View>;
        }
        if (!permission.granted) {
            return <View style={styles.container}><Text>Sem acesso à câmera. Verifique as permissões nas configurações do dispositivo.</Text></View>;
        }
        return (
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    ref={cameraRef}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.text}>Tirar Foto</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
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
                <View style={styles.photoContainer}>
                    {photos.map((photoUri, index) => (
                        <View key={index} style={styles.photoWrapper}>
                            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                            <TouchableOpacity
                                style={styles.deleteIcon}
                                onPress={() => deletePhoto(index)}
                            >
                                <Ionicons name="trash" size={16} color="red" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                    <Text style={styles.photoButtonText}>+</Text>
                    <Text style={styles.photoText}>Adicionar Foto</Text>
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
                                <Text style={styles.currencySymbol}>R$</Text>
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
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    photoWrapper: {
        position: 'relative',
        margin: 5,
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
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    deleteIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 4,
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
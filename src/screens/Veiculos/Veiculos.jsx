import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, TextInput, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { veiculosService } from '../../services/veiculoService'
import { useNavigation } from '@react-navigation/native'
import Header from '../../components/Header/Header'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Swipeable } from 'react-native-gesture-handler'

const Veiculos = () => {
    const [veiculos, setVeiculos] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [veiculoPadrao, setVeiculoPadrao] = useState(null)
    const [novoVeiculo, setNovoVeiculo] = useState({
        modelo: '',
        placa: ''
    })
    const [editingVeiculo, setEditingVeiculo] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {
        loadVeiculos()
        loadVeiculoPadrao()
    }, [])

    const loadVeiculos = async () => {
        try {
            const data = await veiculosService.getUserVeiculos()
            setVeiculos(data)
        } catch (error) {
            console.error('Erro ao carregar veículos:', error)
        }
    }

    const loadVeiculoPadrao = async () => {
        try {
            const veiculoPadraoId = await AsyncStorage.getItem('@veiculo_padrao')
            if (veiculoPadraoId) {
                setVeiculoPadrao(Number(veiculoPadraoId))
            }
        } catch (error) {
            console.error('Erro ao carregar veículo padrão:', error)
        }
    }

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleAddVeiculo = async () => {
        const placa = novoVeiculo.placa.toUpperCase().replace(/[^A-Z0-9]/g, '')

        const isPlacaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)

        if (!isPlacaValida) {
            Alert.alert('Placa inválida', 'Digite uma placa válida no formato ABC1234 ou BRA0A12')
            return
        }

        try {
            await veiculosService.addVeiculo({ ...novoVeiculo, placa })
            setModalVisible(false)
            setNovoVeiculo({ modelo: '', placa: '' })
            loadVeiculos()
        } catch (error) {
            console.error('Erro ao adicionar veículo:', error)
            Alert.alert('Erro', 'Não foi possível adicionar o veículo')
        }
    }

    const handleEditVeiculo = async () => {
        if (!editingVeiculo) return

        const placa = novoVeiculo.placa.toUpperCase().replace(/[^A-Z0-9]/g, '')

        const isPlacaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa)

        if (!isPlacaValida) {
            Alert.alert('Placa inválida', 'Digite uma placa válida no formato ABC1234 ou BRA0A12')
            return
        }

        try {
            await veiculosService.updateVeiculo(editingVeiculo.id, { ...novoVeiculo, placa })
            setModalVisible(false)
            setNovoVeiculo({ modelo: '', placa: '' })
            setEditingVeiculo(null)
            loadVeiculos()
        } catch (error) {
            console.error('Erro ao atualizar veículo:', error)
            Alert.alert('Erro', 'Não foi possível atualizar o veículo')
        }
    }

    const handleDeleteVeiculo = (veiculo) => {
        Alert.alert(
            'Confirmar exclusão',
            `Deseja realmente excluir o veículo ${veiculo.modelo}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await veiculosService.deleteVeiculo(veiculo.id)
                            loadVeiculos()
                        } catch (error) {
                            console.error('Erro ao excluir veículo:', error)
                            Alert.alert('Erro', 'Não foi possível excluir o veículo')
                        }
                    }
                }
            ]
        )
    }

    const openEditModal = (veiculo) => {
        setEditingVeiculo(veiculo)
        setNovoVeiculo({
            modelo: veiculo.modelo,
            placa: veiculo.placa
        })
        setModalVisible(true)
    }

    const handleSetVeiculoPadrao = async (veiculoId) => {
        try {
            await AsyncStorage.setItem('@veiculo_padrao', veiculoId.toString())
            setVeiculoPadrao(veiculoId)
            Alert.alert('Sucesso', 'Veículo padrão definido com sucesso!')
        } catch (error) {
            console.error('Erro ao definir veículo padrão:', error)
            Alert.alert('Erro', 'Não foi possível definir o veículo padrão')
        }
    }

    const renderRightActions = (veiculo) => (
        <View style={styles.rightActions}>
            <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => openEditModal(veiculo)}
            >
                <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteVeiculo(veiculo)}
            >
                <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
        </View>
    )

    const renderItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item)}
            rightThreshold={40}
        >
            <View style={styles.veiculoItem}>
                <View style={styles.veiculoInfo}>
                    <Text style={styles.modelo}>{item.modelo}</Text>
                    <Text style={styles.placa}>Placa: {item.placa}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.defaultButton,
                        veiculoPadrao === item.id && styles.defaultButtonActive
                    ]}
                    onPress={() => handleSetVeiculoPadrao(item.id)}
                >
                    <Text style={[
                        styles.defaultButtonText,
                        veiculoPadrao === item.id && styles.defaultButtonTextActive
                    ]}>
                        {veiculoPadrao === item.id ? 'Padrão' : 'Definir como Padrão'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Swipeable>
    )

    return (
        <View style={styles.container}>
            <Header
                title="Meus Veículos"
                showBack={true}
                onBackPress={handleGoBack}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.addButton}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                }
            />
            <FlatList
                data={veiculos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false)
                    setEditingVeiculo(null)
                    setNovoVeiculo({ modelo: '', placa: '' })
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingVeiculo ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Placa do veículo"
                            value={novoVeiculo.placa}
                            onChangeText={(text) => setNovoVeiculo({ ...novoVeiculo, placa: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Modelo do veículo"
                            value={novoVeiculo.modelo}
                            onChangeText={(text) => setNovoVeiculo({ ...novoVeiculo, modelo: text })}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false)
                                    setEditingVeiculo(null)
                                    setNovoVeiculo({ modelo: '', placa: '' })
                                }}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={editingVeiculo ? handleEditVeiculo : handleAddVeiculo}
                            >
                                <Text style={styles.buttonText}>
                                    {editingVeiculo ? 'Atualizar' : 'Salvar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6'
    },
    veiculoInfo: {
        flex: 1,
    },
    modelo: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4
    },
    placa: {
        fontSize: 16,
        color: '#6c757d'
    },

    addButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    addButtonText: {
        color: '#000',
        fontSize: 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    defaultButton: {
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    defaultButtonActive: {
        backgroundColor: '#007AFF',
    },
    defaultButtonText: {
        color: '#007AFF',
    },
    defaultButtonTextActive: {
        color: '#fff',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },
    editButton: {
        backgroundColor: '#ffc107',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
})

export default Veiculos
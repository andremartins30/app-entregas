import { useState } from 'react';
import { entregaService } from '../services/entregaService';
import { Alert } from 'react-native';

export function useEntrega() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const criarEntrega = async (destino: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await entregaService.criarEntrega(destino);
            Alert.alert('Sucesso', 'Entrega criada com sucesso!');
            return response;
        } catch (error: any) {
            setError(error.response?.data?.error || 'Erro ao criar entrega');
            Alert.alert('Erro', error.response?.data?.error || 'Erro ao criar entrega');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listarEntregas = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await entregaService.listarEntregas();
            return response;
        } catch (error: any) {
            setError(error.response?.data?.error || 'Erro ao listar entregas');
            Alert.alert('Erro', error.response?.data?.error || 'Erro ao listar entregas');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listarEntregasDoEntregador = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await entregaService.listarEntregasDoEntregador();
            return response;
        } catch (error: any) {
            setError(error.response?.data?.error || 'Erro ao listar entregas do entregador');
            Alert.alert('Erro', error.response?.data?.error || 'Erro ao listar entregas do entregador');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        criarEntrega,
        listarEntregas,
        listarEntregasDoEntregador,
        loading,
        error
    };
} 
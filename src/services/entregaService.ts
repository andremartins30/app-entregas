import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EntregaData {
    destino: string;
}

export const entregaService = {
    async criarEntrega(destino: string) {
        try {
            const token = await AsyncStorage.getItem('@app:token');

            const response = await api.post('/entregas/delivery',
                { destino },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async listarEntregas() {
        try {
            const token = await AsyncStorage.getItem('@app:token');

            const response = await api.get('/entregas/delivery', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 
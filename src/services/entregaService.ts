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
    },

    async listarEntrega(id: number) {
        try {
            const token = await AsyncStorage.getItem('@app:token');

            const response = await api.get(`/entregas/delivery/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async atualizarStatusEntrega(id: number, status: string) {
        try {
            const token = await AsyncStorage.getItem('@app:token');

            const response = await api.put(`/entregas/delivery/status/${id}`, { status }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async listarEntregasDoEntregador() {
        try {
            const token = await AsyncStorage.getItem('@app:token');

            const response = await api.get('/entregas/delivery/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async countEntregasDoEntregador() {
        const token = await AsyncStorage.getItem('@app:token');
        const { data } = await api.get<{ count: number }>('/entregas/delivery/me/count', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return data.count;
    }
}; 
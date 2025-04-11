import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://10.120.0.14:3333',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@app:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
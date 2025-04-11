import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthService = {
    async login(email, password) {
        try {
            const response = await api.post('/usuarios/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            // Salva o token e usuário
            await this.saveUserData(token, user);

            return { token, user };
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/usuarios/logout');
            await this.clearUserData();
        } catch (error) {
            // Mesmo com erro, limpa os dados locais
            await this.clearUserData();
            throw error;
        }
    },

    async saveUserData(token, user) {
        await AsyncStorage.setItem('@app:token', token);
        await AsyncStorage.setItem('@app:user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    async clearUserData() {
        await AsyncStorage.removeItem('@app:token');
        await AsyncStorage.removeItem('@app:user');
        api.defaults.headers.common['Authorization'] = '';
    },

    async getStoredUser() {
        const user = await AsyncStorage.getItem('@app:user');
        return user ? JSON.parse(user) : null;
    },

    async getStoredToken() {
        return await AsyncStorage.getItem('@app:token');
    },

    async isAuthenticated() {
        const token = await this.getStoredToken();
        return !!token;
    }
};

export default AuthService; 
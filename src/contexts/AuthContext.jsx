import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    async function signIn(email, password) {
        try {
            setLoading(true);
            console.log('Tentando fazer login com:', { email, password });
            console.log('URL da API:', api.defaults.baseURL);

            const response = await api.post('/usuarios/login', {
                email,
                password,
            });

            console.log('Resposta do servidor:', response.data);

            const { token, user: userData } = response.data;

            // Configura o token nas requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Salva os dados no AsyncStorage
            await AsyncStorage.setItem('@app:token', token);
            await AsyncStorage.setItem('@app:user', JSON.stringify(userData));

            setUser(userData);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        await AsyncStorage.removeItem('@app:token');
        await AsyncStorage.removeItem('@app:user');
        setUser(null);
        api.defaults.headers.common['Authorization'] = '';
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
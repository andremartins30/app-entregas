import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    async function loadStoredUser() {
        try {
            const storedUser = await AuthService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    }

    async function signIn(email, password) {
        try {
            setLoading(true);
            const { user } = await AuthService.login(email, password);
            setUser(user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function signOut() {
        try {
            setLoading(true);
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    async function register(nome, email, password) {
        try {
            setLoading(true);
            await AuthService.register(nome, email, password);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            signIn,
            signOut,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
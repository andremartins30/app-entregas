import React, { useState } from "react";
import { Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { styles } from "./styles";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();
    const { signIn, loading } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        try {
            await signIn(email, password);
            navigation.navigate("Home");
        } catch (error) {
            Alert.alert(
                "Erro na autenticação",
                error.response?.data?.message || "Erro ao fazer login"
            );
        }
    };

    React.useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/icons/palusa-fix.png')}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Login</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Senha"
                            secureTextEntry={!passwordVisible}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setPasswordVisible(!passwordVisible)}>
                            <Ionicons
                                name={passwordVisible ? "eye-off" : "eye"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
import React, { useState } from "react"
import { Text, TextInput, StyleSheet, View, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const Login = () => {

    const [passwordVisible, setPasswordVisible] = useState(false)
    const navigation = useNavigation()

    const handleLogin = () => {
        navigation.navigate("Home")
    };

    return (
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
                />

                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Senha"
                        secureTextEntry={!passwordVisible}
                        keyboardType="default"
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
                    onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    image: {
        width: 270,
        height: 150,
    },
    formContainer: {
        width: 370,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 15,
        borderRadius: 5,
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 10,
        height: 50,
    },
    passwordInput: {
        flex: 1,
        fontSize: 18,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        alignSelf: 'flex-start',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
        height: 50,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
})

export default Login
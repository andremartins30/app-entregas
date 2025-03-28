import { Text, TextInput, StyleSheet, View, Alert, TouchableOpacity } from "react-native"
import { useState } from "react"
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
            <Text style={styles.label}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address" />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItens: 'center',
        backgroundColor: '#fff',
        marginLeft: 10,
    },

    input: {
        width: 370,
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
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 10,
        height: 50,
        width: 370,
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
        width: 370,
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
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 30,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 10,
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
        borderRadius: 15,
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
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
        borderRadius: 15,
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
    },
    termsText: {
        marginLeft: 10,
        fontSize: 16,
        flex: 1,
    },
    loginButton: {
        fontSize: 18,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#e4e5f5',
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
}); 
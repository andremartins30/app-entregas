import { View, Image, StyleSheet, Text } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import { useEffect } from 'react'

const Welcome = () => {
    const navigation = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate("Login")
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/icons/palusa-fix.png')}
                resizeMode="cover"
                style={{
                    marginTop: 60,
                    width: 270,
                    height: 150,
                }}
            />
            <View style={styles.inner}>
                <Text style={styles.text}>Coleta & Entrega</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e4e5f5', // Light gray
        justifyContent: 'center',
        alignItems: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
})

export default Welcome
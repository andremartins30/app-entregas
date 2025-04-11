import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const Header = ({ title, showMenu, onMenuPress, showBack, onBackPress, showRefresh, onRefreshPress }) => {
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {showBack && (
                    <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
                        <Ionicons name="menu" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.rightContainer}>
                {showRefresh && (
                    <TouchableOpacity onPress={onRefreshPress} style={styles.iconButton}>
                        <Ionicons name="refresh" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: theme.colors.background,
        elevation: 3,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
});

export default Header;
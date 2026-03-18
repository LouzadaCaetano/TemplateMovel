import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    // Base visual do botao.
    container: {
        backgroundColor: '#2c46b1',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    // Texto exibido dentro do botao.
    title: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});

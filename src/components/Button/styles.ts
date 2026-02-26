import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2c46b1',
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',          // icone + texto lado a lado
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        // largura flexível, usuário pode passar width via style prop
    },
    title: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
}); 
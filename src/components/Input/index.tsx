import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

export function Input({ ...rest }: TextInputProps) {
    return (
        // Campo de texto reutilizavel.
        <TextInput style={styles.container} {...rest} />
    );
}   

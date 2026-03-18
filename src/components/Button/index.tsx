import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { styles } from "./styles";

// Props aceitas pelo botao.
type Props = TouchableOpacityProps & {
    title?: string;
    icon?: React.ReactNode;
}

export function Button({ title, icon, ...rest }: Props) {
    // Botao reutilizavel com texto ou icone.
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            {icon}
            {title ? <Text style={styles.title}>{title}</Text> : null}
        </TouchableOpacity>
    );
}

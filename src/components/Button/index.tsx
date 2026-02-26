import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { styles } from "./styles";

type Props = TouchableOpacityProps & {
    title?: string;    
    icon?: React.ReactNode; // ícone opcional exibido antes do texto
}

export function Button({ title, icon, ...rest }: Props) {
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            {icon}
            {title ? <Text style={styles.title}>{title}</Text> : null}
        </TouchableOpacity>
    );
}
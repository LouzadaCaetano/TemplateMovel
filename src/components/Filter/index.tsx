import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { CircleCheck } from 'lucide-react-native';

import { styles } from "./styles";
import { FilterStatus } from "@/types/FilterStatus";
import { StatusIcon } from "../StatusIcon";


type Props = TouchableOpacityProps & {
    status: FileterStatus;
    isActive: boolean;
}

export function Filter({ status, isActive, ...rest }: Props) {
    return (
        <TouchableOpacity 
        style={[styles.container, {opacity: isActive ? 1 : 0.5}]}
         {...rest}>
            <StatusIcon status={status} />
            <Text style={styles.title}>{status === FileterStatus.PENDING ? "Pendentes" : "Comprados"}</Text>
        </TouchableOpacity>
    );
}   
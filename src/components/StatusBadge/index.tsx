import { Text, View } from 'react-native';
import { StatusOrcamento } from '@/types/StatusOrcamento';
import { styles } from './styles';

interface Props {
  status: StatusOrcamento;
}

export function StatusBadge({ status }: Props) {
  return (
    <View style={[styles.container, styles[status]]}>
      <Text style={[styles.label, styles[`${status}Text`]]}>{status}</Text>
    </View>
  );
}

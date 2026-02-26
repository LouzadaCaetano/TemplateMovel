import { TouchableOpacity, Text, View } from 'react-native';
import { styles, statusStyles } from './styles';
import { Orcamento } from '@/types/ModeloOrcamento';
import { StatusOrcamento } from '@/types/StatusOrcamento';  

interface Props {
  orcamento: Orcamento;
  onPress?: () => void;
}

export function BudgetCard({ orcamento, onPress }: Props) {
  const total = orcamento.itens
    .reduce((s, i) => s + i.quantidade * i.precoUnitario, 0)
    .toFixed(2);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.title}>{orcamento.titulo}</Text>
        <Text style={[styles.status, statusStyles[orcamento.status]]}>
          {orcamento.status}
        </Text>
      </View>
      <Text style={styles.company}>{orcamento.cliente}</Text>
      <Text style={styles.value}>R$ {total.replace('.', ',')}</Text>
    </TouchableOpacity>
  );
}

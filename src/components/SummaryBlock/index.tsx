import { Text, View } from 'react-native';
import { formatCurrency } from '@/utils/orcamentos';
import { styles } from './styles';

interface Props {
  subtotal: number;
  desconto: number;
  total: number;
  title?: string;
}

export function SummaryBlock({
  subtotal,
  desconto,
  total,
  title = 'Resumo financeiro',
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Desconto calculado</Text>
          <Text style={styles.value}>{formatCurrency(desconto)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total final</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  );
}

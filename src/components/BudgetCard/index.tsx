import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StatusBadge } from '@/components/StatusBadge';
import { Orcamento } from '@/types/ModeloOrcamento';
import { formatCurrency, calculateTotal } from '@/utils/orcamentos';
import { styles } from './styles';

// Dados esperados pelo card.
interface Props {
  orcamento: Orcamento;
  onPress?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
}

export function BudgetCard({
  orcamento,
  onPress,
  onEdit,
  onDuplicate,
}: Props) {
  // Soma o valor total dos itens do orcamento.
  const total = calculateTotal(orcamento.itens, orcamento.percentualDesconto);

  // Card com acoes do orcamento.
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{orcamento.titulo}</Text>
          <Text style={styles.company}>{orcamento.cliente}</Text>
        </View>
        <StatusBadge status={orcamento.status} />
      </View>

      <View style={styles.valueRow}>
        <View>
          <Text style={styles.valueLabel}>Valor total</Text>
          <Text style={styles.value}>{formatCurrency(total)}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#8a94aa" />
      </View>

      <View style={styles.secondaryActionsRow}>
        <Pressable
          style={styles.secondaryActionButton}
          onPress={(event) => {
            event.stopPropagation();
            onEdit?.();
          }}
        >
          <Feather name="edit-2" size={14} color="#2c46b1" />
          <Text style={styles.secondaryActionText}>Editar</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryActionButton}
          onPress={(event) => {
            event.stopPropagation();
            onDuplicate?.();
          }}
        >
          <Feather name="copy" size={14} color="#2c46b1" />
          <Text style={styles.secondaryActionText}>Duplicar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

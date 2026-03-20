import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, statusStyles } from './styles';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_TRANSITIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';

const STATUS_ACTION_LABELS: Record<StatusOrcamento, string> = {
  Rascunho: 'Rascunho',
  Enviado: 'Enviar',
  Aprovado: 'Aprovar',
  Recusado: 'Recusar',
};

// Dados esperados pelo card.
interface Props {
  orcamento: Orcamento;
  onPress?: () => void;
  onRemove?: () => void;
  onUpdateStatus?: (newStatus: StatusOrcamento) => void;
}

export function BudgetCard({
  orcamento,
  onPress,
  onRemove,
  onUpdateStatus,
}: Props) {
  // Soma o valor total dos itens do orcamento.
  const total = orcamento.itens
    .reduce((s, i) => s + i.quantidade * i.precoUnitario, 0)
    .toFixed(2);
  const availableStatusActions = STATUS_TRANSITIONS[orcamento.status];

  // Card clicavel de um orcamento.
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={18} color="#b70101" />
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.title}>{orcamento.titulo}</Text>
        <Text style={[styles.status, statusStyles[orcamento.status]]}>
          {orcamento.status}
        </Text>
      </View>
      <Text style={styles.company}>{orcamento.cliente}</Text>
      <Text style={styles.value}>R$ {total.replace('.', ',')}</Text>

      {availableStatusActions.length ? (
        <View style={styles.actionsRow}>
          {availableStatusActions.map((nextStatus) => (
            <TouchableOpacity
              key={nextStatus}
              style={[
                styles.statusActionButton,
                nextStatus === 'Enviado' && styles.sendButton,
                nextStatus === 'Aprovado' && styles.approveButton,
                nextStatus === 'Recusado' && styles.rejectButton,
              ]}
              onPress={() => onUpdateStatus?.(nextStatus)}
              activeOpacity={0.8}
            >
              <Text style={styles.statusActionText}>
                {STATUS_ACTION_LABELS[nextStatus]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

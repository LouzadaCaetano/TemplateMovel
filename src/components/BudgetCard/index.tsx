import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StatusBadge } from '@/components/StatusBadge';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_TRANSITIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';
import { formatCurrency, calculateTotal } from '@/utils/orcamentos';
import { styles } from './styles';

const STATUS_ACTION_LABELS: Record<StatusOrcamento, string> = {
  Rascunho: 'Voltar a rascunho',
  Enviado: 'Enviar',
  Aprovado: 'Aprovar',
  Recusado: 'Recusar',
};

// Dados esperados pelo card.
interface Props {
  orcamento: Orcamento;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onUpdateStatus?: (newStatus: StatusOrcamento) => void;
}

export function BudgetCard({
  orcamento,
  onEdit,
  onDuplicate,
  onRemove,
  onUpdateStatus,
}: Props) {
  // Soma o valor total dos itens do orcamento.
  const total = calculateTotal(orcamento.itens, orcamento.percentualDesconto);
  const availableStatusActions = STATUS_TRANSITIONS[orcamento.status];

  // Card com acoes do orcamento.
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={18} color="#b70101" />
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.title}>{orcamento.titulo}</Text>
        <StatusBadge status={orcamento.status} />
      </View>
      <Text style={styles.company}>{orcamento.cliente}</Text>
      <Text style={styles.value}>{formatCurrency(total)}</Text>

      <View style={styles.secondaryActionsRow}>
        <TouchableOpacity
          style={styles.secondaryActionButton}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={14} color="#2c46b1" />
          <Text style={styles.secondaryActionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryActionButton}
          onPress={onDuplicate}
          activeOpacity={0.8}
        >
          <Feather name="copy" size={14} color="#2c46b1" />
          <Text style={styles.secondaryActionText}>Duplicar</Text>
        </TouchableOpacity>
      </View>

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
    </View>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { StatusBadge } from '@/components/StatusBadge';
import { SummaryBlock } from '@/components/SummaryBlock';
import {
  add as addOrcamento,
  getById,
  getAll,
  remove,
  updateStatus,
} from '@/storage/orcamentos';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_TRANSITIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';
import {
  calculateDiscountValue,
  calculateSubtotal,
  calculateTotal,
  duplicateOrcamento,
  formatCurrency,
} from '@/utils/orcamentos';
import { styles } from './styles';

interface Props {
  orcamentoId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function BudgetDetails({
  orcamentoId,
  onBack,
  onEdit,
  onRefresh,
}: Props) {
  const [orcamento, setOrcamento] = useState<Orcamento | null>(null);
  const [allOrcamentos, setAllOrcamentos] = useState<Orcamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<StatusOrcamento | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [selectedOrcamento, orcamentos] = await Promise.all([
          getById(orcamentoId),
          getAll(),
        ]);

        if (!selectedOrcamento) {
          Alert.alert(
            'Orçamento não encontrado',
            'Não foi possível carregar este orçamento.'
          );
          onBack();
          return;
        }

        setOrcamento(selectedOrcamento);
        setAllOrcamentos(orcamentos);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        Alert.alert(
          'Erro ao carregar',
          'Não foi possível abrir os detalhes do orçamento.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [onBack, orcamentoId]);

  const financialData = useMemo(() => {
    if (!orcamento) {
      return {
        subtotal: 0,
        desconto: 0,
        total: 0,
      };
    }

    const subtotal = calculateSubtotal(orcamento.itens);
    const desconto = calculateDiscountValue(
      subtotal,
      orcamento.percentualDesconto
    );
    const total = calculateTotal(orcamento.itens, orcamento.percentualDesconto);

    return {
      subtotal,
      desconto,
      total,
    };
  }, [orcamento]);

  const handleDuplicate = async () => {
    if (!orcamento) {
      return;
    }

    try {
      const existingOrcamentoIds = new Set(allOrcamentos.map((item) => item.id));
      const existingItemIds = new Set(
        allOrcamentos.flatMap((item) => item.itens.map((servico) => servico.id))
      );
      const clone = duplicateOrcamento(
        orcamento,
        existingOrcamentoIds,
        existingItemIds
      );

      await addOrcamento(clone, allOrcamentos);
      Alert.alert(
        'Orçamento duplicado',
        'Uma cópia foi criada com status Rascunho.'
      );
      onRefresh();
    } catch (error) {
      console.error('Erro ao duplicar nos detalhes:', error);
      Alert.alert(
        'Erro ao duplicar',
        'Não foi possível duplicar o orçamento.'
      );
    }
  };

  const handleDelete = async () => {
    if (!orcamento) {
      return;
    }

    try {
      await remove(orcamento.id, allOrcamentos);
      Alert.alert(
        'Orçamento excluído',
        'O orçamento foi removido com sucesso.'
      );
      onRefresh();
      onBack();
    } catch (error) {
      console.error('Erro ao excluir nos detalhes:', error);
      Alert.alert(
        'Erro ao excluir',
        'Não foi possível remover o orçamento.'
      );
    }
  };

  const handleShare = async () => {
    if (!orcamento) {
      return;
    }

    const summary = [
      `Orçamento: ${orcamento.titulo}`,
      `Cliente: ${orcamento.cliente}`,
      `Status: ${orcamento.status}`,
      `Total: ${formatCurrency(financialData.total)}`,
    ].join('\n');

    try {
      await Share.share({
        message: summary,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      Alert.alert(
        'Compartilhamento indisponível',
        'Não foi possível compartilhar o orçamento neste momento.'
      );
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!orcamento || !pendingStatus) {
      return;
    }

    try {
      const updatedOrcamentos = await updateStatus(
        orcamento.id,
        pendingStatus,
        allOrcamentos
      );
      const updatedOrcamento =
        updatedOrcamentos.find((item) => item.id === orcamento.id) ?? null;

      if (updatedOrcamento) {
        setOrcamento(updatedOrcamento);
      }

      setAllOrcamentos(updatedOrcamentos);
      Alert.alert(
        'Status atualizado',
        `O orçamento agora está como ${pendingStatus}.`
      );
    } catch (error) {
      console.error('Erro ao atualizar status nos detalhes:', error);
      Alert.alert(
        'Erro ao atualizar',
        'Não foi possível atualizar o status do orçamento.'
      );
    } finally {
      setPendingStatus(null);
      onRefresh();
    }
  };

  if (isLoading || !orcamento) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <Feather name="arrow-left" size={20} color="#1d2747" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalhes do orçamento</Text>
            <Text style={styles.subtitle}>
              Visualize as informações principais e acione as próximas etapas.
            </Text>
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={() => void handleShare()}>
            <Feather name="share-2" size={18} color="#1d2747" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>{orcamento.titulo}</Text>
              <Text style={styles.heroClient}>{orcamento.cliente}</Text>
            </View>
            <StatusBadge status={orcamento.status} />
          </View>

          <Text style={styles.heroValue}>{formatCurrency(financialData.total)}</Text>

          <View style={styles.heroMetaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Criado em</Text>
              <Text style={styles.metaValue}>{formatDate(orcamento.dataCriacao)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Atualizado em</Text>
              <Text style={styles.metaValue}>
                {formatDate(orcamento.dataAtualizacao)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Serviços</Text>
              <Text style={styles.metaValue}>{orcamento.itens.length}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Desconto</Text>
              <Text style={styles.metaValue}>
                {`${orcamento.percentualDesconto ?? 0}%`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status e progresso</Text>
          <View style={styles.statusHeader}>
            <StatusBadge status={orcamento.status} />
            <Text style={styles.statusHint}>
              {STATUS_TRANSITIONS[orcamento.status].length
                ? 'Escolha a próxima etapa do orçamento.'
                : 'Este status não possui transições disponíveis.'}
            </Text>
          </View>

          {STATUS_TRANSITIONS[orcamento.status].length ? (
            <View style={styles.statusActions}>
              {STATUS_TRANSITIONS[orcamento.status].map((nextStatus) => (
                <TouchableOpacity
                  key={nextStatus}
                  style={[
                    styles.statusAction,
                    nextStatus === 'Enviado' && styles.statusActionBlue,
                    nextStatus === 'Aprovado' && styles.statusActionGreen,
                    nextStatus === 'Recusado' && styles.statusActionRed,
                  ]}
                  onPress={() => setPendingStatus(nextStatus)}
                >
                  <Text style={styles.statusActionText}>{nextStatus}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços incluídos</Text>
          <View style={styles.servicesList}>
            {orcamento.itens.map((item) => (
              <View key={item.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{item.descricao}</Text>
                  <Text style={styles.serviceValue}>
                    {formatCurrency(item.quantidade * item.precoUnitario)}
                  </Text>
                </View>
                <Text style={styles.serviceMeta}>
                  {`${item.quantidade} x ${formatCurrency(item.precoUnitario)}`}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SummaryBlock
            subtotal={financialData.subtotal}
            desconto={financialData.desconto}
            total={financialData.total}
            title="Investimento"
          />
        </View>

        <View style={styles.footerActions}>
          <Button
            title="Excluir"
            variant="danger"
            onPress={() => setShowDeleteConfirmation(true)}
            style={styles.footerButton}
          />
          <Button
            title="Duplicar"
            variant="secondary"
            onPress={() => void handleDuplicate()}
            style={styles.footerButton}
          />
        </View>

        <Button
          title="Editar orçamento"
          onPress={() => onEdit(orcamento.id)}
          fullWidth
        />
      </ScrollView>

      <ConfirmationModal
        visible={showDeleteConfirmation}
        title="Excluir orçamento"
        message="Tem certeza que deseja excluir este orçamento?"
        confirmLabel="Excluir"
        destructive
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={() => {
          setShowDeleteConfirmation(false);
          void handleDelete();
        }}
      />

      <ConfirmationModal
        visible={Boolean(pendingStatus)}
        title="Alterar status"
        message={
          pendingStatus
            ? `Deseja realmente mudar o orçamento para ${pendingStatus}?`
            : ''
        }
        confirmLabel="Confirmar"
        onCancel={() => setPendingStatus(null)}
        onConfirm={() => {
          void handleConfirmStatusChange();
        }}
      />
    </SafeAreaView>
  );
}

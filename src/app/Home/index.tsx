import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { BudgetCard } from '@/components/BudgetCard';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Input } from '@/components/Input';
import {
  ORDENACAO_OPTIONS,
  OrdenacaoOrcamento,
  STATUS_FILTRO_OPTIONS,
  StatusFiltroOrcamento,
} from '@/types/OrcamentoFiltro';
import { Orcamento } from '@/types/ModeloOrcamento';
import { StatusOrcamento } from '@/types/StatusOrcamento';
import {
  add as addOrcamento,
  clear as clearOrcamentos,
  getAll,
  remove as removeOrcamento,
  updateStatus as updateOrcamentoStatus,
} from '@/storage/orcamentos';
import {
  applyOrcamentoFilters,
  duplicateOrcamento,
} from '@/utils/orcamentos';
import { styles } from './styles';

interface Props {
  reloadSignal?: number;
  onCreate: () => void;
  onEdit: (orcamentoId: string) => void;
}

type ConfirmationState = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

const DEFAULT_CONFIRMATION: ConfirmationState = {
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  destructive: false,
  onConfirm: () => undefined,
};

export default function Home({
  reloadSignal = 0,
  onCreate,
  onEdit,
}: Props) {
  const [todosOrcamentos, setTodosOrcamentos] = useState<Orcamento[]>([]);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] =
    useState<StatusFiltroOrcamento>('Todos');
  const [ordenacao, setOrdenacao] =
    useState<OrdenacaoOrcamento>('maisRecentes');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmation, setConfirmation] =
    useState<ConfirmationState>(DEFAULT_CONFIRMATION);

  const loadOrcamentos = async () => {
    try {
      const storedOrcamentos = await getAll();
      setTodosOrcamentos(storedOrcamentos);
    } catch (error) {
      console.error('Erro ao carregar orcamentos:', error);
      Alert.alert(
        'Erro ao carregar',
        'Nao foi possivel carregar os orcamentos salvos.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrcamentos();
  }, [reloadSignal]);

  const orcamentosVisiveis = useMemo(
    () =>
      applyOrcamentoFilters(todosOrcamentos, {
        busca,
        status: statusFiltro,
        ordenacao,
      }),
    [busca, ordenacao, statusFiltro, todosOrcamentos]
  );

  const closeConfirmation = () => setConfirmation(DEFAULT_CONFIRMATION);

  const openConfirmation = (config: Omit<ConfirmationState, 'visible'>) => {
    setConfirmation({
      ...config,
      visible: true,
    });
  };

  const handleRemove = (id: string) => {
    openConfirmation({
      title: 'Excluir orcamento',
      message: 'Tem certeza que deseja excluir este orcamento?',
      confirmLabel: 'Excluir',
      destructive: true,
      onConfirm: () => {
        void (async () => {
          try {
            const updatedOrcamentos = await removeOrcamento(id, todosOrcamentos);
            setTodosOrcamentos(updatedOrcamentos);
            Alert.alert(
              'Orcamento excluido',
              'O orcamento foi removido com sucesso.'
            );
          } catch (error) {
            console.error('Erro ao excluir orcamento:', error);
            Alert.alert(
              'Erro ao excluir',
              'Nao foi possivel remover o orcamento.'
            );
          }
        })();
      },
    });
  };

  const handleDuplicate = async (id: string) => {
    const selectedOrcamento = todosOrcamentos.find((item) => item.id === id);

    if (!selectedOrcamento) {
      Alert.alert(
        'Orcamento nao encontrado',
        'Nao foi possivel duplicar este orcamento.'
      );
      return;
    }

    try {
      const existingOrcamentoIds = new Set(todosOrcamentos.map((item) => item.id));
      const existingItemIds = new Set(
        todosOrcamentos.flatMap((orcamento) => orcamento.itens.map((item) => item.id))
      );
      const clonedOrcamento = duplicateOrcamento(
        selectedOrcamento,
        existingOrcamentoIds,
        existingItemIds
      );
      const updatedOrcamentos = await addOrcamento(clonedOrcamento, todosOrcamentos);

      setTodosOrcamentos(updatedOrcamentos);
      Alert.alert(
        'Orcamento duplicado',
        'Uma copia foi criada com status Rascunho.'
      );
    } catch (error) {
      console.error('Erro ao duplicar orcamento:', error);
      Alert.alert(
        'Erro ao duplicar',
        'Nao foi possivel duplicar o orcamento.'
      );
    }
  };

  const handleUpdateStatus = (id: string, newStatus: StatusOrcamento) => {
    openConfirmation({
      title: 'Alterar status',
      message: `Deseja realmente mudar o orcamento para ${newStatus}?`,
      confirmLabel: 'Confirmar',
      onConfirm: () => {
        void (async () => {
          try {
            const updatedOrcamentos = await updateOrcamentoStatus(
              id,
              newStatus,
              todosOrcamentos
            );

            setTodosOrcamentos(updatedOrcamentos);
            Alert.alert(
              'Status atualizado',
              `O orcamento agora esta como ${newStatus}.`
            );
          } catch (error) {
            console.error('Erro ao atualizar status do orcamento:', error);
            Alert.alert(
              'Erro ao atualizar',
              'Nao foi possivel atualizar o status do orcamento.'
            );
          }
        })();
      },
    });
  };

  const handleClear = () => {
    if (!todosOrcamentos.length) {
      Alert.alert('Lista vazia', 'Nao ha orcamentos para remover.');
      return;
    }

    openConfirmation({
      title: 'Limpar lista',
      message: 'Tem certeza que deseja remover todos os orcamentos?',
      confirmLabel: 'Limpar',
      destructive: true,
      onConfirm: () => {
        void (async () => {
          try {
            await clearOrcamentos();
            setTodosOrcamentos([]);
            Alert.alert(
              'Lista limpa',
              'Todos os orcamentos foram removidos.'
            );
          } catch (error) {
            console.error('Erro ao limpar orcamentos:', error);
            Alert.alert(
              'Erro ao limpar',
              'Nao foi possivel limpar a lista de orcamentos.'
            );
          }
        })();
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Orcamentos</Text>
          <Text style={styles.subtitle}>
            Liste, filtre, duplique e edite seus orcamentos.
          </Text>
        </View>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearAction}>Limpar lista</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toolbar}>
        <Button title="Novo orcamento" onPress={onCreate} fullWidth />
      </View>

      <View style={styles.filtersSection}>
        <Input
          placeholder="Buscar por titulo ou cliente"
          value={busca}
          onChangeText={setBusca}
        />

        <Text style={styles.filterLabel}>Status</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsList}
        >
          {STATUS_FILTRO_OPTIONS.map((status) => {
            const isSelected = status === statusFiltro;

            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonSelected,
                ]}
                onPress={() => setStatusFiltro(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    isSelected && styles.filterButtonTextSelected,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.filterLabel}>Ordenacao</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsList}
        >
          {ORDENACAO_OPTIONS.map((option) => {
            const isSelected = option.value === ordenacao;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonSelected,
                ]}
                onPress={() => setOrdenacao(option.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    isSelected && styles.filterButtonTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={orcamentosVisiveis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BudgetCard
            orcamento={item}
            onEdit={() => onEdit(item.id)}
            onDuplicate={() => void handleDuplicate(item.id)}
            onRemove={() => handleRemove(item.id)}
            onUpdateStatus={(newStatus) => handleUpdateStatus(item.id, newStatus)}
          />
        )}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Carregando orcamentos...' : 'Nenhum orcamento encontrado'}
            </Text>
            <Text style={styles.emptyText}>
              {isLoading
                ? 'Aguarde enquanto carregamos seus dados.'
                : 'Crie um novo orcamento ou ajuste os filtros para visualizar outros resultados.'}
            </Text>
          </View>
        }
      />

      <ConfirmationModal
        visible={confirmation.visible}
        title={confirmation.title}
        message={confirmation.message}
        confirmLabel={confirmation.confirmLabel}
        destructive={confirmation.destructive}
        onCancel={closeConfirmation}
        onConfirm={() => {
          const currentAction = confirmation.onConfirm;
          closeConfirmation();
          currentAction();
        }}
      />
    </SafeAreaView>
  );
}

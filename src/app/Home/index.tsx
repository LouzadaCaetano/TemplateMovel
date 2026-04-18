import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { BudgetCard } from '@/components/BudgetCard';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { FilterModal } from '@/components/FilterModal';
import { Input } from '@/components/Input';
import {
  OrdenacaoOrcamento,
  StatusFiltroOrcamento,
} from '@/types/OrcamentoFiltro';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  add as addOrcamento,
  clear as clearOrcamentos,
  getAll,
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
  onOpenDetails: (orcamentoId: string) => void;
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
  onOpenDetails,
}: Props) {
  const [todosOrcamentos, setTodosOrcamentos] = useState<Orcamento[]>([]);
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] =
    useState<StatusFiltroOrcamento>('Todos');
  const [ordenacao, setOrdenacao] =
    useState<OrdenacaoOrcamento>('maisRecentes');
  const [draftStatusFiltro, setDraftStatusFiltro] =
    useState<StatusFiltroOrcamento>('Todos');
  const [draftOrdenacao, setDraftOrdenacao] =
    useState<OrdenacaoOrcamento>('maisRecentes');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [confirmation, setConfirmation] =
    useState<ConfirmationState>(DEFAULT_CONFIRMATION);

  const loadOrcamentos = async () => {
    try {
      const storedOrcamentos = await getAll();
      setTodosOrcamentos(storedOrcamentos);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      Alert.alert(
        'Erro ao carregar',
        'Não foi possível carregar os orçamentos salvos.'
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

  const handleDuplicate = async (id: string) => {
    const selectedOrcamento = todosOrcamentos.find((item) => item.id === id);

    if (!selectedOrcamento) {
      Alert.alert(
        'Orçamento não encontrado',
        'Não foi possível duplicar este orçamento.'
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
        'Orçamento duplicado',
        'Uma cópia foi criada com status Rascunho.'
      );
    } catch (error) {
      console.error('Erro ao duplicar orçamento:', error);
      Alert.alert(
        'Erro ao duplicar',
        'Não foi possível duplicar o orçamento.'
      );
    }
  };

  const handleClear = () => {
    if (!todosOrcamentos.length) {
      Alert.alert('Lista vazia', 'Não há orçamentos para remover.');
      return;
    }

    openConfirmation({
      title: 'Limpar lista',
      message: 'Tem certeza que deseja remover todos os orçamentos?',
      confirmLabel: 'Limpar',
      destructive: true,
      onConfirm: () => {
        void (async () => {
          try {
            await clearOrcamentos();
            setTodosOrcamentos([]);
            Alert.alert(
              'Lista limpa',
              'Todos os orçamentos foram removidos.'
            );
          } catch (error) {
            console.error('Erro ao limpar orçamentos:', error);
            Alert.alert(
              'Erro ao limpar',
              'Não foi possível limpar a lista de orçamentos.'
            );
          }
        })();
      },
    });
  };

  const handleOpenFilters = () => {
    setDraftStatusFiltro(statusFiltro);
    setDraftOrdenacao(ordenacao);
    setShowFilterModal(true);
  };

  const handleApplyFilters = () => {
    setStatusFiltro(draftStatusFiltro);
    setOrdenacao(draftOrdenacao);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setDraftStatusFiltro('Todos');
    setDraftOrdenacao('maisRecentes');
  };

  const filtrosResumo = [
    statusFiltro !== 'Todos' ? `Status: ${statusFiltro}` : null,
    ordenacao !== 'maisRecentes'
      ? `Ordenação: ${
          ordenacao === 'maisAntigos'
            ? 'Mais antigos'
            : ordenacao === 'maiorValor'
              ? 'Maior valor'
              : 'Menor valor'
        }`
      : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Orçamentos</Text>
          <Text style={styles.subtitle}>
            {`${todosOrcamentos.length} orçamento(s) salvos para acompanhar clientes, status e investimento.`}
          </Text>
        </View>
        <Button title="Novo" onPress={onCreate} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <Input
              placeholder="Buscar por título ou cliente"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={handleOpenFilters}
          >
            <Feather name="sliders" size={18} color="#163db5" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolbarRow}>
          <View style={styles.toolbarInfo}>
            <Text style={styles.toolbarTitle}>Lista de orçamentos</Text>
            <Text style={styles.toolbarSubtitle}>
              {filtrosResumo || 'Sem filtros adicionais. Ordenando por mais recentes.'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearAction}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filtersSection}>
        {statusFiltro !== 'Todos' || ordenacao !== 'maisRecentes' ? (
          <View style={styles.activeFiltersCard}>
            <Text style={styles.activeFiltersTitle}>Filtros aplicados</Text>
            <Text style={styles.activeFiltersText}>
              {filtrosResumo || 'Sem filtros ativos.'}
            </Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={orcamentosVisiveis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BudgetCard
            orcamento={item}
            onPress={() => onOpenDetails(item.id)}
            onEdit={() => onEdit(item.id)}
            onDuplicate={() => void handleDuplicate(item.id)}
          />
        )}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {isLoading ? 'Carregando orçamentos...' : 'Nenhum orçamento encontrado'}
            </Text>
            <Text style={styles.emptyText}>
              {isLoading
                ? 'Aguarde enquanto carregamos seus dados.'
                : 'Crie um novo orçamento ou ajuste os filtros para visualizar outros resultados.'}
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

      <FilterModal
        visible={showFilterModal}
        selectedStatus={draftStatusFiltro}
        selectedOrdenacao={draftOrdenacao}
        onSelectStatus={setDraftStatusFiltro}
        onSelectOrdenacao={setDraftOrdenacao}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
        onClose={() => setShowFilterModal(false)}
      />
    </SafeAreaView>
  );
}

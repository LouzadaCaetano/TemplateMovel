import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from './styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { BudgetCard } from '@/components/BudgetCard';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_ORCAMENTO_OPTIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';
import {
  add as addOrcamento,
  clear as clearOrcamentos,
  getAll,
  getByStatus,
  remove as removeOrcamento,
  updateStatus as updateOrcamentoStatus,
} from '@/storage/orcamentos';

// Gera um id novo e evita repetir ids ja existentes.
const createUniqueId = (prefix: string, existingIds: Set<string>) => {
  let id = '';

  do {
    const randomPart =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    id = `${prefix}-${randomPart}`;
  } while (existingIds.has(id));

  return id;
};

export default function Home() {
  // Estados da tela.
  const [todosOrcamentos, setTodosOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentosFiltrados, setOrcamentosFiltrados] = useState<Orcamento[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<StatusOrcamento>('Rascunho');
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Converte o valor digitado para numero.
  const parseValor = (value: string) => {
    const normalized = value.replace(/\./g, '').replace(',', '.').trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Carrega todos os orcamentos persistidos.
  const loadAllOrcamentos = async (source?: Orcamento[]) => {
    const data = source ?? await getAll();
    setTodosOrcamentos(data);

    return data;
  };

  // Carrega a lista filtrada pelo status atual.
  const loadOrcamentosByStatus = async (
    status: StatusOrcamento,
    source?: Orcamento[]
  ) => {
    const data = await getByStatus(status, source);
    setOrcamentosFiltrados(data);

    return data;
  };

  // Sincroniza estado local e lista filtrada depois da persistencia.
  const syncOrcamentosState = async (
    updatedOrcamentos: Orcamento[],
    nextStatusFiltro = statusFiltro
  ) => {
    setTodosOrcamentos(updatedOrcamentos);

    if (nextStatusFiltro !== statusFiltro) {
      setStatusFiltro(nextStatusFiltro);
    }

    await loadOrcamentosByStatus(nextStatusFiltro, updatedOrcamentos);
  };

  // Cria um novo orcamento e adiciona na lista.
  const handleAdd = async () => {
    const valor = parseValor(valorTotal);

    if (!titulo.trim() || !cliente.trim() || valor <= 0) return;

    const existingOrcamentoIds = new Set(
      todosOrcamentos.map((orcamento) => orcamento.id)
    );
    const existingItemIds = new Set(
      todosOrcamentos.flatMap((orcamento) => orcamento.itens.map((item) => item.id))
    );
    const orcamentoId = createUniqueId('orcamento', existingOrcamentoIds);
    const itemId = createUniqueId('item', existingItemIds);

    const novo: Orcamento = {
      id: orcamentoId,
      cliente,
      titulo,
      itens: [
        {
          id: itemId,
          descricao: 'Total informado',
          quantidade: 1,
          precoUnitario: valor,
        },
      ],
      percentualDesconto: 0,
      status: 'Rascunho',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    };

    try {
      const updatedOrcamentos = await addOrcamento(novo, todosOrcamentos);

      await syncOrcamentosState(updatedOrcamentos, 'Rascunho');

      setTitulo('');
      setCliente('');
      setValorTotal('');

      Alert.alert(
        'Orcamento criado',
        'O novo orcamento foi salvo com status Rascunho.'
      );
    } catch (error) {
      console.error('Erro ao criar orcamento:', error);
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel salvar o novo orcamento.'
      );
    }
  };

  // Executa a exclusao do orcamento.
  const onRemove = async (id: string) => {
    try {
      const updatedOrcamentos = await removeOrcamento(id, todosOrcamentos);

      await syncOrcamentosState(updatedOrcamentos);

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
  };

  // Atualiza o status do orcamento.
  const handleUpdateStatus = async (
    id: string,
    newStatus: StatusOrcamento
  ) => {
    try {
      const updatedOrcamentos = await updateOrcamentoStatus(
        id,
        newStatus,
        todosOrcamentos
      );

      await syncOrcamentosState(updatedOrcamentos);

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
  };

  // Abre a confirmacao antes da exclusao.
  const handleRemove = (id: string) => {
    Alert.alert(
      'Excluir orcamento',
      'Tem certeza que deseja excluir este orcamento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void onRemove(id);
          },
        },
      ]
    );
  };

  // Executa a limpeza completa da lista.
  const onClear = async () => {
    try {
      await clearOrcamentos();
      await syncOrcamentosState([]);

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
  };

  // Abre a confirmacao antes de limpar tudo.
  const handleClear = () => {
    if (!todosOrcamentos.length) {
      Alert.alert(
        'Lista vazia',
        'Nao ha orcamentos para remover.'
      );
      return;
    }

    Alert.alert(
      'Limpar lista',
      'Tem certeza que deseja remover todos os orcamentos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            void onClear();
          },
        },
      ]
    );
  };

  // Carrega todos os orcamentos salvos quando a tela abre.
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const storedOrcamentos = await loadAllOrcamentos();
        await loadOrcamentosByStatus(statusFiltro, storedOrcamentos);
      } catch (error) {
        console.error('Erro ao carregar orcamentos do AsyncStorage:', error);
        Alert.alert(
          'Erro ao carregar',
          'Nao foi possivel carregar os orcamentos salvos.'
        );
      } finally {
        setIsHydrated(true);
      }
    };

    void loadInitialData();
  }, []);

  // Recarrega a lista filtrada sempre que o filtro muda.
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void loadOrcamentosByStatus(statusFiltro);
  }, [statusFiltro, isHydrated]);

  return (
    <View style={styles.container}>
      {/* Cabecalho da tela. */}
      <View style={styles.header}>
        <Text style={styles.title}>Orcamentos</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearAction}>Limpar lista</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario para criar um novo orcamento. */}
      <View style={styles.newForm}>
        <Input
          placeholder="Titulo do orcamento"
          value={titulo}
          onChangeText={setTitulo}
        />
        <Input
          placeholder="Nome da empresa"
          value={cliente}
          onChangeText={setCliente}
        />
        <Input
          placeholder="Valor do orcamento total"
          value={valorTotal}
          onChangeText={setValorTotal}
          keyboardType="decimal-pad"
        />

        <Button title="Adicionar" onPress={() => void handleAdd()} />
      </View>

      {/* Barra de busca e filtro. */}
      <View style={styles.form}>
        <View style={styles.searchRow}>
          <Input placeholder="Titulo ou cliente..." />
        </View>

        {/* Filtro por status da listagem. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {STATUS_ORCAMENTO_OPTIONS.map((status) => {
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
      </View>

      {/* Lista de orcamentos adicionados. */}
      <FlatList
        data={orcamentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BudgetCard
            orcamento={item}
            onRemove={() => handleRemove(item.id)}
            onUpdateStatus={(newStatus) => {
              void handleUpdateStatus(item.id, newStatus);
            }}
          />
        )}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

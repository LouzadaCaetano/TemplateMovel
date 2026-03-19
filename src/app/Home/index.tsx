import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { BudgetCard } from '@/components/BudgetCard';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_ORCAMENTO_OPTIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';
import { getAll, getByStatus, saveAll } from '@/storage/orcamentos';

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

  // Recarrega a lista de acordo com o status selecionado.
  const refreshOrcamentosByStatus = async (
    status: StatusOrcamento,
    source: Orcamento[]
  ) => {
    try {
      const filtered = await getByStatus(status, source);
      setOrcamentosFiltrados(filtered);
    } catch (error) {
      console.error('Erro ao filtrar orcamentos por status:', error);
    }
  };

  // Cria um novo orcamento e adiciona na lista.
  const handleAdd = () => {
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

    setTodosOrcamentos((current) => [...current, novo]);

    setTitulo('');
    setCliente('');
    setValorTotal('');
  };

  // Carrega todos os orcamentos salvos quando a tela abre.
  useEffect(() => {
    const loadOrcamentos = async () => {
      try {
        const storedOrcamentos = await getAll();
        setTodosOrcamentos(storedOrcamentos);
      } catch (error) {
        console.error('Erro ao carregar orcamentos do AsyncStorage:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadOrcamentos();
  }, []);

  // Salva a lista completa sempre que ela muda.
  useEffect(() => {
    const persistOrcamentos = async () => {
      try {
        await saveAll(todosOrcamentos);
      } catch (error) {
        console.error('Erro ao salvar orcamentos no AsyncStorage:', error);
      }
    };

    if (isHydrated) {
      persistOrcamentos();
    }
  }, [todosOrcamentos, isHydrated]);

  // Atualiza a listagem sempre que o filtro muda.
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    refreshOrcamentosByStatus(statusFiltro, todosOrcamentos);
  }, [statusFiltro, todosOrcamentos, isHydrated]);

  return (
    <View style={styles.container}>
      {/* Cabecalho da tela. */}
      <View style={styles.header}>
        <Text style={styles.title}>Orcamentos</Text>
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

        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      {/* Barra de busca e filtro. */}
      <View style={styles.form}>
        <View style={styles.searchRow}>
          <Input placeholder="Titulo ou cliente..." />
          <Button icon={<Feather name="filter" size={20} color="#fff" />} />
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
        renderItem={({ item }) => <BudgetCard orcamento={item} />}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

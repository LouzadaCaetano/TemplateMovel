import { View, Text, FlatList } from 'react-native';
import { styles } from './styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Feather } from '@expo/vector-icons';
import { BudgetCard } from '@/components/BudgetCard';
import { Orcamento } from '@/types/ModeloOrcamento';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave usada para salvar os orcamentos no celular.
const ORCAMENTOS_STORAGE_KEY = '@templatemovel:orcamentos';

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
    const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
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

    // Cria um novo orcamento e adiciona na lista.
    const handleAdd = () => {
    const valor = parseValor(valorTotal);
    if (!titulo.trim() || !cliente.trim() || valor <= 0) return;

    const existingOrcamentoIds = new Set(orcamentos.map((orcamento) => orcamento.id));
    const existingItemIds = new Set(
      orcamentos.flatMap((orcamento) => orcamento.itens.map((item) => item.id))
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

    setOrcamentos(prev => [...prev, novo]);
    setTitulo('');
    setCliente('');
    setValorTotal('');
  };

  // Carrega os orcamentos salvos quando a tela abre.
  useEffect(() => {
    const loadOrcamentos = async () => {
      try {
        const stored = await AsyncStorage.getItem(ORCAMENTOS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Orcamento[];
          setOrcamentos(parsed);
        }
      } catch (error) {
        console.error('Erro ao carregar orcamentos do AsyncStorage:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadOrcamentos();
  }, []);

  // Salva a lista sempre que ela muda.
  useEffect(() => {
    const saveOrcamentos = async () => {
      try {
        await AsyncStorage.setItem(
          ORCAMENTOS_STORAGE_KEY,
          JSON.stringify(orcamentos)
        );
      } catch (error) {
        console.error('Erro ao salvar orcamentos no AsyncStorage:', error);
      }
    };

    if (isHydrated) {
      saveOrcamentos();
    }
  }, [orcamentos, isHydrated]);

  return (
    <View style={styles.container}>
      {/* Cabecalho da tela. */}
      <View style={styles.header}>
        <Text style={styles.title}>Orçamentos</Text>
      </View>

      {/* Formulario para criar um novo orcamento. */}
      <View style={styles.newForm}>
        <Input
          placeholder="Título do orçamento"
          value={titulo}
          onChangeText={setTitulo}
        />
        <Input
          placeholder="Nome da empresa"
          value={cliente}
          onChangeText={setCliente}
        />
        <Input
          placeholder="Valor do orçamento total"
          value={valorTotal}
          onChangeText={setValorTotal}
          keyboardType="decimal-pad"
        />

        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      {/* Barra de busca e filtro. */}
      <View style={styles.form}>
        <View style={styles.searchRow}>
          <Input placeholder="Título ou cliente..." />
          <Button
            icon={<Feather name="filter" size={20} color="#fff" />}
          />
        </View>
      </View>

      {/* Lista de orcamentos adicionados. */}
      <FlatList
        data={orcamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BudgetCard orcamento={item} />}
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      />

    </View>
  );
}

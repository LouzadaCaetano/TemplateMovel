import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
  ServiceItemFormValue,
  ServiceItemRow,
} from '@/components/ServiceItemRow';
import { StatusBadge } from '@/components/StatusBadge';
import { add, getAll, update } from '@/storage/orcamentos';
import { ItemServico } from '@/types/ItemServico';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  STATUS_ORCAMENTO_OPTIONS,
  StatusOrcamento,
} from '@/types/StatusOrcamento';
import {
  calculateDiscountValue,
  calculateSubtotal,
  calculateTotal,
  createUniqueId,
  formatCurrency,
  parseCurrencyValue,
} from '@/utils/orcamentos';
import { styles } from './styles';

interface Props {
  orcamentoId?: string | null;
  onBack: () => void;
  onSaved: () => void;
}

function mapItemToForm(item: ItemServico): ServiceItemFormValue {
  return {
    id: item.id,
    descricao: item.descricao,
    quantidade: String(item.quantidade),
    precoUnitario: String(item.precoUnitario).replace('.', ','),
  };
}

function buildBlankItem(existingIds: Set<string>): ServiceItemFormValue {
  return {
    id: createUniqueId('item', existingIds),
    descricao: '',
    quantidade: '1',
    precoUnitario: '',
  };
}

export default function BudgetForm({ orcamentoId, onBack, onSaved }: Props) {
  const [orcamentosBase, setOrcamentosBase] = useState<Orcamento[]>([]);
  const [titulo, setTitulo] = useState('');
  const [cliente, setCliente] = useState('');
  const [status, setStatus] = useState<StatusOrcamento>('Rascunho');
  const [desconto, setDesconto] = useState('0');
  const [itens, setItens] = useState<ServiceItemFormValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(orcamentoId);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const allOrcamentos = await getAll();
        setOrcamentosBase(allOrcamentos);

        const existingItemIds = new Set(
          allOrcamentos.flatMap((orcamento) => orcamento.itens.map((item) => item.id))
        );

        if (orcamentoId) {
          const selectedOrcamento =
            allOrcamentos.find((item) => item.id === orcamentoId) ?? null;

          if (!selectedOrcamento) {
            Alert.alert(
              'Orcamento nao encontrado',
              'Nao foi possivel carregar o orcamento para edicao.'
            );
            onBack();
            return;
          }

          setTitulo(selectedOrcamento.titulo);
          setCliente(selectedOrcamento.cliente);
          setStatus(selectedOrcamento.status);
          setDesconto(String(selectedOrcamento.percentualDesconto ?? 0));
          setItens(selectedOrcamento.itens.map(mapItemToForm));
        } else {
          setTitulo('');
          setCliente('');
          setStatus('Rascunho');
          setDesconto('0');
          setItens([buildBlankItem(existingItemIds)]);
        }
      } catch (error) {
        console.error('Erro ao carregar formulario:', error);
        Alert.alert(
          'Erro ao carregar',
          'Nao foi possivel preparar o formulario do orcamento.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadForm();
  }, [orcamentoId]);

  const getNextItem = () => {
    const existingIds = new Set([
      ...orcamentosBase.flatMap((orcamento) => orcamento.itens.map((item) => item.id)),
      ...itens.map((item) => item.id),
    ]);

    return buildBlankItem(existingIds);
  };

  const handleChangeItem = (
    id: string,
    field: keyof Omit<ServiceItemFormValue, 'id'>,
    value: string
  ) => {
    setItens((currentItens) =>
      currentItens.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (field === 'quantidade') {
          return {
            ...item,
            quantidade: value.replace(/\D/g, ''),
          };
        }

        if (field === 'precoUnitario') {
          return {
            ...item,
            precoUnitario: value.replace(/[^0-9,.\-]/g, ''),
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const handleAddItem = () => {
    setItens((currentItens) => [...currentItens, getNextItem()]);
  };

  const handleRemoveItem = (id: string) => {
    setItens((currentItens) => currentItens.filter((item) => item.id !== id));
  };

  const subtotal = calculateSubtotal(
    itens.map((item) => ({
      id: item.id,
      descricao: item.descricao,
      quantidade: Number(item.quantidade) || 0,
      precoUnitario: parseCurrencyValue(item.precoUnitario),
    }))
  );
  const percentualDesconto = Math.max(Number(desconto.replace(',', '.')) || 0, 0);
  const descontoCalculado = calculateDiscountValue(subtotal, percentualDesconto);
  const totalFinal = calculateTotal(
    itens.map((item) => ({
      id: item.id,
      descricao: item.descricao,
      quantidade: Number(item.quantidade) || 0,
      precoUnitario: parseCurrencyValue(item.precoUnitario),
    })),
    percentualDesconto
  );

  const handleSave = async () => {
    const tituloTrimmed = titulo.trim();
    const clienteTrimmed = cliente.trim();
    const itensNormalizados = itens.map((item) => ({
      id: item.id,
      descricao: item.descricao.trim(),
      quantidade: Number(item.quantidade) || 0,
      precoUnitario: parseCurrencyValue(item.precoUnitario),
    }));

    if (!tituloTrimmed || !clienteTrimmed) {
      Alert.alert(
        'Campos obrigatorios',
        'Preencha o titulo e o cliente do orcamento.'
      );
      return;
    }

    if (!itensNormalizados.length) {
      Alert.alert(
        'Adicione servicos',
        'O orcamento precisa de pelo menos um servico.'
      );
      return;
    }

    const hasInvalidItem = itensNormalizados.some(
      (item) =>
        !item.descricao ||
        item.quantidade <= 0 ||
        item.precoUnitario <= 0
    );

    if (hasInvalidItem) {
      Alert.alert(
        'Servicos incompletos',
        'Preencha descricao, quantidade e preco unitario validos em todos os servicos.'
      );
      return;
    }

    const existingOrcamentoIds = new Set(orcamentosBase.map((item) => item.id));
    const orcamentoIdFinal =
      orcamentoId ?? createUniqueId('orcamento', existingOrcamentoIds);
    const now = new Date().toISOString();

    const payload: Orcamento = {
      id: orcamentoIdFinal,
      titulo: tituloTrimmed,
      cliente: clienteTrimmed,
      status,
      itens: itensNormalizados,
      percentualDesconto,
      dataCriacao: now,
      dataAtualizacao: now,
    };

    setIsSaving(true);

    try {
      if (orcamentoId) {
        await update(orcamentoId, payload, orcamentosBase);
      } else {
        await add(payload, orcamentosBase);
      }

      Alert.alert(
        isEditing ? 'Orcamento atualizado' : 'Orcamento criado',
        isEditing
          ? 'As alteracoes foram salvas com sucesso.'
          : 'O novo orcamento foi salvo com sucesso.'
      );
      onSaved();
    } catch (error) {
      console.error('Erro ao salvar orcamento:', error);
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel salvar o orcamento.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando formulario...</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Feather name="arrow-left" size={20} color="#1d2747" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEditing ? 'Editar orcamento' : 'Novo orcamento'}
            </Text>
            <Text style={styles.subtitle}>
              Organize os dados principais, servicos e resumo financeiro.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados principais</Text>
          <Input
            label="Titulo"
            placeholder="Ex.: Orcamento de manutencao"
            value={titulo}
            onChangeText={setTitulo}
          />
          <Input
            label="Cliente"
            placeholder="Nome do cliente ou empresa"
            value={cliente}
            onChangeText={setCliente}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusList}>
            {STATUS_ORCAMENTO_OPTIONS.map((statusOption) => {
              const isSelected = statusOption === status;

              return (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusOption,
                    isSelected && styles.statusOptionSelected,
                  ]}
                  onPress={() => setStatus(statusOption)}
                >
                  <StatusBadge status={statusOption} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servicos</Text>
            <Button
              title="Adicionar servico"
              variant="secondary"
              onPress={handleAddItem}
            />
          </View>

          <View style={styles.servicesList}>
            {itens.map((item, index) => (
              <ServiceItemRow
                key={item.id}
                item={item}
                index={index}
                onChange={handleChangeItem}
                onRemove={handleRemoveItem}
                canRemove={itens.length > 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo financeiro</Text>
          <Input
            label="Desconto (%)"
            placeholder="0"
            keyboardType="decimal-pad"
            value={desconto}
            onChangeText={(value) => setDesconto(value.replace(/[^0-9,.\-]/g, ''))}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desconto calculado</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(descontoCalculado)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
              <Text style={styles.summaryHighlightLabel}>Total final</Text>
              <Text style={styles.summaryHighlightValue}>
                {formatCurrency(totalFinal)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancelar"
            variant="secondary"
            onPress={onBack}
            style={styles.footerButton}
          />
          <Button
            title={isEditing ? 'Salvar alteracoes' : 'Salvar orcamento'}
            onPress={() => void handleSave()}
            disabled={isSaving}
            style={styles.footerButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

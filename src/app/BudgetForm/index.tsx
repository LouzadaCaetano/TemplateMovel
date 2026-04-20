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
import { SummaryBlock } from '@/components/SummaryBlock';
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
  parseCurrencyValue,
  parsePercentageValue,
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
              'Orçamento não encontrado',
              'Não foi possível carregar o orçamento para edição.'
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
        console.error('Erro ao carregar formulário:', error);
        Alert.alert(
          'Erro ao carregar',
          'Não foi possível preparar o formulário do orçamento.'
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
            precoUnitario: value.replace(/[^0-9,.]/g, ''),
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
  const percentualDesconto = parsePercentageValue(desconto);
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
        'Campos obrigatórios',
        'Preencha o título e o cliente do orçamento.'
      );
      return;
    }

    if (!itensNormalizados.length) {
      Alert.alert(
        'Adicione serviços',
        'O orçamento precisa de pelo menos um serviço.'
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
        'Serviços incompletos',
        'Preencha descrição, quantidade e preço unitário válidos em todos os serviços.'
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
        isEditing ? 'Orçamento atualizado' : 'Orçamento criado',
        isEditing
          ? 'As alterações foram salvas com sucesso.'
          : 'O novo orçamento foi salvo com sucesso.'
      );
      onSaved();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar o orçamento.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando formulário...</Text>
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
              {isEditing ? 'Editar orçamento' : 'Novo orçamento'}
            </Text>
            <Text style={styles.subtitle}>
              Organize os dados principais, serviços e resumo financeiro.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações gerais</Text>
          <Text style={styles.sectionDescription}>
            Defina os dados básicos para identificar este orçamento.
          </Text>
          <Input
            label="Título"
            placeholder="Ex.: Orçamento de manutenção"
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
          <Text style={styles.sectionDescription}>
            Escolha como este orçamento deve aparecer na listagem.
          </Text>
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
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Serviços incluídos</Text>
              <Text style={styles.sectionDescription}>
                Adicione todos os itens que entram no orçamento.
              </Text>
            </View>
            <Button
              title="Adicionar serviço"
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
          <Text style={styles.sectionTitle}>Investimento</Text>
          <Text style={styles.sectionDescription}>
            O desconto e o total final são atualizados automaticamente.
          </Text>
          <Input
            label="Desconto (%)"
            placeholder="0"
            keyboardType="decimal-pad"
            value={desconto}
            onChangeText={(value) => setDesconto(value.replace(/[^0-9,.]/g, ''))}
          />

          <SummaryBlock
            title="Resumo financeiro"
            subtotal={subtotal}
            desconto={descontoCalculado}
            total={totalFinal}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Cancelar"
            variant="secondary"
            onPress={onBack}
            style={styles.footerButton}
          />
          <Button
            title={isEditing ? 'Salvar alterações' : 'Salvar orçamento'}
            onPress={() => void handleSave()}
            disabled={isSaving}
            style={styles.footerButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

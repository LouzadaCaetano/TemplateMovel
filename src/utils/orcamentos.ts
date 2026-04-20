import { ItemServico } from '@/types/ItemServico';
import { Orcamento } from '@/types/ModeloOrcamento';
import {
  OrdenacaoOrcamento,
  StatusFiltroOrcamento,
} from '@/types/OrcamentoFiltro';

// Gera ids previsiveis para novos registros.
export function createUniqueId(prefix: string, existingIds: Set<string>) {
  let id = '';

  do {
    const randomPart =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    id = `${prefix}-${randomPart}`;
  } while (existingIds.has(id));

  return id;
}

// Converte texto monetario para numero simples.
export function parseCurrencyValue(value: string) {
  const normalized = value.replace(/\./g, '').replace(',', '.').trim();
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

// Converte texto percentual e limita o desconto a uma faixa segura.
export function parsePercentageValue(value: string, maxValue = 100) {
  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, 0), maxValue);
}

// Formata numero para exibicao padrao em reais.
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Soma o valor bruto dos itens.
export function calculateSubtotal(itens: ItemServico[]) {
  return itens.reduce(
    (subtotal, item) => subtotal + item.quantidade * item.precoUnitario,
    0
  );
}

// Calcula o desconto monetario a partir do percentual.
export function calculateDiscountValue(
  subtotal: number,
  percentualDesconto = 0
) {
  return subtotal * (Math.max(percentualDesconto, 0) / 100);
}

// Total final apresentado ao usuario.
export function calculateTotal(
  itens: ItemServico[],
  percentualDesconto = 0
) {
  const subtotal = calculateSubtotal(itens);
  const desconto = calculateDiscountValue(subtotal, percentualDesconto);

  return Math.max(subtotal - desconto, 0);
}

// Clona um orcamento gerando novos ids para o documento e seus itens.
export function duplicateOrcamento(
  orcamento: Orcamento,
  existingOrcamentoIds: Set<string>,
  existingItemIds: Set<string>
) {
  const clonedOrcamentoId = createUniqueId('orcamento', existingOrcamentoIds);
  const clonedItemIds = new Set(existingItemIds);

  return {
    ...orcamento,
    id: clonedOrcamentoId,
    titulo: `${orcamento.titulo} (Cópia)`,
    status: 'Rascunho' as const,
    itens: orcamento.itens.map((item) => {
      const clonedItemId = createUniqueId('item', clonedItemIds);
      clonedItemIds.add(clonedItemId);

      return {
        ...item,
        id: clonedItemId,
      };
    }),
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
  };
}

// Aplica busca, filtro e ordenacao na lista principal.
export function applyOrcamentoFilters(
  orcamentos: Orcamento[],
  {
    busca,
    status,
    ordenacao,
  }: {
    busca: string;
    status: StatusFiltroOrcamento;
    ordenacao: OrdenacaoOrcamento;
  }
) {
  const buscaNormalizada = busca.trim().toLowerCase();

  const filtered = orcamentos.filter((orcamento) => {
    const matchesStatus =
      status === 'Todos' || orcamento.status === status;
    const matchesSearch =
      !buscaNormalizada ||
      orcamento.titulo.toLowerCase().includes(buscaNormalizada) ||
      orcamento.cliente.toLowerCase().includes(buscaNormalizada);

    return matchesStatus && matchesSearch;
  });

  return [...filtered].sort((a, b) => {
    switch (ordenacao) {
      case 'maisAntigos':
        return (
          new Date(a.dataAtualizacao).getTime() -
          new Date(b.dataAtualizacao).getTime()
        );
      case 'maiorValor':
        return (
          calculateTotal(b.itens, b.percentualDesconto) -
          calculateTotal(a.itens, a.percentualDesconto)
        );
      case 'menorValor':
        return (
          calculateTotal(a.itens, a.percentualDesconto) -
          calculateTotal(b.itens, b.percentualDesconto)
        );
      case 'maisRecentes':
      default:
        return (
          new Date(b.dataAtualizacao).getTime() -
          new Date(a.dataAtualizacao).getTime()
        );
    }
  });
}

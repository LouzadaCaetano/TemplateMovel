import { StatusOrcamento } from './StatusOrcamento';

// Filtro de status usado na listagem principal.
export type StatusFiltroOrcamento = StatusOrcamento | 'Todos';

// Opcoes disponiveis para ordenacao da lista.
export type OrdenacaoOrcamento =
  | 'maisRecentes'
  | 'maisAntigos'
  | 'maiorValor'
  | 'menorValor';

export const STATUS_FILTRO_OPTIONS: StatusFiltroOrcamento[] = [
  'Todos',
  'Rascunho',
  'Enviado',
  'Aprovado',
  'Recusado',
];

export const ORDENACAO_OPTIONS: {
  label: string;
  value: OrdenacaoOrcamento;
}[] = [
  { label: 'Mais recentes', value: 'maisRecentes' },
  { label: 'Mais antigos', value: 'maisAntigos' },
  { label: 'Maior valor', value: 'maiorValor' },
  { label: 'Menor valor', value: 'menorValor' },
];

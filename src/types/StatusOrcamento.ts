// Valores aceitos para o status do orcamento.
export type StatusOrcamento =
  | 'Rascunho'
  | 'Enviado'
  | 'Aprovado'
  | 'Recusado';

// Lista usada para montar o filtro de status.
export const STATUS_ORCAMENTO_OPTIONS = [
  'Rascunho',
  'Enviado',
  'Aprovado',
  'Recusado',
] as const satisfies readonly StatusOrcamento[];

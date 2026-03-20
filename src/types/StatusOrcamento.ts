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

// Proximos status permitidos para cada estado atual.
export const STATUS_TRANSITIONS: Record<StatusOrcamento, StatusOrcamento[]> = {
  Rascunho: ['Enviado'],
  Enviado: ['Aprovado', 'Recusado'],
  Aprovado: [],
  Recusado: [],
};

// Valida se a transicao de status pode acontecer.
export function canUpdateStatus(
  currentStatus: StatusOrcamento,
  newStatus: StatusOrcamento
) {
  return STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

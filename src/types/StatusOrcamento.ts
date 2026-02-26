// Define os possíveis estados do orçamento no sistema.
// Usamos um "type union" para limitar os valores permitidos.
export type StatusOrcamento =
  | 'Rascunho'   // Orçamento ainda em edição
  | 'Enviado'    // Orçamento enviado ao cliente
  | 'Aprovado'   // Cliente aprovou o orçamento
  | 'Recusado';  // Cliente recusou o orçamento
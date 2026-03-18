import { ItemServico } from "./ItemServico";
import { StatusOrcamento } from "./StatusOrcamento";

// Dados principais de um orcamento.
export interface Orcamento {
  // Id do orcamento.
  id: string;

  // Nome do cliente.
  cliente: string;

  // Titulo exibido no card.
  titulo: string;

  // Itens que compoem o orcamento.
  itens: ItemServico[];

  // Desconto aplicado ao total.
  percentualDesconto?: number;

  // Situacao atual do orcamento.
  status: StatusOrcamento;

  // Data de criacao.
  dataCriacao: string;

  // Data da ultima alteracao.
  dataAtualizacao: string;
}

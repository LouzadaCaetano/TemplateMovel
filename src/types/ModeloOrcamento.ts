import { ItemServico } from "./ItemServico";
import { StatusOrcamento } from "./StatusOrcamento";
// Representa o documento principal do sistema.
export interface Orcamento {

  id: string;
  // Identificador único do orçamento.
  // Usado para buscar, editar, duplicar ou remover.

  cliente: string;
  // Nome do cliente que está solicitando o orçamento.

  titulo: string;
  // Título ou descrição geral do orçamento.
  // Exemplo: "Orçamento de Serviços de TI".

  itens: ItemServico[];
  // Lista de serviços incluídos no orçamento.
  // Cada item segue o modelo ItemServico.

  percentualDesconto?: number;
  // Percentual de desconto aplicado ao valor total.
  // O símbolo "?" indica que é opcional.
  // Exemplo: 10 significa 10% de desconto.

  status: StatusOrcamento;
  // Situação atual do orçamento no ciclo de vendas.

  dataCriacao: string;
  // Data em que o orçamento foi criado.
  // Armazenada como string para facilitar salvar no AsyncStorage.

  dataAtualizacao: string;
  // Data da última modificação do orçamento.
  // Atualizada sempre que o usuário editar algo.
}
// Dados de um item de servico.
export interface ItemServico {
  // Id do item.
  id: string;

  // Nome ou descricao do servico.
  descricao: string;

  // Quantidade usada no calculo.
  quantidade: number;

  // Preco unitario do servico.
  precoUnitario: number;
}

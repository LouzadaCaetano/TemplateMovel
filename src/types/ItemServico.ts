// Representa cada serviço adicionado dentro de um orçamento.
export interface ItemServico {

  id: string;
  // Identificador único do item.
  // Pode ser gerado com Date.now() ou uuid.
  // Serve para diferenciar cada item na lista.

  descricao: string;
  // Nome ou descrição do serviço prestado.
  // Exemplo: "Instalação de sistema", "Manutenção preventiva".

  quantidade: number;
  // Quantidade de vezes que o serviço será realizado.
  // Exemplo: 2 instalações.

  precoUnitario: number;
  // Valor unitário do serviço.
  // Exemplo: 150.00 (valor em reais).
}
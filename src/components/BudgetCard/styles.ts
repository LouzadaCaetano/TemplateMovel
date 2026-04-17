import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Caixa principal do card.
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
    // sombra Android
    elevation: 3,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  // Linha do titulo e status.
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 32,
  },
  // Botao de exclusao do card.
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
  },
  // Titulo do orcamento.
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d2747',
    flex: 1,
    paddingRight: 12,
  },
  // Nome do cliente.
  company: {
    fontSize: 14,
    color: '#5b6478',
    marginTop: 4,
  },
  // Valor total do card.
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#163db5',
  },
  // Acoes secundarias como editar e duplicar.
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryActionText: {
    color: '#2c46b1',
    fontSize: 13,
    fontWeight: '600',
  },
  // Linha das acoes de status.
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  // Botao pequeno de acao no card.
  statusActionButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // Botao para enviar.
  sendButton: {
    backgroundColor: '#003bb2',
  },
  // Botao para aprovar.
  approveButton: {
    backgroundColor: '#00a650',
  },
  // Botao para recusar.
  rejectButton: {
    backgroundColor: '#b70101',
  },
  // Texto das acoes.
  statusActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

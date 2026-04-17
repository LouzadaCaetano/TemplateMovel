import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Caixa principal do card.
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    // sombra Android
    elevation: 3,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: '#dbe2ef',
  },
  // Linha do titulo e status.
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 6,
  },
  // Titulo do orcamento.
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1d2747',
  },
  // Nome do cliente.
  company: {
    fontSize: 14,
    color: '#5b6478',
  },
  valueRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7b859d',
  },
  // Valor total do card.
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#163db5',
  },
  // Acoes secundarias como editar e duplicar.
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f6',
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
});

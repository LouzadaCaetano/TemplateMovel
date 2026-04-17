import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Fundo e area principal da tela.
  container: {
    flex: 1,
    backgroundColor: '#edf1f7',
  },
  // Titulo principal.
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#163db5',
  },
  subtitle: {
    fontSize: 14,
    color: '#4f5872',
    lineHeight: 20,
  },
  // Linha do topo da tela.
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  // Acao para limpar todos os orcamentos.
  clearAction: {
    color: '#b70101',
    fontSize: 14,
    fontWeight: '600',
  },
  toolbar: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 12,
  },
  filterLabel: {
    color: '#1d2747',
    fontSize: 14,
    fontWeight: '700',
  },
  // Linha horizontal dos filtros de status.
  chipsList: {
    flexGrow: 1,
    gap: 8,
    paddingBottom: 4,
  },
  // Botao base de cada filtro.
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  // Destaque do filtro selecionado.
  filterButtonSelected: {
    backgroundColor: '#2c46b1',
    borderColor: '#2c46b1',
  },
  // Texto do filtro.
  filterButtonText: {
    color: '#2c46b1',
    fontSize: 13,
    fontWeight: '600',
  },
  // Texto do filtro ativo.
  filterButtonTextSelected: {
    color: '#ffffff',
  },
  // Area visivel da lista.
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  // Espacamento interno da lista.
  listContent: {
    paddingTop: 4,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  emptyState: {
    backgroundColor: '#f7f9fc',
    borderRadius: 18,
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#dfe5f1',
  },
  emptyTitle: {
    color: '#1d2747',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    color: '#4f5872',
    lineHeight: 20,
  },
});

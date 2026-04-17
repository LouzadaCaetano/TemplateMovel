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
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchField: {
    flex: 1,
  },
  filterIconButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolbarInfo: {
    flex: 1,
    gap: 4,
  },
  toolbarTitle: {
    color: '#1d2747',
    fontSize: 18,
    fontWeight: '700',
  },
  toolbarSubtitle: {
    color: '#4f5872',
    lineHeight: 20,
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  activeFiltersCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dfe5f1',
    padding: 16,
    gap: 6,
  },
  activeFiltersTitle: {
    color: '#1d2747',
    fontSize: 13,
    fontWeight: '700',
  },
  activeFiltersText: {
    color: '#4f5872',
    lineHeight: 20,
  },
  // Area visivel da lista.
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 14,
  },
  // Espacamento interno da lista.
  listContent: {
    paddingTop: 8,
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

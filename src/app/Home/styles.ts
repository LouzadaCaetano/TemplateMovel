import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Fundo e area principal da tela.
  container: {
    flex: 1,
    backgroundColor: '#d0d2d8',
    paddingTop: 70, 
  },
  // Area da busca.
  form: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 7,
    marginTop: 42,
  },
  // Titulo principal.
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0037a4',
    textAlign: 'left',
    paddingHorizontal: 16,
  },
  // Linha do topo da tela.
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  // Linha que junta campo de busca e botao.
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  // Area visivel da lista.
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 24,
  },
  // Espacamento interno da lista.
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  // Formulario de cadastro.
  newForm: {
    marginTop: 24,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
});

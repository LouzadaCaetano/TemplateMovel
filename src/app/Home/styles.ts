import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0d2d8',
    paddingTop: 70, 
  },
  form: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 7,
    marginTop: 42,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0037a4',
    textAlign: 'left',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // RN 0.70+ supports gap, dará espaçamento entre filhos
  },
  list: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 24,
  }
});

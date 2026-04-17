import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 8,
  },
  label: {
    color: '#1d2747',
    fontSize: 14,
    fontWeight: '600',
  },
  // Estilo base do campo de texto.
  container: {
    backgroundColor: '#ffffff',
    minHeight: 48,
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d8dfef',
    color: '#1d2747',
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});

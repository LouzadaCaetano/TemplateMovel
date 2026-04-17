import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  Rascunho: {
    backgroundColor: '#eef1f6',
  },
  Enviado: {
    backgroundColor: '#e6efff',
  },
  Aprovado: {
    backgroundColor: '#e4f7ea',
  },
  Recusado: {
    backgroundColor: '#fdeaea',
  },
  RascunhoText: {
    color: '#5b6478',
  },
  EnviadoText: {
    color: '#003bb2',
  },
  AprovadoText: {
    color: '#15803d',
  },
  RecusadoText: {
    color: '#b70101',
  },
});

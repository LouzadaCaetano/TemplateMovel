import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Base visual do botao.
  container: {
    backgroundColor: '#2c46b1',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  // Variacao secundaria.
  secondaryContainer: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#bfd0ff',
  },
  // Variacao destrutiva.
  dangerContainer: {
    backgroundColor: '#b70101',
  },
  // Expande o botao para ocupar a linha.
  fullWidth: {
    width: '100%',
  },
  // Estado desabilitado.
  disabledContainer: {
    opacity: 0.55,
  },
  // Texto exibido dentro do botao.
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryTitle: {
    color: '#2c46b1',
  },
  disabledTitle: {
    color: '#ffffff',
  },
});

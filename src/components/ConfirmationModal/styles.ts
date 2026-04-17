import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16213d',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4f5872',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    minWidth: 112,
  },
});

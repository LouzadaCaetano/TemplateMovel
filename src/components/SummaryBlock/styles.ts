import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1d2747',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    color: '#4f5872',
    fontSize: 14,
  },
  value: {
    color: '#1d2747',
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e4e9f3',
  },
  totalLabel: {
    color: '#1d2747',
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    color: '#163db5',
    fontSize: 22,
    fontWeight: '700',
  },
});

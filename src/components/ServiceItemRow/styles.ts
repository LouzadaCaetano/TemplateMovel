import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1d2747',
  },
  removeButton: {
    minWidth: 44,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
  },
});

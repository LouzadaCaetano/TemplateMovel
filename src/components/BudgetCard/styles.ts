import { StyleSheet } from 'react-native';
import { StatusOrcamento } from '@/types/StatusOrcamento';

export const statusStyles: Record<StatusOrcamento, object> = {
  Rascunho: { color: '#666' },
  Enviado: { color: '#003bb2' },
  Aprovado: { color: '#00b300' },
  Recusado: { color: 'rgb(183, 1, 1)' },
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    // sombra Android
    elevation: 3,
    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
});

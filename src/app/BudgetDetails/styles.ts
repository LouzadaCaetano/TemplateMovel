import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f7',
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 36,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#4f5872',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1d2747',
  },
  subtitle: {
    color: '#4f5872',
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d2747',
  },
  heroClient: {
    fontSize: 15,
    color: '#5b6478',
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#163db5',
  },
  heroMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    width: '47%',
    backgroundColor: '#f6f8fc',
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  metaLabel: {
    color: '#6a7287',
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    color: '#1d2747',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#f7f9fc',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#dfe5f1',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1d2747',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusHint: {
    flex: 1,
    textAlign: 'right',
    color: '#5b6478',
    lineHeight: 18,
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusAction: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusActionBlue: {
    backgroundColor: '#2c46b1',
  },
  statusActionGreen: {
    backgroundColor: '#1c8b4d',
  },
  statusActionRed: {
    backgroundColor: '#b70101',
  },
  statusActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#d8dfef',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceTitle: {
    flex: 1,
    color: '#1d2747',
    fontSize: 15,
    fontWeight: '700',
  },
  serviceValue: {
    color: '#163db5',
    fontSize: 15,
    fontWeight: '700',
  },
  serviceMeta: {
    color: '#5b6478',
    fontSize: 13,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});

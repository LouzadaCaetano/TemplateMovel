import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1f7',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 44,
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
    gap: 12,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
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
  sectionDescription: {
    color: '#5b6478',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  sectionHeaderText: {
    flex: 1,
    gap: 4,
  },
  statusList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusOption: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d8dfef',
    padding: 2,
  },
  statusOptionSelected: {
    borderColor: '#2c46b1',
    backgroundColor: '#eef2ff',
  },
  servicesList: {
    gap: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
});

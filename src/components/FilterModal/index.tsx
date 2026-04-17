import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import {
  ORDENACAO_OPTIONS,
  OrdenacaoOrcamento,
  STATUS_FILTRO_OPTIONS,
  StatusFiltroOrcamento,
} from '@/types/OrcamentoFiltro';
import { styles } from './styles';

interface Props {
  visible: boolean;
  selectedStatus: StatusFiltroOrcamento;
  selectedOrdenacao: OrdenacaoOrcamento;
  onSelectStatus: (status: StatusFiltroOrcamento) => void;
  onSelectOrdenacao: (ordenacao: OrdenacaoOrcamento) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;
}

export function FilterModal({
  visible,
  selectedStatus,
  selectedOrdenacao,
  onSelectStatus,
  onSelectOrdenacao,
  onReset,
  onApply,
  onClose,
}: Props) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtro e ordenacao</Text>
            <Text style={styles.subtitle}>
              Ajuste como os orcamentos aparecem na tela inicial.
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Status</Text>
              <View style={styles.optionsList}>
                {STATUS_FILTRO_OPTIONS.map((status) => {
                  const selected = selectedStatus === status;

                  return (
                    <Pressable
                      key={status}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                      ]}
                      onPress={() => onSelectStatus(status)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {status}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ordenacao</Text>
              <View style={styles.optionsList}>
                {ORDENACAO_OPTIONS.map((option) => {
                  const selected = selectedOrdenacao === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                      ]}
                      onPress={() => onSelectOrdenacao(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Resetar"
              variant="secondary"
              onPress={onReset}
              style={styles.footerButton}
            />
            <Button
              title="Aplicar"
              onPress={onApply}
              style={styles.footerButton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

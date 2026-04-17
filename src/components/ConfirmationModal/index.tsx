import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { styles } from './styles';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.modal} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={styles.actionButton}
            />
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.actionButton}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

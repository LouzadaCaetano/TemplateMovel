import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { styles } from './styles';

export interface ServiceItemFormValue {
  id: string;
  descricao: string;
  quantidade: string;
  precoUnitario: string;
}

interface Props {
  item: ServiceItemFormValue;
  index: number;
  onChange: (
    id: string,
    field: keyof Omit<ServiceItemFormValue, 'id'>,
    value: string
  ) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function ServiceItemRow({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Servico {index + 1}</Text>
        {canRemove ? (
          <Button
            icon={<Feather name="trash-2" size={16} color="#ffffff" />}
            variant="danger"
            onPress={() => onRemove(item.id)}
            style={styles.removeButton}
          />
        ) : null}
      </View>

      <Input
        label="Descricao"
        placeholder="Ex.: Manutencao preventiva"
        value={item.descricao}
        onChangeText={(value) => onChange(item.id, 'descricao', value)}
      />

      <View style={styles.row}>
        <View style={styles.field}>
          <Input
            label="Quantidade"
            keyboardType="number-pad"
            value={item.quantidade}
            onChangeText={(value) => onChange(item.id, 'quantidade', value)}
          />
        </View>
        <View style={styles.field}>
          <Input
            label="Preco unitario"
            keyboardType="decimal-pad"
            value={item.precoUnitario}
            onChangeText={(value) => onChange(item.id, 'precoUnitario', value)}
          />
        </View>
      </View>
    </View>
  );
}

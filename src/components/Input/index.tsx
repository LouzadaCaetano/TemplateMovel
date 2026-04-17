import { Text, TextInput, TextInputProps, View } from 'react-native';
import { styles } from './styles';

type Props = TextInputProps & {
  label?: string;
};

export function Input({ label, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.container, rest.multiline && styles.multiline, style]}
        placeholderTextColor="#7a8094"
        {...rest}
      />
    </View>
  );
}

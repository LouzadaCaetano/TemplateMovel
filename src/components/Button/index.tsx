import type { ReactNode } from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';
import { styles } from './styles';

// Props aceitas pelo botao.
type Props = TouchableOpacityProps & {
  title?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
};

export function Button({
  title,
  icon,
  variant = 'primary',
  fullWidth = false,
  style,
  disabled,
  ...rest
}: Props) {
  // Botao reutilizavel com variacoes simples.
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === 'secondary' && styles.secondaryContainer,
        variant === 'danger' && styles.dangerContainer,
        fullWidth && styles.fullWidth,
        disabled && styles.disabledContainer,
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {title ? (
        <Text
          style={[
            styles.title,
            variant === 'secondary' && styles.secondaryTitle,
            disabled && styles.disabledTitle,
          ]}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

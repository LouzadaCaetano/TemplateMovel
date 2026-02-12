import { StyleSheet, Text, View } from "react-native";
import { styles } from "./style";
import { Button } from "../../components/Button";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button title="Logar"/>
    </View>
  );
}
import { RootState } from "@/src/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function ManageScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  // 1. A Barreira de Segurança (Route Protection)
  // Se for aluno, redireciona para a Home imediatamente!
  if (user?.role === "aluno") {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="construct" size={60} color="#007bff" />
      <Text style={styles.title}>Painel do Professor</Text>
      <Text style={styles.subtitle}>
        Em breve (Sprint 3 - Dia 9): Lista de posts, edição e exclusão.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

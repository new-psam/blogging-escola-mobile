import { auth } from "@/src/services/firebase";
import { RootState } from "@/src/store";
import { logoutApp } from "@/src/store/slices/authSlice";
import { signOut } from "firebase/auth";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  // Pegamos os dados do usuário para mostar na tela, ou para editar
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);

  const handleLogout = async () => {
    try {
      // 1. Avisa o Firebase para encerrar a sessão no celular
      await signOut(auth);
      // 2. Limpa os dados do usuário no Redux (opcional, pois o listener do Firebase já cuida disso)
      dispatch(logoutApp());
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name || "Usuário"}</Text>

        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Nivel de Acesso:</Text>
        <Text style={styles.value}>
          {role === "admin"
            ? "Administrador"
            : role === "teacher"
              ? "Professor"
              : "Aluno"}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, color: "#666", marginTop: 10 },
  value: { fontSize: 18, fontWeight: "600", color: "#333" },
  logoutButton: {
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

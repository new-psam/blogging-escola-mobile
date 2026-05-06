import { RootState } from "@/src/store";
import { logout } from "@/src/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Limpa o token do armazenamento assíncrono
      await AsyncStorage.removeItem("@app_token");
      // 2. Atualiza o estado global do Redux para deslogado
      dispatch(logout());
      router.replace("/(auth)"); // Redireciona para a tela de login
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair do aplicativo!");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      {/* Mostra os dados que vieram do MongoDB via Redux */}
      {user && (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.nome || "Usuário"}</Text>

          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Nivel de Acesso:</Text>
          <Text style={styles.value}>{user.role.toUpperCase()}</Text>
        </View>
      )}
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
  infoContainer: {
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

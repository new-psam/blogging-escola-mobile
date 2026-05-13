import UserCard from "@/src/components/UserCard";
import { useManageUsers } from "@/src/hooks/useManageUsers";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function ManageUsersScreen() {
  //Pegamos o usuário logadopara garantir que só o adminmexe aqui
  const currentUser = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  // Pegamos tudo pronto do nosso Hook!
  const {
    users,
    isLoading,
    filter,
    setFilter,
    handleEdit,
    handleDelete,
    handleCreate,
  } = useManageUsers();

  if (currentUser?.role !== "admin") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Acesso negado. Apenas administradores.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/splash-icon.png")}
          style={{ width: 120, height: 40 }}
          resizeMode="contain"
        />

        {/* Espaçador para equilibrar o botão de voltar e manter a logo no centro exato */}
        <View style={{ width: 34 }} />
        <Text style={styles.headerTitle}>Gestão de Equipes</Text>
        <View style={{ width: 24 }} />
      </View>
      {/* abas superiores */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, filter === "professor" && styles.tabActive]}
          onPress={() => setFilter("professor")}
        >
          <Text
            style={[
              styles.tabText,
              filter === "professor" && styles.tabTextActive,
            ]}
          >
            Professores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, filter === "aluno" && styles.tabActive]}
          onPress={() => setFilter("aluno")}
        >
          <Text
            style={[styles.tabText, filter === "aluno" && styles.tabTextActive]}
          >
            Alunos
          </Text>
        </TouchableOpacity>
      </View>

      {/* lista de Cards */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <UserCard user={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum usuário encontrado nesta categoria
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* botão flutuante  FAB - de criação*/}
      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#d32f2f", fontWeight: "bold" },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#007bff" },
  tabText: { fontSize: 16, color: "#666", fontWeight: "600" },
  tabTextActive: { color: "#007bff" },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#666",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 30, fontWeight: "bold", marginTop: -2 },
});

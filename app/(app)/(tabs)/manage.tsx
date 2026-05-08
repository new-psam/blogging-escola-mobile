import ManagePostCard from "@/src/components/ManagePostCard";
import { useManagePosts } from "@/src/hooks/useManagePosts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, useFocusEffect, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ManageScreen() {
  const router = useRouter();

  // 1. puxa toda a "inteligência" do nosso hook
  const { user, isLoading, displayedPosts, fetchPosts, handleDelete } =
    useManagePosts();

  // 2. A Barreira de Segurança (Route Protection)
  // Se for aluno, redireciona para a Home imediatamente!
  if (user?.role === "aluno") {
    return <Redirect href="/(app)/(tabs)" />;
  }

  // 3. Busca de Posts (Sempre que a aba ganhar foco)
  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, []),
  );

  const handleEdit = (id: string) => {
    router.push(`/(app)/post/edit/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user?.role === "admin"
            ? "Todos os Posts (Admin)"
            : "Minhas Postagens"}
        </Text>
      </View>

      {isLoading ? (
        <View>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item._id ?? ""}
          renderItem={({ item }) => (
            <ManagePostCard
              post={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {user?.role === "admin"
                ? "Nenhuma postagem encontrada no sistema."
                : "Você ainda não criou nenhuma postagem."}
            </Text>
          }
        />
      )}

      {/* FAB - botão flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(app)/post/create")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContainer: { padding: 15, paddingBottom: 100 },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#28A745",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

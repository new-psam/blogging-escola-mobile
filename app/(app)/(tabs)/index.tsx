import PostCard from "@/src/components/PostCard";
import { usePosts } from "@/src/hooks/usePosts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const {
    posts,
    isLoading,
    searchQuery,
    setSearchQuery,
    isSearching,
    isLoadingMore,
    handleSearch,
    handleClearSearch,
    loadMorePosts,
  } = usePosts();

  return (
    <View style={styles.container}>
      {/* Cabeçalho com barra de busca */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image
            source={require("../../../assets/images/splash-icon.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Feed Escolar</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título ou conteúdo..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch} // Busca ao apertar "Enter" no teclado
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading || isSearching ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 50 }}
        />
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nenhuma publicação encontrada.</Text>
          {searchQuery ? (
            <Text style={styles.emptySubtitle}>
              Tente buscar com outras palavras.
            </Text>
          ) : null}
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => String(item.id ?? item._id ?? index)}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => router.push(`/post/${item.id || item._id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          // LÓGICA DE PAGINAÇÃO (Infinite Scroll)
          onEndReached={loadMorePosts} // Dispara quando chegar perto do fim
          onEndReachedThreshold={0.1} // 10% antes do fim da lista
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator
                size="small"
                color="#007BFF"
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },

  // Estilos da Barra de Busca
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  clearButton: { padding: 4 },

  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  footerLoader: {
    marginVertical: 20,
  },
});

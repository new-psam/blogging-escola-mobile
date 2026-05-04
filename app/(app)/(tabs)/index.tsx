import PostCard from "@/src/components/PostCard";
import { api } from "@/src/services/api";
import { Post } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para a Busca
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Estados para Paginação (Infinite Scroll)
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Controla se ainda tem dados no banco

  const router = useRouter();

  // Função para buscar os posts no backend Node.js
  const fetchPosts = async (pageNumber = 1, query = "") => {
    try {
      // se for uma busca, podemos usar a rota search que o seu backend tem.
      //se não, usamos a rota padrão com paginação )ex: ?page=1&limit=10)
      const endpoint =
        query.trim() !== ""
          ? `/posts/search?q=${query}&page=${pageNumber}` // Rota de busca (Ajuste conforme sua API)
          : `/posts?page=${pageNumber}&limit=10`; // Rota normal paginada

      // Como configuramos o interceptor no api.ts, ele já vai mandar o token do Firebase aqui
      const response = await api.get(endpoint);
      const newPosts: Post[] = response.data;

      // Se não vier nada novo, avisa que acabaram os posts
      if (newPosts.length === 0) {
        setHasMorePosts(false);
      }

      // Se for a página 1 (ou uma busca nova), substitui a lista. Se não, junta com a lista existente.
      if (pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => {
          // Filtra: Só deixa passar os posts que NÃO existem na lista atual
          const uniqueNewPosts = newPosts.filter(
            (newPost) =>
              !prevPosts.some(
                (p) => p.id === newPost.id || p._id === newPost._id,
              ),
          );

          // Se depois de filtrar não sobrou nada, é porque o backend mandou posts repetidos.
          // Isso significa que as páginas acabaram de verdade.
          if (uniqueNewPosts.length === 0) {
            setHasMorePosts(false);
            return prevPosts; // Não adiciona nada, só retorna a lista atual
          }
          return [...prevPosts, ...uniqueNewPosts];
        });
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  // roda a busca assim que a tela abre, ou seja, quando o componente é montado
  useEffect(() => {
    fetchPosts(1, "");
  }, []);

  // Quando o usuário digita na barra e aperta o botão de buscar
  const handleSearch = () => {
    setIsSearching(true);
    setPage(1);
    setHasMorePosts(true); // Reseta o controle de mais posts para a nova busca
    fetchPosts(1, searchQuery);
  };

  // Quando o usuário limpa a barra de busca
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(true);
    setPage(1);
    setHasMorePosts(true);
    fetchPosts(1, "");
  };

  // Função para carregar mais posts quando o usuário chega no final da lista (Infinite Scroll)
  const loadMorePosts = () => {
    if (!isLoadingMore && hasMorePosts && !isLoading) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, searchQuery);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com barra de busca */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed Escolar</Text>

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
              onPress={() =>
                console.log(
                  "Clicou no post em breve vamos para a tela de leitura ",
                  item.id || item._id,
                )
              }
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 8,
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

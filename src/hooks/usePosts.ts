import { api } from "@/src/services/api";
import { Post } from "@/src/types";
import { useCallback, useEffect, useState } from "react";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para a Busca
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Estados para Paginação (Infinite Scroll)
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Controla se ainda tem dados no banco

  // Função para buscar os posts no backend Node.js
  const fetchPosts = useCallback(async (pageNumber = 1, query = "") => {
    try {
      // se for uma busca, podemos usar a rota search que o seu backend tem.
      //se não, usamos a rota padrão com paginação )ex: ?page=1&limit=10)
      const endpoint =
        query.trim() !== ""
          ? `/posts/search?q=${query}&page=${pageNumber}&limit=10 ` // Rota de busca (Ajuste conforme sua API)
          : `/posts?page=${pageNumber}&limit=10`; // Rota normal paginada

      // Como configuramos o interceptor no api.ts, ele já vai mandar o token do Firebase aqui
      const response = await api.get(endpoint);
      const newPosts: Post[] = response.data;

      if (newPosts.length === 0) {
        setHasMorePosts(false);
      }

      if (pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prevPosts) => {
          const uniqueNewPosts = newPosts.filter(
            (newPost) =>
              !prevPosts.some(
                (p) => p.id === newPost.id || p._id === newPost._id,
              ),
          );
          if (uniqueNewPosts.length === 0) {
            setHasMorePosts(false); // Se não tem posts únicos, acabou os dados
            return prevPosts; // Não adiciona nada
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
  }, []);

  useEffect(() => {
    fetchPosts(1, "");
  }, [fetchPosts]);

  const handleSearch = () => {
    setIsSearching(true);
    setPage(1);
    setHasMorePosts(true); // Resetar controle de mais posts para nova busca
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

  const loadMorePosts = () => {
    if (!isLoadingMore && hasMorePosts && !isLoading) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, searchQuery);
    }
  };

  return {
    posts,
    isLoading,
    searchQuery,
    setSearchQuery,
    isSearching,
    isLoadingMore,
    handleSearch,
    handleClearSearch,
    loadMorePosts,
  };
}

import { useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { api } from "../services/api";
import { RootState } from "../store";
import { Post } from "../types";

export function useManagePosts() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/posts"); // Rota para pegar todos os posts (pode ser paginada depois)
      setPosts(response.data);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os posts. Tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta postagem permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/posts/${id}`);
              Alert.alert("Sucesso", "Postagem excluída com sucesso.");
              fetchPosts(); // Recarrega a lista de posts após exclusão
            } catch (error) {
              console.error("Erro ao excluir post:", error);
              Alert.alert("Erro", "Não foi possível excluir a postagem.");
            }
          },
        },
      ],
    );
  };

  // filtro de permissões
  const displayedPosts =
    user?.role === "admin"
      ? posts
      : posts.filter((post) => post.autor === user?.nome);

  return {
    user,
    isLoading,
    displayedPosts,
    fetchPosts,
    handleDelete,
  };
}

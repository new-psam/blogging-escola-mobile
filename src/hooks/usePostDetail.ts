import { api } from "@/src/services/api";
import { RootState } from "@/src/store";
import { Comment, Post } from "@/src/types";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";

export function usePostDetail(postId: string | undefined) {
  // Dados do usuário logado via Redux
  const user = useSelector((state: RootState) => state.auth.user);

  // Estados
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca de dados assim que o hook recebe o ID
  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!postId) return;

      try {
        const postResponse = await api.get(`/posts/${postId}`); // Rota para pegar os detalhes do post
        setPost(postResponse.data);

        const commentsResponse = await api.get(`/posts/${postId}/comments`); // Rota para pegar os comentários do post
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  // Função para enviar o comentário
  const handleSendComment = async () => {
    if (!newComment.trim() || !postId) return;

    setIsSubmitting(true);
    try {
      const response = await api.post(`/posts/${postId}/comments`, {
        texto: newComment,
        autor: user?.name || "Anônimo", // Usa o nome do usuário logado ou "Anônimo" se não tiver
      });

      // Adiciona o novo comentário à lista de comentários
      setComments([response.data, ...comments]);
      setNewComment(""); // Limpa o campo de comentário
    } catch (error: any) {
      console.error("Erro ao enviar comentário:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar o comentário. " +
          (error.response?.status === 401 ? "(Não Autorizado)" : ""),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    post,
    comments,
    newComment,
    setNewComment,
    isLoading,
    isSubmitting,
    handleSendComment,
  };
}

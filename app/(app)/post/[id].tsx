import { CommentItem } from "@/src/components/CommentItem";
import { usePostDetail } from "@/src/hooks/usePostDetail";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PostDetailScreen() {
  // Pega o ID que foi passado na URL pelo clique do cartão.
  const { id } = useLocalSearchParams();

  // BLINDAGEM: Garante que o ID é uma string simples (caso o Expo Router mande um array)
  const postId = Array.isArray(id) ? id[0] : id;

  const {
    post,
    comments,
    newComment,
    setNewComment,
    isLoading,
    isSubmitting,
    handleSendComment,
  } = usePostDetail(postId);

  // Tela de carregamento enquanto o axios busca os dados do post
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se o post foi apagado ou não existe, mostramos uma mensagem de erro
  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Postagem não encontrada.</Text>
      </View>
    );
  }

  const formattedDate = post.dataCriacao
    ? new Date(post.dataCriacao).toLocaleDateString("pt-BR")
    : "Data desconhecida";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* cabeçalho do Post */}
      <Text style={styles.title}>{post.titulo}</Text>

      <View style={styles.metaContainer}>
        <Ionicons name="person-circle-outline" size={20} color="#666" />
        <Text style={styles.metaText}>{post.autor}</Text>
        <Text style={styles.metaDot}>•</Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
        <Text style={styles.metaText}>{formattedDate}</Text>
      </View>

      <View style={styles.divider} />

      {/* Corpo do Texto */}
      <Text style={styles.content}>{post.conteudo}</Text>

      {/* comentário será aqui */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentTitle}>Comentários ({comments.length})</Text>

        {/* Formulário de novo comentário */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Escreva seu comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Lista de comentários */}
        {comments.length === 0 ? (
          <Text style={styles.noCommentsText}>Seja o primeiro a comentar!</Text>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20, paddingBottom: 40, marginTop: 50 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: { fontSize: 18, color: "#ff0000" },
  title: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 12 },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: { fontSize: 14, color: "#666", marginLeft: 4 },
  metaDot: { fontSize: 14, color: "#666", marginHorizontal: 8 },
  divider: { height: 1, backgroundColor: "#eee", marginBottom: 20 },
  content: { fontSize: 16, color: "#444", lineHeight: 26 },

  commentsSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  noCommentsText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: { backgroundColor: "#A0CFFF" },
});

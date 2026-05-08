import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  // Limita o texto do feed a 100 caracteres para os cartões não ficarem gigantes
  const contentSnippet =
    post.conteudo.length > 100
      ? `${post.conteudo.substring(0, 100)}...`
      : post.conteudo;

  // Formata a data para o padrão brasileiro
  const formatteDate = post.dataCriacao //instanceof Date
    ? new Date(post.dataCriacao).toLocaleDateString("pt-BR")
    : "Data recente";

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      <Text style={styles.title}>{post.titulo}</Text>

      <Text style={styles.authorInfo}>
        Por {post.autor} • {formatteDate}
      </Text>

      <Text style={styles.content}>{contentSnippet}</Text>

      <View style={styles.footer}>
        <Text style={styles.readMoreText}>Ler Mais</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  authorInfo: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  readMoreText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
});

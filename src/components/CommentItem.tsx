import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { Comment } from "../types";

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  // Formata a data (lembrando que no TypeScript definimos dataCriacao como string)
  const formattedDate = comment.dataCriacao
    ? new Date(comment.dataCriacao).toLocaleDateString("pt-BR")
    : "Data recente";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={24} color="#666" />
        <Text style={styles.author}>{comment.autor || "Anônimo"}</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.content}>{comment.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 6,
  },
  dot: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 6,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  content: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

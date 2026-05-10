import { User } from "@/src/hooks/useManageUsers";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{user.nome}</Text>
          {user.role === "admin" && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>

        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(user._id)}
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(user._id, user.nome)}
        >
          <Text style={styles.deleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#666" },
  adminBadge: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardActions: { flexDirection: "row" },
  actionButton: { marginLeft: 15, padding: 5 },
  editText: { color: "#007bff", fontWeight: "bold" },
  deleteText: { color: "#d32f2f", fontWeight: "bold" },
});

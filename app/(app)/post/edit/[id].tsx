import { api } from "@/src/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditPostScreen() {
  const { id } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //1. Busca os dados antigos para preencher o formulário
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await api.get(`/posts/${postId}`);
        setTitulo(response.data.titulo);
        setConteudo(response.data.conteudo);
      } catch (error) {
        console.error("Erro ao carregar post para edição:", error);
        Alert.alert("Erro!", "Não foi possível carregar os dados da postagem!");
        router.back(); // leva o usuário de volta o manager
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  // 2. Envia os dados atualizados (put)
  const handleUpdatePost = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert("Erro", "O título e/ou o conteúdo não podem ficar vazios!");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/posts/${postId}`, {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
      });

      Alert.alert("Sucesso!", "A postagem foi atualizada!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar a postagem:", error);
      Alert.alert("Erro", "Não foi possível atualizar a postagem!");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <View style={[styles.mainContainer, styles.center]}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Carregando postagem...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
            <Text style={styles.backText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar</Text>
          <View style={{ width: 80 }} />
        </View>

        <ScrollView
          style={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Título da Postagem</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: A teoria da Relatividade"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={100}
          />

          <Text style={styles.label}>Conteúdo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escreva o conteúdo da sua aula aqui..."
            placeholderTextColor="#777"
            value={conteudo}
            onChangeText={setConteudo}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleUpdatePost}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  center: { justifyContent: "center", alignItems: "center" },
  keyboardContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: { flexDirection: "row", alignItems: "center", width: 80 },
  backText: { fontSize: 16, color: "#333", marginLeft: 7 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: { minHeight: 200 },
  submitButton: {
    backgroundColor: "#007BFF", // Azul para diferenciar do verde de Criação
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  submitButtonDisabled: { backgroundColor: "#80BFFF" },
  submitButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});

import { api } from "@/src/services/api";
import { RootState } from "@/src/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { useSelector } from "react-redux";

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useSelector((state: RootState) => state.auth.user);

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePost = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert("Erro", "Por favor, preencha o título e o conteúdo.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Monta o objeto. O autor é puxado automaticamente do Reduz!
      const novoPost = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        autor: user?.nome || "Professor Anônimo",
      };

      // Dipara o Post para a sua API no Render
      await api.post("/posts", novoPost);

      Alert.alert("Sucesso", "Sua postagem foi publicada!");
      router.back(); // Volta para a tela de gerenciamento
    } catch (error) {
      console.error("Erro ao criar postagem", error);
      Alert.alert("Erro!", "Não foi possível publicar a postagem!");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Postagem</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Formulário */}
        <ScrollView
          style={styles.formContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Título da Postagem</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: A Teoria da Relatividade Geral"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={100}
          />

          <Text style={styles.label}>Conteúdo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escreva o conteúdo da sua aula aqui..."
            placeholderTextColor="#666"
            value={conteudo}
            onChangeText={setConteudo}
            multiline
            textAlignVertical="top" // Faz o texto começar do topo no Android
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleCreatePost}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Publicar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  keyboardContainer: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { flexDirection: "row", alignItems: "center", width: 60 },
  backText: { fontSize: 16, color: "#333", marginLeft: 6 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 8 },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: { minHeight: 200 },
  submitButton: {
    backgroundColor: "#28a245",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  submitButtonDisabled: { backgroundColor: "#85c895" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

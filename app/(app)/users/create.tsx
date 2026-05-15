import { api } from "@/src/services/api";
import { getFirebaseErrorMessage } from "@/src/utils/firebaseErrors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateUserScreen() {
  const router = useRouter();

  const { role } = useLocalSearchParams<{ role: string }>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!nome || !email || !password) {
      return Alert.alert("Erro", "Por favor, preencha todos os campos. ");
    }

    setIsLoading(true);

    try {
      // vai no AuthController do Node.js para criar o usuário silenciosamente (Firebase + MongoDB)
      await api.post("/users", {
        nome: nome.trim(),
        email: email.toLocaleLowerCase().trim(),
        password: password,
        role: role,
      });

      Alert.alert("Sucesso", `${role} criado com sucesso!`);
      router.back();
    } catch (error: any) {
      //console.error("Erro ao criar o usuário:", error);
      const mensagemAmigavel = getFirebaseErrorMessage(error.code);
      Alert.alert("Erro", mensagemAmigavel);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              Novo {role === "professor" ? "Professor" : "Aluno"}
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: João da Silva"
                placeholderTextColor="#666"
                value={nome}
                onChangeText={setNome}
                editable={!isLoading}
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: joao@escola.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />

              <Text style={styles.label}>Senha de Acesso</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  form: { backgroundColor: "#fff", padding: 20, borderRadius: 8, elevation: 2 },
  label: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 8 },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#94d3a2" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});

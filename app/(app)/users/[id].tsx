import { api } from "@/src/services/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function EditUserScreen() {
  const router = useRouter();
  // PEga o ID da URL  (enciado pelo botão editar do card)
  const { id } = useLocalSearchParams();

  // 🌟 Pegamos o usuário logado atualmente
  const currentUser = useSelector((state: any) => state.auth.user);
  // 🌟 Verificamos se o Admin está editando a si mesmo
  const isEditingSelf = currentUser?._id === id;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Busca os dados atuais do usuário para preencher
    const fetchUser = async () => {
      try {
        const response = await api.get("/users");
        // acha o usuário específico na lista pelo ID
        const userToEdit = response.data.find((u: any) => u._id === id);

        if (userToEdit) {
          setNome(userToEdit.nome);
          setEmail(userToEdit.email);
          setRole(userToEdit.role);
        } else {
          Alert.alert("Erro!", "Falha ao buscar os dados do usuário.");
          router.back();
        }
      } catch (error) {
        Alert.alert("Erro!", "Usuário não encontrado.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!nome || !email) {
      return Alert.alert("Erro", "Nome e E-mail são obrigatórios!");
    }

    setIsSaving(true);

    try {
      // Monta os dados. A senha só entra no pacote se o Admin digitou algo
      const updateData: any = {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        // Se estiver editando a si mesmo, força o envio do role original para não haver risco no backend
        role: isEditingSelf ? currentUser.role : role,
      };

      if (password) updateData.password = password;

      await api.put(`/users/${id}`, updateData);

      Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao atualizar:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar. Verifique se o e-mail já está em uso.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          editable={!isSaving}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSaving}
        />

        {/* aqui a lógica para proteção da auto elimincação do admin */}
        <Text style={styles.label}>Cargo / Nível de Acesso</Text>
        {isEditingSelf ? (
          <View style={styles.selfWarningContainer}>
            <Text style={styles.selfWarningContainerText}>
              Você não pode alterar seu próprio nível de acesso por motivo de
              segurança.
            </Text>
          </View>
        ) : (
          <View style={styles.roleContainer}>
            {["aluno", "professor", "admin"].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleButton,
                  role === r && styles.roleButtonActive,
                ]}
                onPress={() => setRole(r)}
                disabled={isSaving}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    role === r && styles.roleButtonTextActive,
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.label, { marginTop: 10 }]}>
          Nova Senha (Opcional)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Deixe em branco para não alterar"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isSaving}
        />

        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Atualizar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  form: { backgroundColor: "#fff", padding: 20, borderRadius: 8, elevation: 2 },
  label: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 8 },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { backgroundColor: "#80bdff" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: { color: "#666", fontSize: 16, fontWeight: "bold" },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    marginHorizontal: 2,
    borderRadius: 6,
  },
  roleButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  roleButtonText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  selfWarningContainer: {
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeeba",
    marginBottom: 20,
  },
  selfWarningContainerText: {
    color: "#856404",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});

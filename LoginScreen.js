import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const handleSignIn = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then((UserCredential) => {
          console.log("Ingresado");
          console.log("UserCredential: " + UserCredential.user.uid);
          let uid = UserCredential.user.uid;
          navigation.navigate("appLimpieza", { uid: uid, uidTask: uid });
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Logo />
        <Header>Bienvenido!</Header>
        <View style={{ width: 300 }}>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Contraseña"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
        </View>
        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPasswordScreen")}
          >
            <Text style={styles.forgot}>Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
        <Button mode="contained" onPress={handleSignIn}>
          <Text>Iniciar sesion</Text>
        </Button>
        <View style={styles.row}>
          <Text>No tenes una cuenta creada?</Text>
          <TouchableOpacity onPress={() => navigation.replace("Registrarte")}>
            <Text style={styles.link}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
  },
});

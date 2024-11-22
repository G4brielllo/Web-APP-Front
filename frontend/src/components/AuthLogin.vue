<template>
  <v-app>
    <v-container>
      <v-alert v-if="showErrorAlert" type="error" dismissible>
        Błąd podczas logowania. Sprawdź poprawność danych
      </v-alert>

      <v-card class="login-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>{{ "Logowanie" }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="user.email"
              label="Email"
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Hasło"
              dense
              required
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="login-actions">
          <v-btn color="gray" @click="login()">Zaloguj</v-btn>
        </v-card-actions>
        <v-card-actions class="login-actions">
          <v-btn color="gray" @click="register()">Zarejestruj się</v-btn>
        </v-card-actions>
        <v-card-actions class="login-actions-forgot-password">
          <v-btn color="gray" @click="forgotPassword()">Zapomniałem hasła</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";

function encryptData(data) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    encryptionKey
  ).toString();
  return ciphertext;
}

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      valid: true,
      showErrorAlert: false,
    };
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const formData = new FormData();
          formData.append("email", this.user.email);
          formData.append("password", this.user.password);

          const response = await axios.post(
            "http://127.0.0.1:8000/login",
            formData
          );

          if (response.status === 200) {
            const userInformation = {
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              token: response.data.token,
              role: response.data.role,
              logo: response.data.logo,
            };
            localStorage.setItem("jwt_token", response.data.token);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            const userData = JSON.stringify(userInformation).toString();
            localStorage.setItem(encryptionKey, encryptData(userData));
            this.clearForm();
            this.showErrorAlert = false;
            this.$router.push("/");
          } else {
            console.error("Login failed:", response.data);
            this.showErrorAlert = true;
          }
        } catch (error) {
          console.error("Login error:", error);
          this.showErrorAlert = true;
        }
      }
    },
    cancelLogin() {
      this.clearForm();
      this.$router.push("/");
    },
    forgotPassword() {
      this.$router.push("/confirmEmail");
    },
    register() {
      this.$router.push("/register");
    },
    clearForm() {
      this.user.email = "";
      this.user.password = "";
    },
  },
};
</script>

<style scoped>
.login-card {
  max-width: 400px;
  border-radius: 12px;
  margin: auto;
  padding: 16px;
}

.login-actions {
  display: flex;
  justify-content: center;
  padding: 8px;
}
.login-actions-forgot-password {
  display: flex;
  justify-content: center;
}

.v-btn {
  min-width: 120px;
  padding: 4px 8px;
}

.v-toolbar-title {
  font-size: 20px;
}

.v-alert {
  max-width: fit-content;
  margin: auto;
  text-align: center;
}
</style>

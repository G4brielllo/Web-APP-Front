<template>
  <v-app>
    <v-container>
      <v-alert v-if="showErrorAlert" type="error" dismissible>
        Hasła nie są identyczne. Sprawdź je i spróbuj ponownie.
      </v-alert>
      <v-card class="register-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Rejestracja</p>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.name"
                    outlined
                    label="Nazwa"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.password"
                    label="Hasło"
                    outlined
                    dense
                    required
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.confirmPassword"
                    label="Potwierdź Hasło"
                    outlined
                    dense
                    required
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="image"
                    outlined
                    label="Logo"
                    accept="image/*"
                    @change="createBase64Image"
                    dense
                  ></v-file-input>
                  <div v-if="user.logo">
                    <img
                      :src="user.logo"
                      alt="User Logo"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="action-buttons">
          <v-btn @click="saveUser()">Utwórz Konto</v-btn>
          <v-btn @click="cancelUserAdding()">Anuluj</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        id: null,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        logo: "",
      },
      valid: true,
      image: null,
      base64: null,
      showErrorAlert: false,
    };
  },
  methods: {
    async saveUser() {
      if (this.$refs.form.validate()) {
        if (!this.validatePasswords()) {
          this.showErrorAlert = true;
          return;
        }

        try {
          const formData = new FormData();
          formData.append("name", this.user.name);
          formData.append("email", this.user.email);
          formData.append("password", this.user.password);
          formData.append("logo", this.user.logo);

          console.log("FormData content:");
          for (const pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }

          const response = await axios.post(
            "http://127.0.0.1:8000/register",
            formData
          );

          if (response.status === 200 || response.status === 201) {
            console.log("User saved successfully:", response.data);
            this.clearForm();
            this.$router.push("/");
          } else {
            console.error("Error saving user:", response.data);
          }
        } catch (error) {
          console.error("Error saving user:", error);
        }
      }
    },
    validatePasswords() {
      if (this.user.password !== this.user.confirmPassword) {
        this.showErrorAlert = true;
        setTimeout(() => {
          this.showErrorAlert = false;
        }, 3000);
        return false;
      }
      this.showErrorAlert = false;
      return true;
    },
    cancelUserAdding() {
      this.clearForm();
      this.$router.push("/login");
    },
    login() {},
    clearForm() {
      this.user.id = null;
      this.user.name = "";
      this.user.email = "";
      this.user.password = "";
      this.user.confirmPassword = "";
      this.user.logo = "";
      this.base64 = null;
      this.image = null;
      this.showErrorAlert = false;
    },
    createBase64Image() {
      if (!this.image) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
        this.user.logo = this.base64;
      };
      reader.readAsDataURL(this.image);
    },
  },
};
</script>

<style scoped>
.register-card {
  max-width: 600px;
  border-radius: 12px;
  margin: auto;
  padding: 16px;
}

.compact-form {
  padding: 0;
}

.compact-actions {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.login-btn {
  padding: 8px;
}

.v-card-title {
  font-size: 18px;
  padding: 8px 0;
}

.v-text-field,
.v-select,
.v-textarea,
.v-radio-group {
  margin-bottom: 4px;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 4%;
}

.v-text-field,
.v-select,
.v-textarea,
.v-radio-group {
  min-height: 40px;
}
.v-btn {
  width: 80%;
  min-width: 120px;
  padding: 4px 8px;
}
.v-btn:hover {
  color: #1976d2;
  transform: scale(1.05);
}

.toolbar-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 16px;
}

.v-alert {
  max-width: fit-content;
  margin: auto;
  text-align: center;
}
</style>

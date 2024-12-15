<template>
  <v-app>
    <v-container>
      <v-alert v-if="showErrorAlert" type="error" dismissible>
        Hasła nie są identyczne. Sprawdź je i spróbuj ponownie.
      </v-alert>
      <v-card class="elevation-4 compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>Edytuj dane użytkownika</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.name"
                    label="Nazwa"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.password"
                    label="Nowe hasło"
                    dense
                    :rules="[
                      (v) => !!v || !user.confirmPassword || 'Wprowadź hasło',
                    ]"
                    type="password"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.confirmPassword"
                    label="Potwierdź hasło"
                    dense
                    :rules="[
                      (v) => user.password === '' || !!v || 'Potwierdź hasło',
                      (v) =>
                        v === user.password || 'Hasła muszą być identyczne',
                    ]"
                    type="password"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="image"
                    label="Zmień zdjęcie profilowe"
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
                <v-col cols="12" sm="6"> </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="compact-actions">
          <v-btn color="gray" @click="saveUser" :disabled="!valid"
            >Zapisz zmiany</v-btn
          >
          <v-btn color="gray" @click="cancelEdit">Anuluj</v-btn>
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
  created() {
    const userId = this.$route.query.id;
    if (userId) {
      this.fetchUser(userId);
    } else {
      console.error("No user ID provided in query parameters.");
    }
  },

  methods: {
    async fetchUser(userId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/users/${userId}`
        );
        const userData = response.data;

        this.user.id = userData.id;
        this.user.name = userData.name;
        this.user.email = userData.email;
        this.user.logo = userData.logo;

        if (this.isImageUrl(userData.logo)) {
          await this.fetchImageUrl(userData.logo);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },

    async fetchImageUrl(url) {
      try {
        const response = await axios.get(url, { responseType: "blob" });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.base64 = event.target.result;
          this.user.logo = this.base64;
        };
        reader.readAsDataURL(response.data);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    },

    async saveUser() {
      if (!this.validatePasswords()) {
        this.showErrorAlert = true;
        return;
      }

      if (this.$refs.form.validate()) {
        try {
          const userData = {
            name: this.user.name,
            email: this.user.email,
            logo: this.base64 || undefined,
          };
          if (this.user.password) {
            userData.password = this.user.password;
          }

          const response = await axios.put(
            `http://127.0.0.1:8000/users/${this.user.id}`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Server response:", response.data);

          if (response.status === 200 || response.status === 201) {
            this.clearForm();
            this.$router.push("/");
          } else {
            console.error("Error updating user:", response.data);
          }
        } catch (error) {
          console.error("Error updating user:", error.response);
        }
      } else {
        console.error("Form validation failed.");
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

    cancelEdit() {
      this.clearForm();
      this.$router.push("/listUsers");
    },

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

    createBase64Image(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
        this.user.logo = this.base64;
      };
      reader.readAsDataURL(file);
    },

    isImageUrl(url) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
  },
};
</script>

<style scoped>
.compact-card {
  max-width: 80%;
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

.v-btn {
  min-width: 80px;
  padding: 4px 8px;
}
</style>

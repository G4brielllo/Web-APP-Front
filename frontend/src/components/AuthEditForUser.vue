<template>
  <v-app>
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
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
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="compact-actions">
          <v-btn color="gray" @click="saveUser">Zapisz zmiany</v-btn>
          <v-btn color="gray" @click="cancelEdit">Anuluj</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
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
  components: {
    NavigationDrawer,
  },
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
    this.fetchUserData();
  },

  methods: {
    async fetchUserData() {
      try {
        const encryptedData = localStorage.getItem(encryptionKey);

        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const user_information = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const userInformation = JSON.parse(user_information);
        this.user.name = userInformation.name;
        this.user.email = userInformation.email;
        this.user.logo = userInformation.logo;
      } catch (error) {
        console.error("Error fetching user data:", error);
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
      const encryptedData = localStorage.getItem(encryptionKey);

      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const user_information = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const userInformation = JSON.parse(user_information);
      this.user.id = userInformation.id;
      console.log("Saving user with ID:", this.user.id);

      if (!this.validatePasswords()) {
        this.showErrorAlert = true;
        return;
      }

      if (this.$refs.form.validate()) {
        try {
          const formData = new FormData();
          formData.append("name", this.user.name);
          formData.append("email", this.user.email);
          if (this.user.password) {
            formData.append("password", this.user.password);
          }
          if (this.image) {
            formData.append("logo", this.base64);
          }
          console.log("Wysyłane dane:", {
            name: this.user.name,
            email: this.user.email,
            password: this.user.password,
            logo: this.base64,
          });

          console.log("Saving user data:", formData);
          const response = await axios.put(
            `http://127.0.0.1:8000/users/${this.user.id}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200 || response.status === 201) {
            console.log("User updated successfully:", response.data);

            const updatedUser = {
              id: this.user.id,
              name: this.user.name,
              email: this.user.email,
              logo: this.user.logo,
            };
            const userData = JSON.stringify(updatedUser).toString();
            localStorage.setItem(encryptionKey, encryptData(userData));

            this.clearForm();
            this.$router.push("/");
          } else {
            console.error("Error updating user:", response.data);
          }
        } catch (error) {
          console.error("Error updating user:", error);
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
      this.$router.push("/");
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
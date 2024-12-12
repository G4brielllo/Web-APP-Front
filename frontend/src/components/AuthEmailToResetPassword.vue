<template>
  <v-app>
    <v-container>
      <v-alert v-if="showErrorAlert" type="error" dismissible>
        Hasła nie są identyczne. Sprawdź je i spróbuj ponownie.
      </v-alert>
      <v-card class="elevation-4 compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>Resetuj hasło użytkownika</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    dense
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="compact-actions">
          <v-btn color="gray" @click="confirmEmail" :disabled="!valid">
            Zresetuj hasło
          </v-btn>
          <v-btn color="gray" @click="cancelReset">Anuluj</v-btn>
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
        email: "",
      },
      valid: true,
      showErrorAlert: false,
    };
  },

  methods: {
    async confirmEmail() {
      if (!this.user.email || !this.isValidEmail(this.user.email)) {
        this.showErrorAlert = true;
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/reset-request', {
          email: this.user.email
        });
        console.log('Email sent:', response.data);
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    },

    cancelReset() {
      this.clearForm();
      this.$router.push("/");
    },

    clearForm() {
      this.user.email = "";
      this.showErrorAlert = false;
    },

    isValidEmail(email) {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
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

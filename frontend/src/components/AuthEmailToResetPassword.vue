<template>
  <v-app>
    <v-container>
      <v-alert v-if="showErrorAlert" type="error" dismissible>
        Hasła nie są identyczne. Sprawdź je i spróbuj ponownie.
      </v-alert>
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Resetuj hasło użytkownika</p>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-text-field
                v-model="user.email"
                outlined
                label="Email"
                dense
                required
              ></v-text-field>
            </v-container>
          </v-form>
        </v-card-text>

        <v-btn
          class="caction-buttons"
          color="gray"
          @click="confirmEmail"
          :disabled="!valid"
        >
          Zresetuj hasło
        </v-btn>
        <v-btn class="caction-buttons" color="gray" @click="cancelReset"
          >Anuluj</v-btn
        >
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
        const response = await axios.post(
          "http://127.0.0.1:8000/reset-request",
          {
            email: this.user.email,
          }
        );
        console.log("Email sent:", response.data);
      } catch (error) {
        console.error("Error resetting password:", error);
      }
    },

    cancelReset() {
      this.clearForm();
      this.$router.push("/login");
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
  max-width: 600px;
  border-radius: 12px;
  margin: auto;
  padding: 16px;
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
.caction-buttons {
  margin-bottom: 4%;
  width: 80%;
  margin-left: 10%;
  display: flex;
  justify-content: center;
  padding: 8px;
}
.v-btn {
  width: 80%;
  min-width: 120px;
  padding: 4px 8px;
}
</style>

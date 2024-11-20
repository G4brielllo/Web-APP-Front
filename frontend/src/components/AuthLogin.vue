<template>
  <v-app>
    <v-container>
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
          <v-btn color="gray" @click="login">Zaloguj</v-btn>
        </v-card-actions>
        <v-card-actions class="login-actions">
          <v-btn color="gray">Zarejestruj się</v-btn>
        </v-card-actions>
        <v-card-actions class="login-actions">
          <v-btn color="gray">Zapomniałem hasła</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      valid: true,
    };
  },
  methods: {
    cancelLogin() {
      this.clearForm();
      this.$router.push("/");
    },
    clearForm() {
      this.user.email = "";
      this.user.password = "";
    },
    register() {
      this.$router.push("/register");
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

.v-btn {
  min-width: 120px;
  padding: 4px 8px;
}

.v-toolbar-title {
  font-size: 20px;
}
</style>

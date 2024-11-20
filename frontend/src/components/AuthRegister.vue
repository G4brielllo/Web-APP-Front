<template>
    <v-app>
      <v-container>
        <v-card class="register-card">
          <v-toolbar color="black" dark>
            <v-toolbar-title>{{ "Rejestracja" }}</v-toolbar-title>
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
                      label="Hasło"
                      dense
                      required
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="user.confirmPassword"
                      label="Potwierdź Hasło"
                      dense
                      required
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-file-input
                      v-model="image"
                      label="Logo"
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
            <v-btn color="gray">Zapisz</v-btn>
            <v-btn color="gray">Anuluj</v-btn>
            <v-spacer></v-spacer>
            <v-btn class="login-btn" color="gray"
              >Zaloguj się</v-btn
            >
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
          id: null,
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          logo: "",
        },
        valid: true,
        image: null,
      };
    },
    methods: {
      cancelUserAdding() {
        this.clearForm();
        this.$router.push("/");
      },
      login() {
        this.$router.push("/login");
      },
      clearForm() {
        this.user.id = null;
        this.user.name = "";
        this.user.email = "";
        this.user.password = "";
        this.user.confirmPassword = "";
        this.user.logo = "";
      },
    },
  };
  </script>
  
  <style scoped>
  .register-card {
    width: 100%;
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
    min-height: 40px;
  }

  .v-btn {
    min-width: 80px;
    padding: 4px 8px;
  }
  
  .v-toolbar-title {
    font-size: 20px;
  }
  </style>
  
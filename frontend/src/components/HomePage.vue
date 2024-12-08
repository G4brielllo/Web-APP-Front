<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="auto">
          <NavigationDrawer />
        </v-col>
        <v-col>
          <v-container>
            <v-row justify="center" v-if="welcomeAlert">
              <v-col cols="12" md="8" lg="6">
                <v-alert
                  type="success"
                  dismissible
                  transition="scale-transition"
                  v-model="welcomeAlert"
                >
                  Witaj, {{ userName }}!
                </v-alert>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-card class="mx-auto" max-width="800" elevation="10" rounded>
                  <v-card-title
                    class="headline"
                    style="font-size: 24px; color: #333"
                  >
                    Home Page
                  </v-card-title>
                  <v-card-actions class="flex-container">
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListClients"
                      >
                        Zarządzaj Klientami
                      </v-btn>
                      <v-img :src="user" class="image-item"></v-img>
                    </v-col>
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListProjects"
                      >
                        Zarządzaj Projektami
                      </v-btn>
                      <v-img :src="project" class="image-item"></v-img>
                    </v-col>
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListEstimations"
                      >
                        Zarządzaj Estymacjami
                      </v-btn>
                      <v-img :src="estimation" class="image-item"></v-img>
                    </v-col>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import user from "@/assets/user.png";
import project from "@/assets/project.png";
import estimation from "@/assets/budgeting.png";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import axios from "axios";

import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";
export default {
  name: "HomePage",
  components: {
    NavigationDrawer,
  },
  data() {
    return {
      user: user,
      project: project,
      estimation: estimation,
      isHovered: false,
      welcomeAlert: false,
      userName: "",
      alertShown: false,
      token: false,
    };
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const encryptedData = localStorage.getItem(encryptionKey);
        if (!encryptedData) {
          console.error("Encrypted data not found in localStorage.");
          return;
        }

        let user_information;
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
          user_information = bytes.toString(CryptoJS.enc.Utf8);
          if (!user_information) {
            console.error("Decrypted data is empty or invalid.");
            return;
          }
        } catch (error) {
          console.error("Error decrypting data:", error);
          return;
        }

        const token = localStorage.getItem("jwt_token");
        if (!token) {
          console.error("JWT token is missing. Redirecting to login page...");
          this.$router.push("/login");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          if (!localStorage.getItem("alertShown")) {
            this.welcomeAlert = true;
            localStorage.setItem("alertShown", "true");
            setTimeout(() => {
              this.welcomeAlert = false;
            }, 3000);
          }
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response || error.message
        );
      }
    },

    async logout() {
      try {
        const token = localStorage.getItem("jwt_token");
        console.log(token.value);
        if (!token) {
          console.error("No token found. User is not logged in.");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Logout successful:", response.data);
          localStorage.removeItem("jwt_token");
          this.$router.push("/login");
          localStorage.removeItem("alertShown");
        } else {
          console.error("Logout failed:", response.data);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    goToListClients() {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        this.$router.push("/listClients");
      } else {
        this.goToLogin();
      }
    },
    goToListProjects() {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        this.$router.push("/listProjects");
      } else {
        this.goToLogin();
      }
    },
    goToListEstimations() {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        this.$router.push("/listEstimations");
      } else {
        this.goToLogin();
      }
    },
  },
  goToLogin() {
    this.$router.push("/login");
  },
  goToRegister() {
    this.$router.push("/register");
  },
};
</script>

<style>
.v-navigation-drawer:hover .image-woman {
  width: 100px;
  height: 100px;
}

.headline {
  justify-content: center;
}

.v-card {
  margin: 20px;
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
}

.flex-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-item {
  margin: 10px;
}

.image-item {
  max-width: 100px;
  margin-top: 10px;
}

.position-relative {
  position: relative;
}
</style>

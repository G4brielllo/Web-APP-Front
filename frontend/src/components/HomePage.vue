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
              <v-col cols="12" md="10" lg="8">
                <v-card class="v-card mx-auto" max-width="800" elevation="10" rounded>
                  <p class="headline">Panel Zarządzania</p>
                  <v-row justify="center" class="management-cards">
                    <v-col cols="12" sm="4">
                      <v-card class="action-card flex-container" @click="goToListClients">
                        <v-img :src="user" class="action-image"></v-img>
                        <v-card-title class="card-title">Klienci</v-card-title>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card class="action-card" @click="goToListProjects">
                        <v-img :src="project" class="action-image"></v-img>
                        <v-card-title class="card-title">Projekty</v-card-title>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="4">
                      <v-card class="action-card" @click="goToListEstimations">
                        <v-img :src="estimation" class="action-image"></v-img>
                        <v-card-title class="card-title">Estymacje</v-card-title>
                      </v-card>
                    </v-col>
                  </v-row>
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
import woman from "@/assets/woman.png";
import axios from "axios";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";

export default {
  name: "HomePageComponent",
  components: {
    NavigationDrawer,
  },
  data() {
    return {
      user: user,
      project: project,
      estimation: estimation,
      woman: woman,
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

        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const user_information = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const token = localStorage.getItem("jwt_token");

        if (user_information) {
          const userDataObject = JSON.parse(user_information);
          this.userName = userDataObject.name;
        } else {
          console.error("User information not found in localStorage.");
        }
        if (!token) {
          console.error("No token found. User is not logged in.");
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && !localStorage.getItem("alertShown")) {
          this.welcomeAlert = true;
          localStorage.setItem("alertShown", "true");
          setTimeout(() => {
            this.welcomeAlert = false;
          }, 3000);
        } else {
          console.error("Failed to fetch user data:");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
    goToLogin() {
      this.$router.push("/login");
    },
    goToRegister() {
      this.$router.push("/register");
    },
    toggleHover(value) {
      this.isHovered = value;
    },
    async logout() {
      try {
        const token = localStorage.getItem("jwt_token");

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
  },
};
</script>

<style>
.v-card {
  background-color: #f4f4f9;
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-card {
  text-align: center;
  background-color: white;
  border-radius: 12px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}


.action-image {
  width: 100px;
  height: 100px;
  margin: auto;
  padding: 10px;
}


.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  margin: 10px 0;
}

.headline {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

.management-cards {
  margin-top: 20px;
  gap: 20px;
}

.v-alert {
  margin-bottom: 20px;
}

</style>

<template>
  <v-navigation-drawer
    app
    expand-on-hover
    rail
    permanent
    @mouseover="toggleHover(true)"
    @mouseleave="toggleHover(false)"
  >
    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center position-relative">
        <v-img
          :src="userLogo || woman"
          :class="{
            'image-woman': !isHovered,
            'image-woman-large': isHovered,
          }"
        ></v-img>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item
        :disabled="isCurrentRoute('/')"
        @mouseover="toggleListItemHover(true, 'home')"
        @mouseleave="toggleListItemHover(false, 'home')"
        :class="{ 'list-item-hover': listItemHovered === 'home' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToHomePage()">Home Page</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn()"
        :disabled="isCurrentRoute('/listClients')"
        @mouseover="toggleListItemHover(true, 'clients')"
        @mouseleave="toggleListItemHover(false, 'clients')"
        :class="{ 'list-item-hover': listItemHovered === 'clients' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToListClients()"
          >Clients</v-list-item-title
        >
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn()"
        :disabled="isCurrentRoute('/listProjects')"
        @mouseover="toggleListItemHover(true, 'projects')"
        @mouseleave="toggleListItemHover(false, 'projects')"
        :class="{ 'list-item-hover': listItemHovered === 'projects' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-folder</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToListProjects()"
          >Projects</v-list-item-title
        >
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn()"
        :disabled="isCurrentRoute('/listEstimations')"
        @mouseover="toggleListItemHover(true, 'estimations')"
        @mouseleave="toggleListItemHover(false, 'estimations')"
        :class="{ 'list-item-hover': listItemHovered === 'estimations' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-note</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToListEstimations()"
          >Estimations</v-list-item-title
        >
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn() && isAdmin"
        :disabled="isCurrentRoute('/listUsers')"
        @mouseover="toggleListItemHover(true, 'users')"
        @mouseleave="toggleListItemHover(false, 'users')"
        :class="{ 'list-item-hover': listItemHovered === 'users' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToListUsers()"
          >Users List</v-list-item-title
        >
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn() && !isAdmin"
        @click="editItem()"
        @mouseover="toggleListItemHover(true, 'edit')"
        @mouseleave="toggleListItemHover(false, 'edit')"
        :class="{ 'list-item-hover': listItemHovered === 'edit' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-pencil</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Edit My Data</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-if="isLoggedIn()"
        @click="logout()"
        @mouseover="toggleListItemHover(true, 'logout')"
        @mouseleave="toggleListItemHover(false, 'logout')"
        :class="{ 'list-item-hover': listItemHovered === 'logout' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else
        @click="goToLogin()"
        @mouseover="toggleListItemHover(true, 'login')"
        @mouseleave="toggleListItemHover(false, 'login')"
        :class="{ 'list-item-hover': listItemHovered === 'login' }"
      >
        <v-list-item-icon>
          <v-icon size="x-large">mdi-login</v-icon>
        </v-list-item-icon>
        <v-list-item-title @click="goToLogin()"
          >Login/Register</v-list-item-title
        >
      </v-list-item>

      <v-list-item v-if="userId">
        <v-list-item-icon>
          <v-icon size="x-large">mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Logged in as ID: {{ userId }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from "axios";
import woman from "@/assets/woman.png";

import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";
export default {
  name: "NavigationDrawer",
  data() {
    return {
      woman: woman,
      isHovered: false,
      listItemHovered: null,
      isAdmin: false,
      userId: null,
      userRole: null,
      userLogo: null,
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
          this.userRole = userDataObject.role;
          this.isAdmin = this.userRole === "admin";
          this.userLogo = userDataObject.logo;
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

        if (response.status === 200) {
          const loggedInUserData = response.data;
          this.userId = loggedInUserData.id;
        } else {
          console.error("Failed to fetch user data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    isLoggedIn() {
      const token = localStorage.getItem("jwt_token");
      return !!token;
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
          localStorage.removeItem("user_information");
          localStorage.removeItem("V3ryS3cur3K3y#2024!");
          localStorage.removeItem("alertShown");
          this.$router.push("/login");
        } else {
          console.error("Logout failed:", response.data);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    goToHomePage() {
      this.$router.push("/");
    },
    goToListClients() {
      this.$router.push("/listClients");
    },
    goToListProjects() {
      this.$router.push("/listProjects");
    },
    goToListEstimations() {
      this.$router.push("/listEstimations");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    goToListUsers() {
      this.$router.push("/listUsers");
    },
    editItem() {
      this.$router.push("/editUser");
    },

    isCurrentRoute(route) {
      return this.$route.path === route;
    },
    toggleHover(value) {
      this.isHovered = value;
    },
    toggleListItemHover(value, item) {
      if (value) {
        this.listItemHovered = item;
      } else {
        this.listItemHovered = null;
      }
    },
  },
};
</script>
<style scoped>
.image-woman {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.image-woman-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.position-relative {
  position: relative;
}

.list-item-hover,
.list-item-hover-logged-in {
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.list-item-hover-logged-in {
  color: blue;
}
</style>

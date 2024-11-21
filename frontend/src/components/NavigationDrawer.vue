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

      <v-list-item>
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
import woman from "@/assets/woman.png";

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
  methods: {
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

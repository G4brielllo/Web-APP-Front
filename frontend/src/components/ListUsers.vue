<template>
  <v-app>
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Lista klientów</p>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Wyszukaj"
            single-line
            hide-details
            class="compact-search-field"
          ></v-text-field>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            :search="search"
            class="compact-data-table"
          >
            <template v-slot:[`item.logo`]="{ item }">
              <v-img
                :src="item.logo"
                height="100"
                width="100"
                contain
                class="rounded-image"
              ></v-img>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                color="gray"
                @click="editItem(item)"
                text
                class="compact-btn"
                outlined
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
              <v-btn
                color="gray"
                @click="deleteItem(item)"
                text
                outlined
                class="compact-btn"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="gray" @click="addUser()" class="mx-2">Dodaj</v-btn>
          <v-btn color="gray" @click="returnToHomePage()" class="mx-2"
            >Wróć</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import NavigationDrawer from "@/components/NavigationDrawer.vue";

export default {
  name: "ListUsers",
  components: {
    NavigationDrawer,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "L.p.", value: "id" },
        { text: "Nazwa", value: "name" },
        { text: "email", value: "email" },
        { text: "Akcje", value: "actions", sortable: false },
      ],
      users: [],
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;
      if (this.search) {
        const lowerCaseSearch = this.search.toLowerCase();
        filtered = filtered.filter((user) =>
          user.name.toLowerCase().includes(lowerCaseSearch)
        );
      }
      return filtered;
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/users");
        this.users = response.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          logo: user.logo,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`http://127.0.0.1:8000/users/${userId}`);
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    editUser(userId) {
      this.$router.push({
        path: "/editForAdmin",
        query: { id: userId },
      });
    },
    addUser() {
      this.$router.push("/register");
    },
    returnToHomePage() {
      this.$router.push("/");
    },
  },
  created() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.compact-card {
  background-color: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 1200px;
  margin: auto;
  margin-top: 20px;
}

.toolbar-title {
  width: 30%;
  display: flex;
  font-size: 25px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 16px;
}

.v-btn {
  min-width: 120px;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  width: 20%;  
}

.compact-search-field {
  max-width: 200px;
}

.rounded-image {
  border-radius: 8px;
}

.compact-btn {
  min-width: 64px;
}
</style>

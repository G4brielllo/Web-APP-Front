<template>
  <v-app class="app-container">
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>Lista klientów</v-toolbar-title>
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
          <v-data-table :headers="headers" :items="clients" :search="search">
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
              <template v-if="isAdmin">
                <v-btn
                  color="gray"
                  @click="editItem(item)"
                  text
                  class="compact-btn"
                >
                  Edytuj
                </v-btn>
                <v-btn
                  color="gray"
                  @click="deleteItem(item)"
                  text
                  class="compact-btn"
                  >Usuń</v-btn
                >
              </template>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <template v-if="isAdmin">
            <v-btn color="gray" @click="addClient" class="mx-2">Dodaj</v-btn>
          </template>
          <v-btn color="gray" @click="returnToHomePage" class="mx-2"
            >Wróć</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8000/";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";

export default {
  name: "ListClients",
  components: {
    NavigationDrawer,
  },

  data() {
    return {
      search: "",
      headers: this.getHeaders(),
      userRole: null,
      isAdmin: false,
      clients: [],
      isHovered: false,
    };
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
          this.isAdmin = this.userRole === "Admin";
          this.headers = this.getHeaders();
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
    async fetchClients() {
      try {
        const response = await axios.get("clients");
        this.clients = response.data.map((client) => ({
          id: client.id,
          name: client.name,
          logo: client.logo,
          country: client.country,
          formatted_created_at: this.formatDate(client.created_at),
        }));
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
    formatDate(date) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return new Date(date).toLocaleDateString("pl-PL", options);
    },
    getHeaders() {
      const baseHeaders = [
        { text: "L.p.", value: "id" },
        { text: "Nazwa", value: "name" },
        { text: "Logotyp", value: "logo" },
        { text: "Kraj", value: "country" },
        { text: "Data dodania", value: "formatted_created_at" },
      ];

      if (this.isAdmin) {
        baseHeaders.push({ text: "Akcje", value: "actions", sortable: false });
      }

      return baseHeaders;
    },
    editItem(item) {
      this.$router.push({
        path: "/addClient",
        query: {
          id: item.id,
        },
      });
    },
    async deleteItem(item) {
      try {
        await axios.delete(`http://127.0.0.1:8000/clients/${item.id}`);
        this.fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    },
    returnToHomePage() {
      this.$router.push("/");
    },
    addClient() {
      this.$router.push("/addClient");
    },
  },
  created() {
    this.fetchClients();
    this.fetchUserData();
  },
};
</script>

<style scoped>
@import "~@mdi/font/css/materialdesignicons.css";

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
  margin-bottom: 30%;
}

.compact-search-field {
  max-width: 200px;
}

.rounded-image {
  border-radius: 8px;
}

.app-container {
  max-height: 100px;
}
</style>

<template>
  <v-app class="app-container">
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="d-flex align-center justify-center">
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Lista Wycen</p>
          <v-spacer></v-spacer>
          <v-row align="center">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Wyszukaj"
              single-line
              hide-details
              class="compact-search-field"
            ></v-text-field>
          </v-row>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="estimations"
            :search="search"
            class="compact-data-table"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <template v-if="isAdmin">
                <v-btn
                :menu-props="{ offsetY: true }"
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
            </template>
          </v-data-table>
        </v-card-text>
        <v-row class="operation-buttons">
          <v-col cols="auto">
            <template v-if="isAdmin">
              <v-menu open-on-hover>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="gray" v-bind="attrs" v-on="on">Opcje</v-btn>
                </template>
                <v-list>
                  <v-list-item @click="goToAddEstimation">
                    <v-list-item-title>Dodaj Wycenę</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="goToAddClient">
                    <v-list-item-title>Dodaj Klienta</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="goToAddProject">
                    <v-list-item-title>Dodaj Projekt</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="returnToHomePage">Wróć</v-btn>
          </v-col>
        </v-row>
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
  name: "ListEstimation",
  components: {
    NavigationDrawer,
  },
  data() {
    return {
      search: "",
      estimations: [],
      clients: [],
      projects: [],
      isAdmin: false,
      isHovered: false,
    };
  },
  computed: {
    headers() {
      const baseHeaders = [
        { text: "L.p.", align: "start", sortable: false, value: "id" },
        { text: "Nazwa", value: "name" },
        { text: "Projekt", value: "project_name" },
        { text: "Klient", value: "client_name" },
        { text: "Wycena", value: "type" },
        { text: "Kwota", value: "amount" },
        { text: "Data wykonania", value: "date" },
      ];
      if (this.isAdmin) {
        baseHeaders.push({ text: "Akcje", value: "actions", sortable: false });
      }
      return baseHeaders;
    },
  },
  mounted() {
    this.fetchClients();
    this.fetchProjects();
    this.fetchEstimations();
    this.fetchUserData();
  },
  methods: {
    async fetchClients() {
      try {
        const response = await axios.get("clients");
        this.clients = response.data;
        console.log("Pobrani klienci:", this.clients);
      } catch (error) {
        console.error("Błąd podczas pobierania klientów:", error);
      }
    },

    async fetchProjects() {
      try {
        const response = await axios.get("projects");
        this.projects = response.data;
        console.log("Pobrane projekty:", this.projects);
      } catch (error) {
        console.error("Błąd podczas pobierania projektów:", error);
      }
    },

    async fetchEstimations() {
      try {
        const response = await axios.get("estimations");
        console.log("Pobrane wyceny:", response.data);

        this.estimations = response.data.map((estimation) => {
          const project =
            this.projects.find(
              (project) => project.id === estimation.project_id
            ) || {};
          const client =
            this.clients.find((client) => client.id === project.client_id) ||
            {};

          console.log("Znaleziony klient:", client);
          console.log("Znaleziony projekt:", project);

          return {
            id: estimation.id,
            name: estimation.name,
            type: estimation.type,
            client_name: client ? client.name : "Brak klienta",
            amount: estimation.amount,
            date: this.formatDate(estimation.date),
            project_name: project ? project.name : "Brak projektu",
          };
        });
      } catch (error) {
        console.error("Błąd podczas pobierania wycen:", error);
      }
    },
    async fetchUserData() {
      try {
        const encryptedData = localStorage.getItem(encryptionKey);
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const user_information = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const token = localStorage.getItem("jwt_token");

        if (user_information) {
          const userDataObject = JSON.parse(user_information);
          this.isAdmin = userDataObject.role === "Admin";
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
    async deleteItem(item) {
      try {
        await axios.delete(`http://127.0.0.1:8000/estimations/${item.id}`);
        this.estimations = this.estimations.filter(
          (estimation) => estimation.id !== item.id
        );
      } catch (error) {
        console.error("Error deleting estimation:", error);
      }
    },

    returnToHomePage() {
      this.$router.push("/");
    },

    goToAddEstimation() {
      this.$router.push("/addEstimation");
    },

    goToAddClient() {
      this.$router.push("/addClient");
    },

    goToAddProject() {
      this.$router.push("/addProject");
    },
    goToLogin() {
      this.$router.push("/login");
    },
    toggleHover(value) {
      this.isHovered = value;
    },

    editItem(item) {
      this.$router.push({ path: "/addEstimation", query: { id: item.id } });
    },

    formatDate(date) {
      const options = { day: "numeric", month: "long", year: "numeric" };
      return new Date(date).toLocaleDateString("pl-PL", options);
    },
  },
};
</script>

<style scoped>
@import "~@mdi/font/css/materialdesignicons.css";

.toolbar-title {
  width: 30%;
  display: flex;
  font-size: 25px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 16px;
}
.compact-btn {
  margin-bottom: 10%;
  margin-top: 10%;
  border-width: 20px;
}
.compact-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 80%;
  max-width: 1200px;
  margin-bottom: 30px;
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}
.v-btn {
  min-width: 120px;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  width: 20%;  
}
.compact-search-field {
  width: 100px;
  margin-right: 10px;
}

.compact-data-table {
  margin-top: 20px;
}

.operation-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

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

.user-info {
  padding: 8px;
  text-align: center;
}
</style>

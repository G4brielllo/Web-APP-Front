<template>
  <v-app class="app-container">
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="fill-height justify-center">
      <v-card class="expanded-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>Lista Projektów</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Wyszukaj"
                single-line
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                :items="clients"
                item-text="name"
                item-value="id"
                label="Wybierz klienta"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4"> </v-col>
          </v-row>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="projects"
            :search="search"
            :item-key="'id'"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <template v-if="isAdmin">
                <v-btn color="gray" @click="editProject(item)" text
                  >Edytuj</v-btn
                >
                <v-btn color="gray" @click="deleteProject(item)" text
                  >Usuń</v-btn
                >
              </template>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions class="d-flex justify-center">
          <template v-if="isAdmin">
            <v-btn class="mx-2" color="gray" @click="addProject">Dodaj</v-btn>
          </template>
          <v-btn class="mx-2" color="gray" @click="returnToHomePage"
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
  name: "ListProjects",
  components: {
    NavigationDrawer,
  },

  data() {
    return {
      search: "",
      headers: this.getHeaders(),
      clients: [],
      isAdmin: false,
      estimations: [],
      projects: [],
    };
  },

  methods: {
    getHeaders() {
      const baseHeaders = [
        { text: "L.p.", align: "start", value: "id" },
        { text: "Klient", value: "client_name" },
        { text: "Nazwa Projektu", value: "name" },
        {
          text: "Szacunkowa Wartość",
          value: "total_estimation",
          sortable: false,
        },
        { text: "Data dodania", value: "formatted_created_at" },
      ];

      if (this.isAdmin) {
        baseHeaders.push({ text: "Akcje", value: "actions", sortable: false });
      }

      return baseHeaders;
    },
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
    async fetchProjects() {
      try {
        const response = await axios.get("projects");
        this.projects = response.data.map((project) => {
          const client = this.clients.find(
            (client) => client.id === project.client_id
          );
          const estimation = this.estimations.find(
            (estimate) => estimate.project_id === project.id
          );

          return {
            id: project.id,
            name: project.name,
            client_id: project.client_id,
            client_name: client ? client.name : "Brak klienta",
            total_estimation: estimation ? estimation.amount : "brak wyceny",
            formatted_created_at: this.formatDate(project.created_at),
          };
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async fetchClients() {
      try {
        const response = await axios.get("clients");
        this.clients = response.data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
    async fetchEstimations() {
      try {
        const response = await axios.get("estimations");
        this.estimations = response.data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
    addProject() {
      this.$router.push("/addProject");
    },
    formatDate(date) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return new Date(date).toLocaleDateString("pl-PL", options);
    },

    returnToHomePage() {
      this.$router.push("/");
    },
  },

  async created() {
    await this.fetchClients();
    await this.fetchEstimations();
    await this.fetchProjects();
  },
};
</script>

<style scoped>
.expanded-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 90%;
  width: 82%;
  max-width: 1200px;
}

body {
  overflow: hidden;
}

.rounded-image {
  border-radius: 8px;
}

.user-info {
  padding: 8px;
  text-align: center;
}

.fill-height {
  height: 100vh;
}
</style>

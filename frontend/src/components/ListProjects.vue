<template>
  <v-app class="app-container">
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="fill-height justify-center">
      <v-card class="expanded-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Lista Projektów</p>
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Wyszukaj"
            single-line
            class="compact-search-field"
          ></v-text-field>

          <v-autocomplete
            :items="clients"
            item-text="name"
            item-value="id"
            label="Wybierz klienta"
            class="compact-autocomplete"
          ></v-autocomplete>
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
import woman from "@/assets/woman.png";
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
      selectedClient: null,
      selectedDate: null,
      datePicker: false,
      woman: woman,
      isAdmin: false,
      isHovered: false,
      headers: this.getHeaders(),
      clients: [],
      projects: [],
      estimations: [],
    };
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;

      if (this.search) {
        const lowerCaseSearch = this.search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerCaseSearch) ||
            item.client_name.toLowerCase().includes(lowerCaseSearch)
        );
      }

      if (this.selectedClient) {
        filtered = filtered.filter(
          (item) => item.client_id === this.selectedClient
        );
      }

      if (this.selectedDate) {
        const selectedDate = new Date(this.selectedDate);
        filtered = filtered.filter((item) => {
          const projectDate = new Date(item.created_at);
          return projectDate.toDateString() === selectedDate.toDateString();
        });
      }

      return filtered;
    },
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
        const response = await axios.get("http://127.0.0.1:8000/projects");
        this.projects = response.data.map((project) => {
          const client = this.clients.find(
            (client) => client.id === project.client_id
          );
          return {
            id: project.id,
            name: project.name,
            client_id: project.client_id,
            client_name: client ? client.name : "Brak klienta",
            total_estimation: this.calculateTotalEstimation(project.id),
            formatted_created_at: this.formatDate(project.created_at),
            created_at: project.created_at,
          };
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async fetchClients() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/clients");
        this.clients = response.data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
    async fetchEstimations() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/estimations");
        this.estimations = response.data;
        this.updateProjectEstimations();
      } catch (error) {
        console.error("Error fetching estimations:", error);
      }
    },
    addProject() {
      this.$router.push("/addProject");
    },
    async deleteItem(item) {
      try {
        await axios.delete(`http://127.0.0.1:8000/projects/${item.id}`);
        this.fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    editItem(project) {
      this.$router.push({ path: "/addProject", query: { id: project.id } });
    },
    updateProjectEstimations() {
      this.projects = this.projects.map((project) => ({
        ...project,
        total_estimation: this.calculateTotalEstimation(project.id),
      }));
    },
    calculateTotalEstimation(projectId) {
      const projectEstimations = this.estimations.filter(
        (estimation) => estimation.project_id === projectId
      );
      return projectEstimations.reduce(
        (sum, estimation) => sum + (parseFloat(estimation.amount) || 0),
        0
      );
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
    await this.fetchProjects();
    await this.fetchEstimations();

    this.fetchUserData();
  },
};
</script>

<style scoped>
.expanded-card {
  background-color: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 90%;
  width: 82%;
  max-width: 1200px;
}
.v-btn {
  min-width: 120px;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  width: 20%;
}
.compact-btn {
  margin-bottom: 10%;
  margin-top: 10%;
  border-width: 20px;
}

.compact-search-field,
.compact-autocomplete {
  margin-left: 5%;
  max-width: 200px;
}
.v-toolbar{
  padding-top: 10px;
}
.toolbar-title {
  width: 30%;
  display: flex;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 16px;
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

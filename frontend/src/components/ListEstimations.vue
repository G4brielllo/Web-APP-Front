<template>
  <v-app class="app-container">
    <v-container class="d-flex align-center justify-center">
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>Lista Wycen</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-row align="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Wyszukaj"
                single-line
                hide-details
                class="compact-search-field"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="estimations"
            :search="search"
            class="compact-data-table"
          >
          </v-data-table>
        </v-card-text>
        <v-row class="operation-buttons">
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

export default {
  name: "ListEstimation",
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

      return baseHeaders;
    },
  },
  mounted() {
    this.fetchClients();
    this.fetchProjects();
    this.fetchEstimations();
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
          const client = this.clients.find(client => client.id === estimation.client_id);
          const project = this.projects.find(project => project.id === estimation.project_id);

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

v-col,
v-container {
  flex-direction: column;
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

.compact-search-field {
  width: 300px;
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

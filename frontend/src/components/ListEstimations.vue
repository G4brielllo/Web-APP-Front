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

export default {
  name: "ListEstimation",
  data() {
    return {
      search: "",
      estimations: [],
      isAdmin: false,
      isHovered: false,
    };
  },
  computed: {
    headers() {
      const baseHeaders = [
        { text: "L.p.", align: "start", sortable: false, value: "id" },
        { text: "Nazwa", value: "name" },
        { text: "Projekt", value: "project.name" },
        { text: "Klient", value: "client.name" },
        { text: "Wycena", value: "type" },
        { text: "Kwota", value: "amount" },
        { text: "Data wykonania", value: "date" },
      ];

      return baseHeaders;
    },
  },
  mounted() {
    this.fetchEstimations();
  },
  methods: {

    async fetchEstimations() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/estimations"
        );
        this.estimations = response.data.map((estimation) => ({
          id: estimation.id,
          name: estimation.name,
          type: estimation.type,
          amount: estimation.amount,
          date: this.formatDate(estimation.date),
          project: estimation.project,
          // client: estimation.project.client,
        }));
      } catch (error) {
        console.error("Error fetching estimations:", error);
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

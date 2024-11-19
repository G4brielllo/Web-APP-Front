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
              <template>
                <v-btn
                  color="gray"
                  @click="editItem(item)"
                  text
                  class="compact-btn"
                  >
                  Edytuj
                </v-btn>
                
              </template>
              </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="gray" @click="addClient" class="mx-2">Dodaj</v-btn>
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
      isAdmin: true,
      clients: [],
      isHovered: false,
    };
  },
  methods: {
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

     
        baseHeaders.push({ text: "Akcje", value: "actions", sortable: false });
  

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
    returnToHomePage() {
      this.$router.push("/");
    },
    addClient() {
      this.$router.push("/addClient");
    },
   
  },
  created() {
    this.fetchClients();
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

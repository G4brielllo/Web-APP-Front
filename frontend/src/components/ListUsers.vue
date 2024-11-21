<template>
    <v-app>
      <v-col cols="auto">
        <NavigationDrawer />
      </v-col>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card class="compact-card">
          <v-toolbar color="black" dark>
            <v-toolbar-title>Lista użytkowników</v-toolbar-title>
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
              <template>
                <v-img
                  :src="item.logo"
                  height="100"
                  width="100"
                  contain
                  class="rounded-image"
                ></v-img>
              </template>
              <template>
                <v-btn
                  color="gray"
                  text
                  class="compact-btn"
                  >Edytuj</v-btn
                >
                <v-btn
                  color="gray"
                  text
                  class="compact-btn"
                  >Usuń</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="gray" class="mx-2">Dodaj</v-btn>
            <v-btn color="gray" class="mx-2"
              >Wróć</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-container>
    </v-app>
  </template>
  
  <script>
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
      };
    },
 
    methods: {
      returnToHomePage() {
        this.$router.push("/");
      },
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
  
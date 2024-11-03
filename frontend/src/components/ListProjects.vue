<template>
  <v-app class="app-container">
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
          <v-data-table :search="search" :item-key="'id'"> 
            
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
         
          <v-btn class="mx-2" color="gray" @click="returnToHomePage"
            >Wróć</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "ListProjects",

  data() {
    return {
      search: "",
      isAdmin: false,
      isHovered: false,
      clients: [],
      projects: [],
      estimations: [],
    };
  },
  methods:{
    returnToHomePage() {
      this.$router.push("/");
    },
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

<template>
  <v-app class="app-container">
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
          <v-data-table
            :search="search"
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
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="gray" @click="returnToHomePage" class="mx-2"
            >Wróć</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "ListClients",

  data() {
    return {
      search: "",
      userRole: null,
      isAdmin: false,
      clients: [],
      isHovered: false,
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

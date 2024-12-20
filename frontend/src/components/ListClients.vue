<template>
  <v-app class="app-container">
    <v-col cols="auto">
      <NavigationDrawer />
    </v-col>
    <v-container class="fill-height align-center justify-center">
      <v-card class="compact-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">Lista Klientów</p>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Wyszukaj"
            single-line
            hide-details
            class="compact-search-field"
          ></v-text-field>
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="menuDate"
                label="Wybierz datę"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                clearable
                hide-details
                class="compact-date-field"
              ></v-text-field>
            </template>
            <template>
              <v-container>
                <v-row justify="space-around">
                  <v-date-picker
                    elevation="24"
                    v-model="menuDate"
                    @input="menu = false"
                    color="black"
                    no-title
                  ></v-date-picker>
                </v-row>
              </v-container>
            </template>
          </v-menu>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="filteredClients"
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
            <template v-if="isAdmin" v-slot:[`item.actions`]="{ item }">
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
          </v-data-table>
        </v-card-text>
        <v-card-actions class="justify-center">
          <template v-if="isAdmin">
            <v-btn color="gray" @click="addClient">Dodaj</v-btn>
          </template>
          <v-btn color="gray" @click="returnToHomePage"
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
import woman from "@/assets/woman.png";
import '@mdi/font/css/materialdesignicons.css';
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import CryptoJS from "crypto-js";

const encryptionKey = "V3ryS3cur3K3y#2024!";

export default {
  name: "ListClients",
  icons:{
    add: 'add',
  },
  components: {
    NavigationDrawer,
  },

  data() {
    return {
      search: "",
      menu: false,
      userRole: null,
      isAdmin: false,
      menuDate: null,
      woman: woman,
      headers: this.getHeaders(),
      clients: [],
      isHovered: false,
    };
  },
  computed: {
    filteredClients() {
      let filtered = this.clients;
      if (this.search) {
        const lowerCaseSearch = this.search.toLowerCase();
        filtered = filtered.filter((client) =>
          client.name.toLowerCase().includes(lowerCaseSearch)
        );
      }
      if (this.menuDate) {
        const selectedDate = new Date(this.menuDate);
        filtered = filtered.filter((client) => {
          const clientDate = new Date(client.created_at);
          return this.compareDates(clientDate, selectedDate);
        });
      }
      return filtered;
    },
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
          created_at: client.created_at,
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
    compareDates(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },
  },
  created() {
    this.fetchClients();
    this.fetchUserData();
  },
};
</script>

<style scoped>

.fill-height {
  height: 100vh;
}
.toolbar-title {
  width: 30%;
  display: flex;
  font-size: 25px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 16px;
}
.align-center {
  align-items: center;
}
.v-btn {
  min-width: 120px;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  width: 20%;  
}
.compact-btn{
  margin-bottom: 1%;
  margin-top: 2%;
  border-width: 20px;
}
.compact-search-field,
.compact-date-field {
  margin-left: 5%;
  max-width: 200px;
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

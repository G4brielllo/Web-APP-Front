<template>
  <v-app>
    <v-container>
      <v-card class="elevation-4 compact-card">
        <v-toolbar color="black" dark>
          <p class="toolbar-title">
            {{ isNewClient ? "Dodaj klienta" : "Edytuj klienta" }}
          </p>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="client.name"
                    label="Nazwa"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="client.email"
                    outlined
                    label="Email"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="client.description"
                    outlined
                    label="Opis"
                    rows="3"
                    dense
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="image"
                    outlined
                    label="Logo"
                    accept="image/*"
                    @change="createBase64Image"
                    dense
                  ></v-file-input>
                  <div v-if="client.logo">
                    <img
                      :src="client.logo"
                      alt="Client Logo"
                      style="max-width: 100px; max-height: 100px"
                    />
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="client.country"
                    :menu-props="{ offsetY: true }"
                    outlined
                    :items="countries"
                    label="Kraj"
                    dense
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="gray" @click="saveClient" :disabled="!valid">{{
            isNewClient ? "Dodaj" : "Zapisz"
          }}</v-btn>
          <v-btn color="gray" @click="cancelClientAdding">Anuluj</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      client: {
        id: null,
        name: "",
        email: "",
        description: "",
        logo: null,
        country: "",
      },
      countries: ["Poland", "Germany", "France", "Italy", "Spain"],
      valid: true,
      isNewClient: true,
      image: null,
      base64: null,
    };
  },
  created() {
    if (this.$route.query.id) {
      this.isNewClient = false;
      this.fetchClientDetails(this.$route.query.id);
    }
  },
  methods: {
    async fetchClientDetails(clientId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/clients/${clientId}`
        );
        const clientData = response.data;

        this.client.id = clientData.id;
        this.client.name = clientData.name;
        this.client.email = clientData.email;
        this.client.description = clientData.description;
        this.client.country = clientData.country;
        this.client.logo = clientData.logo;

        if (this.isImageUrl(clientData.logo)) {
          await this.fetchImageUrl(clientData.logo);
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
      }
    },

    async fetchImageUrl(url) {
      try {
        const response = await axios.get(url, { responseType: "blob" });
        const reader = new FileReader();
        reader.onload = (event) => {
          this.base64 = event.target.result;
        };
        reader.readAsDataURL(response.data);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    },

    async saveClient() {
      if (this.$refs.form.validate()) {
        try {
          const formdata = {
            name: this.client.name,
            email: this.client.email,
            description: this.client.description,
            country: this.client.country,
          };

          if (this.image) {
            formdata.logo = this.base64;
          }

          let response;
          if (this.isNewClient) {
            response = await axios.post(
              "http://127.0.0.1:8000/clients",
              formdata
            );
          } else {
            response = await axios.put(
              `http://127.0.0.1:8000/clients/${this.client.id}`,
              formdata
            );
          }

          if (response.status === 200 || response.status === 201) {
            console.log("Client saved successfully:", response.data);
            this.clearForm();
            this.$router.push("/listClients");
          } else {
            console.error("Error saving client:", response.data);
          }
        } catch (error) {
          console.error("Error saving client:", error.response?.data || error);
        }
      }
    },

    cancelClientAdding() {
      this.clearForm();
      this.$router.push("/listClients");
    },

    clearForm() {
      this.client.id = null;
      this.client.name = "";
      this.client.email = "";
      this.client.description = "";
      this.client.logo = null;
      this.client.country = "";
      this.base64 = null;
      this.image = null;
    },

    createBase64Image(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.base64 = event.target.result;
        this.client.logo = this.base64;
      };
      reader.readAsDataURL(file);
    },

    isImageUrl(url) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    },
  },
};
</script>

<style scoped>
.compact-card {
  max-height: 100%;
  max-width: 600px;
  border-radius: 12px;
  margin: auto;
  padding: 16px;
}
.v-card-actions{
  justify-content: center;
  display: flex;
}


.v-btn {
  min-width: 120px;
  padding: 4px 8px;
  display: flex;
  justify-content: center;
  width: 20%;
}

.toolbar-title {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 25px;
  font-weight: 700;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>

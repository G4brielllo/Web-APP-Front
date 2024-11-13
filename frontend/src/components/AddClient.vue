<template>
  <v-app>
    <v-container>
      <v-card class="elevation-4 compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>{{
            isNewClient ? "Dodaj klienta" : "Edytuj klienta"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="client.name"
                    label="Nazwa"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="client.email"
                    label="Email"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="client.description"
                    label="Opis"
                    rows="3"
                    dense
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-file-input
                    v-model="image"
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
        <v-card-actions class="compact-actions">
          <v-btn color="gray" @click="saveClient" :disabled="!valid">{{
            isNewClient ? "Dodaj" : "Zapisz zmiany"
          }}</v-btn>
          <v-btn color="gray" @click="cancelClientAdding">Anuluj</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "@/axios";

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
          `http://127.0.0.1:8000/api/clients/${clientId}`
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
          const formData = new FormData();
          formData.append("name", this.client.name);
          formData.append("email", this.client.email);
          formData.append("description", this.client.description);
          formData.append("country", this.client.country);

          if (this.image) {
            formData.append("logo", this.base64);
          }

          let response;
          if (this.isNewClient) {
            response = await axios.post(
              "http://127.0.0.1:8000/api/clients",
              formData
            );
          } else {
            response = await axios.put(
              `http://127.0.0.1:8000/api/clients/${this.client.id}`,
              formData
            );
          }

          if (response.status === 200 || response.status === 201) {
            console.log("Client saved successfully:", response.data);
            this.clearForm();
            this.$router.push("/");
          } else {
            console.error("Error saving client:", response.data);
          }
        } catch (error) {
          console.error("Error saving client:", error);
        }
      }
    },

    cancelClientAdding() {
      this.clearForm();
      this.$router.push("/");
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
  max-width: 80%;
  border-radius: 12px;
  margin: auto;
  padding: 16px;
}

.compact-form {
  padding: 0;
}

.compact-actions {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.v-card-title {
  font-size: 18px;
  padding: 8px 0;
}

.v-text-field,
.v-select,
.v-textarea,
.v-radio-group {
  margin-bottom: 4px;
}

.v-text-field,
.v-select,
.v-textarea,
.v-radio-group {
  min-height: 40px;
}

.v-btn {
  min-width: 80px;
  padding: 4px 8px;
}

.v-toolbar-title {
  font-size: 20px;
}
</style>

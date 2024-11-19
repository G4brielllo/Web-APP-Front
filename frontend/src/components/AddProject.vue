<template>
  <v-app>
    <v-container>
      <v-card class="elevation-4">
        <v-toolbar color="black" dark>
          <v-toolbar-title>{{
            isNewProject ? "Dodaj Projekt" : "Edytuj Projekt"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="project.name"
                    label="Nazwa"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="project.description"
                    label="Opis"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="project.client"
                    :items="clients"
                    item-text="name"
                    item-value="id"
                    label="Klient"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="gray" @click="saveProject">{{
            isNewProject ? "Dodaj" : "Zapisz zmiany"
          }}</v-btn>
          <v-btn color="gray" @click="cancelProjectAdding">Anuluj</v-btn>
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
      project: {
        id: null,
        name: "",
        description: "",
        client: null,
      },
      clients: [],
      valid: true,
      isNewProject: true,
    };
  },
  created() {
    this.fetchClients();
    if (this.$route.query.id) {
      this.isNewProject = false;
      this.fetchProjectDetails(this.$route.query.id);
    }
  },
  methods: {
    async fetchProjectDetails(projectId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/projects/${projectId}`
        );
        const projectData = response.data;

        this.project.id = projectData.id;
        this.project.name = projectData.name;
        this.project.description = projectData.description;
        this.project.client = projectData.client_id;
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    },

    async saveProject() {
      if (this.$refs.form.validate()) {
        try {
          let response;
          if (this.isNewProject) {
            response = await axios.post("http://127.0.0.1:8000/api/projects", {
              name: this.project.name,
              description: this.project.description,
              client_id: this.project.client,
            });
          } else {
            response = await axios.put(
              `http://127.0.0.1:8000/api/projects/${this.project.id}`,
              {
                name: this.project.name,
                description: this.project.description,
                client_id: this.project.client,
              }
            );
          }

          if (response.status === 201 || response.status === 200) {
            console.log("Project saved successfully:", response.data);
            this.clearForm();
            this.$router.push("/");
          } else {
            console.error("Error saving project:", response.data);
          }
        } catch (error) {
          console.error("Error saving project:", error);
        }
      }
    },

    cancelProjectAdding() {
      this.clearForm();
      this.$router.push("/");
    },

    clearForm() {
      this.project.id = null;
      this.project.name = "";
      this.project.description = "";
      this.project.client = null;
    },

    async fetchClients() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/clients");
        this.clients = response.data;
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    },
  },
};
</script>

<style scoped></style>

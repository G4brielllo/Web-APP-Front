<template>
  <v-app>
    <v-container>
      <v-card class="elevation-4 compact-card">
        <v-toolbar color="black" dark>
          <v-toolbar-title>{{
            isNewEstimation ? "Dodaj wycenę" : "Edytuj wycenę"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" class="compact-form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="estimation.name"
                    label="Nazwa"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="estimation.description"
                    label="Opis"
                    rows="2"
                    dense
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="estimation.project_id"
                    :items="projects"
                    label="Projekt"
                    item-text="name"
                    item-value="id"
                    dense
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
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
                        v-model="estimation.date"
                        label="Data"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        clearable
                        hide-details
                        class="compact-date-field"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="estimation.date"
                      no-title
                      @input="onDatePickerInput"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-radio-group
                    v-model="estimation.type"
                    label="Rodzaj wyceny"
                    dense
                  >
                    <v-radio value="hourly" label="Godzinowa"></v-radio>
                    <v-radio value="fixed" label="Fixed Price"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="estimation.amount"
                    label="Wycena"
                    dense
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions class="compact-actions">
          <v-btn color="gray" @click="saveEstimation" small>{{
            isNewEstimation ? "Dodaj" : "Zapisz"
          }}</v-btn>
          <v-btn color="gray" @click="cancelEstimationAdding" small
            >Anuluj</v-btn
          >
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
      estimation: {
        name: "",
        description: "",
        project_id: null,
        date: new Date().toISOString().substr(0, 10),
        type: "hourly",
        amount: "",
      },
      projects: [],
      valid: true,
      isNewEstimation: true,
      menu: false,
    };
  },
  created() {
    this.fetchProjects();

    if (this.$route.query.id) {
      this.isNewEstimation = false;
      this.fetchEstimationDetails(this.$route.query.id);
    }
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/projects");
        this.projects = response.data;
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    },
    async fetchEstimationDetails(estimationId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/estimations/${estimationId}`
        );
        const estimationData = response.data;

        this.estimation.name = estimationData.name;
        this.estimation.description = estimationData.description;
        this.estimation.project_id = estimationData.project_id;
        this.estimation.date = estimationData.date;
        this.estimation.type = estimationData.type;
        this.estimation.amount = estimationData.amount;
      } catch (error) {
        console.error("Error fetching estimation details:", error);
      }
    },
    async saveEstimation() {
      if (this.$refs.form.validate()) {
        try {
          let response;
          if (this.isNewEstimation) {
            response = await axios.post(
              "http://127.0.0.1:8000/estimations",
              this.estimation
            );
          } else {
            response = await axios.put(
              `http://127.0.0.1:8000/estimations/${this.$route.query.id}`,
              this.estimation
            );
          }

          if (response.status === 201 || response.status === 200) {
            console.log("Estimation saved successfully:", response.data);
            this.clearForm();
            this.$router.push("/listEstimations");
          } else {
            console.error("Error saving estimation:", response.data);
          }
        } catch (error) {
          console.error("Error saving estimation:", error);
        }
      }
    },
    cancelEstimationAdding() {
      this.clearForm();
      this.$router.push("/");
    },
    clearForm() {
      this.estimation.name = "";
      this.estimation.description = "";
      this.estimation.project_id = null;
      this.estimation.date = new Date().toISOString().substr(0, 10);
      this.estimation.type = "hourly";
      this.estimation.amount = "";
    },
    onDatePickerInput(date) {
      this.estimation.date = date;
      this.menu = false;
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

.v-date-picker {
  width: auto !important;
  max-width: 290px !important;
}
</style>

<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col>
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="8" lg="6">
                <v-card class="mx-auto" max-width="800" elevation="10" rounded>
                  <v-card-title
                    class="headline"
                    style="font-size: 24px; color: #333"
                  >
                    Home Page
                  </v-card-title>
                  <v-card-actions class="flex-container">
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListClients"
                      >
                        Zarządzaj Klientami
                      </v-btn>
                      <v-img :src="user" class="image-item"></v-img>
                    </v-col>
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListProjects"
                      >
                        Zarządzaj Projektami
                      </v-btn>
                      <v-img :src="project" class="image-item"></v-img>
                    </v-col>
                    <v-col cols="12" sm="4" class="flex-column-center">
                      <v-btn
                        class="flex-item"
                        color="black"
                        dark
                        @click="goToListEstimations"
                      >
                        Zarządzaj Estymacjami
                      </v-btn>
                      <v-img :src="estimation" class="image-item"></v-img>
                    </v-col>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import user from "@/assets/user.png";
import project from "@/assets/project.png";
import estimation from "@/assets/budgeting.png";

export default {
  name: 'HomePage',
  data() {
    return {
      user: user,
      project: project,
      estimation: estimation,
      isHovered: false,
      userName: "",
    };
  },
  methods:{
    goToListClients() {

        this.$router.push("/listClients");

    },
    goToListProjects() {

        this.$router.push("/listProjects");

    },
    goToListEstimations() {
        this.$router.push("/listEstimations");
    },
  }
};
</script>

<style>
.headline {
  justify-content: center;
}

.v-card {
  margin: 20px;
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
}

.flex-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-item {
  margin: 10px;
}

.image-item {
  max-width: 100px;
  margin-top: 10px;
}

.position-relative {
  position: relative;
}


</style>


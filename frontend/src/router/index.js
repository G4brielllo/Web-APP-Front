import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ListClients from "@/components/ListClients.vue";
import ListProjects from "@/components/ListProjects.vue";
import ListEstimations from "@/components/ListEstimations.vue";
import AddClient from '@/components/AddClient.vue';
import AddProject from '@/components/AddProject.vue';
import AddEstimation from '@/components/AddEstimation.vue';


Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", name: "HomePage", component: HomePage, },
    { path: "/listClients", name: "ListClients", component: ListClients, },
    { path: "/listProjects", name: "ListProjects", component: ListProjects, },
    { path: "/listEstimations", name: "ListEstimations", component: ListEstimations, },
    { path: "/addClient", component: AddClient },
    { path: "/addProject", component: AddProject },
    { path: "/addEstimation", component: AddEstimation },
  ],
});

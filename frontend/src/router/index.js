import Vue from "vue";
import Router from "vue-router";
import HomePage from "@/components/HomePage.vue";
import ListClients from "@/components/ListClients.vue";
import ListProjects from "@/components/ListProjects.vue";
import ListEstimations from "@/components/ListEstimations.vue";
import AddClient from '@/components/AddClient.vue';
import AddProject from '@/components/AddProject.vue';
import AddEstimation from '@/components/AddEstimation.vue';
import AuthLogin from '@/components/AuthLogin.vue';
import AuthRegister from "@/components/AuthRegister.vue";
import ListUsers from "@/components/ListUsers.vue";
import AuthEditForAdmin from "@/components/AuthEditForAdmin.vue";
import AuthEditForUser from "@/components/AuthEditForUser.vue";
import AuthEmailToResetPassword from "@/components/AuthEmailToResetPassword.vue";



Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", name: "HomePage", component: HomePage, },
    { path: "/listClients", component: ListClients, },
    { path: "/listProjects", component: ListProjects, },
    { path: "/listEstimations", component: ListEstimations, },
    { path: "/addClient", component: AddClient },
    { path: "/addProject", component: AddProject },
    { path: "/addEstimation", component: AddEstimation },
    { path: '/login', component: AuthLogin },
    { path: '/register', component: AuthRegister },
    { path: "/listUsers", component: ListUsers, },
    { path: "/editForAdmin", component: AuthEditForAdmin, },
    { path: "/editUser", component: AuthEditForUser, },
    { path: "/confirmEmail", component: AuthEmailToResetPassword, },
  ],
});

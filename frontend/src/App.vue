<template>
  <v-app>
   <router-view></router-view>
 </v-app>
</template>

<script>

export default {
 name: "App",
};
</script>

<style>
* {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
}

#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;

 width: 100%;
 height: 100%;
 background-color: #F3F3F3;
 background-image: linear-gradient(0deg, transparent 24%, #E1E1E1 25%, #E1E1E1 26%, transparent 27%, transparent 74%, #E1E1E1 75%, #E1E1E1 76%, transparent 77%, transparent),
     linear-gradient(90deg, transparent 24%, #E1E1E1 25%, #E1E1E1 26%, transparent 27%, transparent 74%, #E1E1E1 75%, #E1E1E1 76%, transparent 77%, transparent);
 background-size: 55px 55px;

}
</style>

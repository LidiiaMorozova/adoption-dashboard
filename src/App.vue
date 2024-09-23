<template>
  <AdoptionDashboard/>
</template>

<script>
import AdoptionDashboard from "@/pages/AdoptionDashboard.vue";
export default {
  name: 'App',
  components: {
    AdoptionDashboard
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: #F3F3F3;
}

#app {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

body {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

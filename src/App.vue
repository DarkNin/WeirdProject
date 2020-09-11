<template>
  <div id="app">
    <router-view/>
    <logout-btn />
  </div>
</template>
<script>
import LogoutBtn from "@/components/LogoutBtn.vue";
export default {
  components: {
    LogoutBtn
  }
}
</script>
<style>
body {
  background: url("./assets/background.jpg");
  animation: weirdScroll 60s linear infinite;
  padding: 0;
  margin: 0;
}
@keyframes weirdScroll {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 512px -512px;
  }
}

</style>

<style scoped>
#app {
  font-family: 微软雅黑 Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 80vh;
  max-width: 2000px;
  margin: 0 auto;
  position: relative;
}

</style>

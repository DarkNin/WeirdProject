<template>
  <div id="app">
    <router-view/>
    <account-btn v-if="$route.path !== '/'"/>
  </div>
</template>
<script>
import AccountBtn from "@/components/AccountBtn.vue";
export default {
  components: {
    AccountBtn
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
.el-notification__content {
  white-space: pre-wrap;
}


</style>

<style scoped>
#app {
  font-family: 微软雅黑 Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 98vh;
  max-width: 2000px;
  margin: 0 auto;
  position: relative;
}

</style>

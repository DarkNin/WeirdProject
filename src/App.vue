<template>
  <div id="app">
    <router-view />
    <account-btn v-if="$route.path !== '/'" />
  </div>
</template>
<script>
import AccountBtn from "@/components/AccountBtn.vue";
export default {
  components: {
    AccountBtn,
  },
};
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
*::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  /*-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  background: rgba(225, 225, 225, 0.93);
}

*::-webkit-scrollbar-track {
  /*-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  border-radius: 10px;
  background: rgba(246, 246, 246, 0.59);
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

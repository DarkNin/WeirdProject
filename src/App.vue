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
  mounted() {
    //根据系统状态进行切换
    /* if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.getElementsByClassName("darkmode-toggle")[0].click();
    } */
    //根据storage存储状态切换
    let darkStatus = window.localStorage.getItem("isDarkMode");
    if (JSON.parse(darkStatus)) {
      document.getElementsByClassName("darkmode-toggle")[0].click();
    }
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
.darkmode-layer,
.darkmode-toggle {
  z-index: 65535;
}
.darkmode-layer {
  margin-left: -100px;
  margin-top: -100px;
}
.darkmode-layer.darkmode-layer--expanded {
  margin: unset;
}
.darkmode-toggle {
  width: 0.9rem !important;
  height: 0.9rem !important;
  opacity: 0;
  top: -10px !important;
  right: -10px !important;
}
/* .darkmode-toggle:hover {
  opacity: 0.8;
} */
body.darkmode--activated img,
body.darkmode--activated .darkmode-ignore {
  mix-blend-mode: difference;
}
.darkmode-background {
  animation: weirdScroll 60s linear infinite;
}
</style>

<style scoped>
#app {
  font-family: 微软雅黑 Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  max-width: 2000px;
  margin: 0 auto;
  position: relative;
}
</style>

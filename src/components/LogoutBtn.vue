<template>
  <div class="logout-btn-wrap">
    <el-button class="logout-btn" icon="el-icon-switch-button" @click="logout" circle ></el-button>
  </div>
</template>

<script>
export default {
  name: "LogoutBtn",
  methods: {
    logout() {
        window.localStorage.removeItem('info');
        window.localStorage.removeItem('isAdmin');
        this.$router.replace('/');
        this.$alertInfo('已注销');
    },
  },
};
</script>

<style scoped>
.logout-btn-wrap {
  width: 100%;
  max-width: 2000px;
  position: fixed;
  padding: 1rem;
  box-sizing: border-box;
  bottom: 0;
}

.logout-btn {
    float: right;
}
</style>
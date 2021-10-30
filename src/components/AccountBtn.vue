<template>
  <div class="logout-btn-wrap">
    <el-dropdown placement="top-end" @command="executeCommand" trigger="click">
      <el-button icon="el-icon-user-solid" circle size="mini"></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="toggle_view">切换夜间模式</el-dropdown-item>
        <el-dropdown-item command="logout">注销</el-dropdown-item>
        <el-dropdown-item command="edit_password">修改密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "LogoutBtn",
  mounted() {
    let lastLoginStamp = Number(window.localStorage.getItem('timeStamp'));
    if (lastLoginStamp === 0 || (new Date().getTime() - lastLoginStamp) > (7 * 24 * 60 * 60 * 1000)) {
      this.logout("登录状态已超时，请重新登录");
    }
  },
  methods: {
    executeCommand(cmd) {
      if (cmd === "logout") {
        this.logout();
      }
      if (cmd === "edit_password") {
        this.editPassword();
      }
      if (cmd === "toggle_view") {
        this.toggleDarkMode();
      }
    },
    logout(msg) {
      window.localStorage.removeItem("info");
      window.localStorage.removeItem("isAdmin");
      window.localStorage.removeItem("timeStamp");
      this.$router.replace("/");
      this.$alertInfo(msg || "已注销");
    },
    editPassword() {
      this.$router.push("/edit_password");
    },
    toggleDarkMode() {
      document.getElementsByClassName("darkmode-toggle")[0].click();
      window.localStorage.setItem('isDarkMode', this.$darkmode.isActivated());
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
  pointer-events: none;
}

.logout-btn-wrap .el-dropdown {
  float: right;
  pointer-events: auto;
}
</style>

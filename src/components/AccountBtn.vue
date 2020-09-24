<template>
  <div class="logout-btn-wrap">
    <el-dropdown placement="top-end" @command="excuteCommand" trigger="click">
      <el-button icon="el-icon-user-solid" circle></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">注销</el-dropdown-item>
        <el-dropdown-item command="edit_password">修改密码</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "LogoutBtn",
  methods: {
    excuteCommand(cmd) {
      if (cmd === "logout") {
        this.logout();
      }
      if (cmd === "edit_password") {
        this.editPassword();
      }
    },
    logout() {
      window.localStorage.removeItem("info");
      window.localStorage.removeItem("isAdmin");
      this.$router.replace("/");
      this.$alertInfo("已注销");
    },
    editPassword() {
      this.$router.push("/edit_password");
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
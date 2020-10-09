<template>
  <div id="home">
    <div id="passport">
      <div class="portal" @click="loginAs(true)">
        <img src="../assets/cover.jpg" alt />
        <span>管理员</span>
      </div>
      <div class="portal" @click="loginAs(false)">
        <img src="../assets/cover.jpg" alt />
        <span>打牌人</span>
      </div>
    </div>
    <el-dialog
      width="24rem"
      :title="dialogTitle"
      :visible.sync="isLogin"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form label-position="top" :model="userInfo" :rules="formRules" ref="loginForm">
        <el-form-item label="用户名" size="small" prop="username">
          <el-input v-model.trim="userInfo.username" type="text" @keyup.enter.native="submitLogin"></el-input>
        </el-form-item>
        <el-form-item label="密码" size="small" prop="password">
          <el-input v-model.trim="userInfo.password" type="password" @keyup.enter.native="submitLogin"></el-input>
        </el-form-item>
        <el-form-item size="small">
          <el-checkbox v-model="userInfo.isRemember" disabled>记住所选角色及密码</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="closePanel" size="small">重新选择</el-button>
        <el-button type="primary" @click="submitLogin" size="small">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MD5 from "crypto-js/md5";
import { validateUserUrl } from "@/config/url.js";
import { axiosFetch } from "../utils/fetch";
export default {
  name: "Home",
  data() {
    return {
      isLogin: false,
      isAdmin: false,
      dialogTitle: null,
      userInfo: {
        username: null,
        password: null,
        isRemember: true,
      },
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    loginAs(isAdmin) {
      if (
        window.localStorage.getItem("info") &&
        JSON.parse(window.localStorage.getItem("isAdmin")) === isAdmin
      ) {
        this.$router.push(isAdmin ? "/admin" : "/player");
      }
      this.isAdmin = isAdmin;
      this.isLogin = true;
      this.dialogTitle = `作为${isAdmin ? "管理员" : "打牌人"}登录`;
    },

    closePanel() {
      this.$refs["loginForm"].resetFields();
      this.isLogin = false;
    },

    submitLogin() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          this.$openLoading();
          let pwd = MD5(this.userInfo.password).toString();
          axiosFetch({
            url: validateUserUrl,
            data: {
              name: this.userInfo.username,
              password: pwd,
            },
          }).then((res) => {
            this.$closeLoading();
            if (res.data.code === 200) {
              if (res.data.data === "UNLOGIN") {
                this.$alertInfo("账号或密码错误");
              } else {
                if (this.userInfo.isRemember) {
                  let info = JSON.stringify({
                    u: this.userInfo.username,
                    p: pwd,
                  });
                  window.localStorage.setItem("info", info);
                  window.localStorage.setItem("isAdmin", this.isAdmin);
                }
                this.$router.push(this.isAdmin ? "/admin" : "/player");
              }
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
#home {
  height: 100%;
  position: relative;
}
#passport {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.portal {
  margin: 1rem;
  height: 16rem;
  min-height: 16rem;
  width: 10rem;
  min-width: 10rem;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  box-shadow: #8f8f8f 0 0 10px 0;
  opacity: 0.7;
  border-radius: 0.5rem;
  cursor: pointer;
}
.portal:hover {
  transform: scale(1.05);
  opacity: 1;
}

.portal img {
  width: 84%;
}

.portal span {
  color: #8f8f8f;
  font-weight: bold;
}

#home /deep/ .el-form-item__label {
  padding: 0;
}
</style>
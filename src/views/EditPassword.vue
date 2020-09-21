<template>
  <div class="edit-container" :style="{height: pageHeight + 'px'}">
    <div class="edit-panel">
      <form @submit.prevent="submitEdit">
        <el-form label-position="top" :model="editInfos" ref="password-edit" :rules="rules">
          <el-form-item label="原密码" prop="orgPassword">
            <el-input
              type="password"
              v-model="editInfos.orgPassword"
              ref="edit-input"
              autocomplete="off"
              show-password
              size="small"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input
              type="password"
              v-model="editInfos.password"
              autocomplete="off"
              show-password
              size="small"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="ensurePassword">
            <el-input
              type="password"
              v-model="editInfos.ensurePassword"
              autocomplete="off"
              show-password
              size="small"
            />
          </el-form-item>
        </el-form>

        <div class="form-item-btn">
          <el-button plain type="info" style="width: 40%" @click="$router.go(-1)" size="small">取消</el-button>
          <el-button type="primary" style="width: 40%" native-type="submit" size="small">确认</el-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { axiosFetch } from "@/utils/fetch";
import { editUserPasswordUrl } from "@/config/url";
import MD5 from "crypto-js/md5";

export default {
  name: "EditPassword",
  data() {
    let orgPasswordCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      }
      setTimeout(() => {
        if (this.editInfos.orgPassword !== "") {
          this.$refs["password-edit"].validateField("orgPassword");
        }
        callback();
      }, 1000);
    };

    let passwordCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      }
      setTimeout(() => {
        if (value === this.editInfos.orgPassword) {
          callback(new Error("请勿与原密码相同"));
        } else if (this.editInfos.password !== "") {
          this.$refs["password-edit"].validateField("password");
        }
        callback();
      }, 100);
    };

    let ensurePasswordCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      }
      setTimeout(() => {
        if (value !== this.editInfos.password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      }, 100);
    };

    return {
      pageHeight: 0,
      isPending: false,
      editInfos: {
        username: JSON.parse(window.localStorage.getItem("info")).u,
        orgPassword: "",
        password: "",
        ensurePassword: "",
      },
      rules: {
        orgPassword: [{ validator: orgPasswordCheck, trigger: "blur" }],
        password: [{ validator: passwordCheck, trigger: "blur" }],
        ensurePassword: [{ validator: ensurePasswordCheck, trigger: "blur" }],
      },
    };
  },
  mounted: function () {
    /*动态处理页面高度*/
    this.pageHeightCalc();
    window.onresize = () => {
      this.pageHeightCalc();
    };
    this.$nextTick(() => {
      this.$refs["edit-input"].focus();
    });
  },
  methods: {
    pageHeightCalc: function () {
      this.pageHeight =
        document.body.clientHeight > 460
          ? document.body.clientHeight - 200
          : 260;
    },
    submitEdit: function () {
      this.$refs["password-edit"].validate((valid) => {
        if (!valid) {
          this.$alertInfo("请完善填写信息");
        } else {
          this.$openLoading();
          axiosFetch({
            url: editUserPasswordUrl,
            data: {
              name: this.editInfos.username,
              old: MD5(this.editInfos.orgPassword).toString(),
              new: MD5(this.editInfos.password).toString(),
            },
          }).then((response) => {
            if (response.data.code === 200) {
              this.$closeLoading();
              this.$alertSuccess("请重新登录");
              window.localStorage.removeItem("info");
              window.localStorage.removeItem("isAdmin");
              this.$router.replace("/");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.edit-container {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-panel {
  background: #fff;
  border: 1px solid #999;
  border-radius: 5px;
  height: 340px;
  width: 320px;
  padding: 10px 20px;
}

.el-form-item {
  margin-bottom: 14px;
}

.el-form-item /deep/ .el-form-item__label {
  padding: 0;
}

.form-item-btn {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
</style>

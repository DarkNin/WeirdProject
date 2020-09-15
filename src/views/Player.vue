<template>
  <div id="player">
    <div class="player-info">
      <p class="player-info-tips">欢迎来到诡异云，{{username}}。</p>
      <span class="player-info-item">
        <p>DP: {{duelPoint}}</p>
        <p>月见黑: {{leftAward}}</p>
        <p>剩余尘数: {{leftDust}}</p>
      </span>

      <el-button type="text">合成</el-button>
    </div>
    <div class="player-main">
      <el-menu mode="horizontal" default-active="1" @select="handleSelect">
        <el-menu-item index="1">情报</el-menu-item>
        <el-menu-item index="2">卡库</el-menu-item>
        <el-menu-item index="3">抽卡记录</el-menu-item>
        <el-menu-item index="4">修改记录</el-menu-item>
      </el-menu>
      <div class="player-main-content" v-if="showTab === '1'">
        <el-collapse v-model="activeItemIndex" @change="handleItemChange" accordion>
          <el-collapse-item
            v-for="(item, index) in cardPackageList"
            :key="index"
            :name="index"
            :title="item.packageName"
          >
            <div class="collapse-table-wrap">
              <el-table
                :data="packageListContent[index] ? packageListContent[index]['data'] : []"
                size="mini"
                height="48vh"
              >
                <el-table-column
                  :key="'package-' + item.packageName + '-1'"
                  prop="cardName"
                  label="卡名"
                ></el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-2'"
                  prop="rare"
                  label="稀有度"
                >
                  <template slot-scope="scope">
                    <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
                  </template>
                </el-table-column>
              </el-table>
              <div class="collapse-table-pagination">
                <el-pagination
                  small
                  background
                  layout="prev, pager, next"
                  :total="packageListContent[index] ? packageListContent[index]['pagination'].total : 0"
                  :page-size="packageListContent[index] ? packageListContent[index]['pagination'].pageSize : defaultPageSize"
                  @current-change="pageChange"
                ></el-pagination>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="player-main-content" v-else-if="showTab === '2'">
        <div class="player-main-content-addition">
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="libQueryAddition.packageName"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'lib' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-select size="mini" v-model="libQueryAddition.rare" placeholder="请选择稀有度" clearable>
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="libQueryAddition.userName"
              placeholder="请选择玩家"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="'lib' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-input size="mini" v-model="libQueryAddition.cardName" placeholder="请填写卡名" clearable></el-input>
          </div>
          <div class="player-main-content-addition-item">
            <el-button type="info" size="mini" @click="libClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="libQueryCard">查询</el-button>
          </div>
        </div>
        <div class="player-main-content-table-wrap">
          <el-table :data="libTableData" size="mini" height="48vh">
            <el-table-column :key="'lib-column-' + 1" prop="cardName" label="卡名"></el-table-column>
            <el-table-column :key="'lib-column-' + 2" prop="packageName" label="卡包名"></el-table-column>
            <el-table-column :key="'lib-column-' + 3" prop="rare" label="稀有度">
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'lib-column-' + 4" prop="userName" label="拥有者"></el-table-column>
          </el-table>
          <div class="player-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="libPagination.total"
              :page-size="libPagination.pageSize"
              @current-change="libQueryCard"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="player-main-content" v-else-if="showTab === '3'">
        <div class="player-main-content-addition">
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="drawRecordQueryAddition.package"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'draw-record' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="drawRecordQueryAddition.user"
              placeholder="请选择玩家"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="'draw-record' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item special">
            <el-button type="info" size="mini" @click="recordClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="setToMine">查询自己</el-button>
            <el-button type="primary" size="mini" @click="drawRecordQuery">查询</el-button>
          </div>
        </div>
        <div class="player-main-content-table-wrap">
          <el-table :data="drawRecordTableData" size="mini" height="48vh">
            <el-table-column :key="'draw-record-column-' + 1" prop="rollPackageName" label="卡包名"></el-table-column>
            <el-table-column :key="'draw-record-column-' + 2" prop="rollUserName" label="抽卡人"></el-table-column>
            <el-table-column :key="'draw-record-column-' + 3" prop="time" label="抽卡时间"></el-table-column>
            <el-table-column :key="'draw-record-column-' + 4" prop="isDisabled" label="是否有效">
              <template slot-scope="scope">
                <div>{{scope.row.isDisabled ? '无效' : '有效'}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'draw-record-column-' + 5" prop="rollResult" label="抽卡结果" min-width="200">
              <template slot-scope="scope">
                <div
                  class="table-tag-draw"
                  v-for="(item, index) in scope.row.rollResult"
                  :key="'draw-result-' + index"
                >
                  <span class="draw-result-rare" :class="_getRareColor(item.rare)">{{item.rare}}</span>
                  <span class="draw-result-name">{{item.cardName}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="player-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="drawRecordPagination.total"
              :page-size="drawRecordPagination.pageSize"
              @current-change="drawRecordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="player-main-content" v-else-if="showTab === '4'">
        <div class="player-main-content-addition">
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="recordQueryAddition.packageName"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'record' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-select
              size="mini"
              v-model="recordQueryAddition.rare"
              placeholder="请选择稀有度"
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
            </el-select>
          </div>
          <div class="player-main-content-addition-item">
            <el-input
              size="mini"
              v-model="recordQueryAddition.cardName"
              placeholder="请填写卡名"
              clearable
            ></el-input>
          </div>
          <div class="player-main-content-addition-item">
            <el-button type="info" size="mini" @click="recordClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="recordQuery">查询</el-button>
          </div>
        </div>
        <div class="player-main-content-table-wrap">
          <el-table :data="recordTableData" size="mini" height="48vh">
            <el-table-column :key="'record-column-' + 1" prop="packageName" label="卡包名"></el-table-column>
            <el-table-column :key="'record-column-' + 2" prop="oldName" label="旧卡名"></el-table-column>
            <el-table-column :key="'record-column-' + 3" prop="newName" label="新卡名"></el-table-column>
            <el-table-column :key="'record-column-' + 4" prop="rare" label="稀有度">
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'record-column-' + 5" prop="createdTime" label="添加时间"></el-table-column>
          </el-table>
          <div class="player-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="recordPagination.total"
              :page-size="recordPagination.pageSize"
              @current-change="recordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosFetch } from "@/utils/fetch.js";
import common from "./mixins/common";
export default {
  name: "Player",
  mixins: [common],
  data() {
    return {
      leftDust: 0,
      leftAward: 0,
      duelPoint: 0,

      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      libPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      libQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: "",
      },
      libTableData: [],

      recordPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      recordQueryAddition: {
        packageName: "",
        cardName: "",
        rare: "",
      },
      recordTableData: [],

      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      drawRecordQueryAddition: {
        package: "",
        user: "",
      },
      drawRecordTableData: [],
    };
  },
  mounted() {
    let userInfo = this.userList.find(
      (element) => element.userName === this.username
    );
    if (userInfo) {
      this.duelPoint = userInfo.duelPoint;
      this.leftDust = userInfo.dustCount;
      this.leftAward = userInfo.nonawardCount;
    }
  },

  methods: {
    handleSelect(index) {
      this.showTab = index;
    },

    //情报页面点击手风琴面板时触发
    async handleItemChange(itemIndex) {
      if (!!this.packageListContent[itemIndex] || itemIndex === "") {
        return;
      }
      this.$openLoading();
      let packageData = await this._queryCardList(
        undefined,
        undefined,
        this.cardPackageList[itemIndex]["packageName"]
      );
      this.$set(this.packageListContent, itemIndex, packageData);
      this.$closeLoading();
    },

    //情报页面表格分页切换
    pageChange(page) {
      this.$openLoading();
      this._queryCardList(
        page,
        this.defaultPageSize,
        this.cardPackageList[this.activeItemIndex]["packageName"]
      ).then((data) => {
        this.$set(this.packageListContent, this.activeItemIndex, data);
        this.$closeLoading();
      });
    },

    //卡库页面 清除条件
    libClearAddition() {
      Object.assign(
        this.$data.libQueryAddition,
        this.$options.data().libQueryAddition
      );
    },

    //卡库查询 && 分页切换
    libQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.libQueryAddition.packageName || undefined,
        this.libQueryAddition.cardName || undefined,
        this.libQueryAddition.rare || undefined,
        this.libQueryAddition.userName || undefined
      ).then((data) => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
    },

    //记录页面 清除条件
    recordClearAddition() {
      Object.assign(
        this.$data.recordQueryAddition,
        this.$options.data().recordQueryAddition
      );
    },

    //记录查询 && 分页切换
    recordQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryRecordList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.recordQueryAddition.packageName || undefined,
        this.recordQueryAddition.cardName || undefined,
        this.recordQueryAddition.rare || undefined
      ).then((data) => {
        this.recordPagination.page = data.pagination.page;
        this.recordPagination.total = data.pagination.total;
        this.recordTableData = data.data;
        this.$closeLoading();
      });
    },

    //抽卡记录 清除条件
    drawRecordClearAddition() {
      Object.assign(
        this.$data.drawRecordQueryAddition,
        this.$options.data().drawRecordQueryAddition
      );
    },

    drawRecordQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryDrawRecordList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.drawRecordQueryAddition.packageName || undefined,
        this.drawRecordQueryAddition.user || undefined
      ).then((data) => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },
    setToMine() {
      this.drawRecordQueryAddition.user = this.username;
      this.drawRecordQuery();
    },
  },
};
</script>

<style scoped>
#player {
  width: 100%;
  height: 3rem;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
}
.player-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  min-height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.player-info p {
  margin: 0;
  color: #8f8f8f;
  height: 3rem;
  line-height: 3rem;
}

.player-info .player-info-item {
  margin-left: auto;
  width: 16rem;
  display: flex;
  justify-content: space-around;
}

.player-info .el-button {
  margin: 0 10px;
  font-size: 0.9rem;
}

.player-main {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  padding: 0 1rem;
  box-sizing: border-box;
}

.player-main-content {
  box-sizing: border-box;
  padding: 1rem;
  height: 70vh;
  overflow-y: auto;
}

.player-main-content /deep/ .el-collapse-item__header {
  color: #66b1ff;
  font-weight: bold;
}

.collapse-table-wrap {
  height: 50vh;
}

.table-tag {
  display: inline-block;
  width: 2rem;
  height: 100%;
  text-align: center;
  border-radius: 0.3rem;
  border: 1px solid #eee;
  font-weight: bold;
}

.table-tag.color-normal {
  background-color: #75b2f3;
  color: #ffffff;
}
.table-tag.color-rare {
  background-color: #ffe3a7;
  color: #cccccc;
}
.table-tag.color-ultra-rare {
  background-color: #ffe3a7;
  color: #c5b314;
}
.collapse-table-pagination,
.player-main-content-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-top: 5px;
}

.player-main-content-addition {
  /* border: 1px solid #eeeeee;
  border-radius: 0.3rem; */
  min-height: 30px;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
}

.player-main-content-addition-item {
  width: 10rem;
  height: 3rem;
  margin-right: 0.6rem;
}
.player-main-content-addition-item.special {
  width: auto;
}
.table-tag-draw {
  display: inline-block;
  width: auto;
  height: 100%;
  text-align: center;
  color: #606266;
  margin-right: 5px;
}
.draw-result-rare {
  display: inline-block;
  border-radius: 0.3rem;
  border: 1px solid #eee;
  font-weight: bold;
  padding: 0 5px;
  margin-right: 2px;
}
.table-tag-draw .color-normal {
  background-color: #75b2f3;
  color: #ffffff;
}
.table-tag-draw .color-rare {
  background-color: #ffe3a7;
  color: #cccccc;
}
.table-tag-draw .color-ultra-rare {
  background-color: #ffe3a7;
  color: #c5b314;
}
</style>
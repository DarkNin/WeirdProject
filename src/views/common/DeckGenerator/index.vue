/* 卡组编辑查看页面 */
<template>
  <div id="deck-generator">
    <div class="deck-content-addition">
      <div class="deck-content-addition-item">
        <el-select
          size="mini"
          v-model="deckQueryAddition.sortType"
          placeholder="请选择排序方式"
          clearable
        >
          <el-option label="名称" :value="1"></el-option>
          <el-option label="最后修改时间" :value="2"></el-option>
        </el-select>
      </div>
      <div class="deck-content-addition-item">
        <el-select
          size="mini"
          v-model="deckQueryAddition.sortWay"
          placeholder="正序/倒序"
          clearable
        >
          <el-option label="倒序" :value="1"></el-option>
          <el-option label="正序" :value="2"></el-option>
        </el-select>
      </div>
      <div class="deck-content-addition-item">
        <el-input
          size="mini"
          v-model="deckQueryAddition.deckName"
          placeholder="请填写卡组名"
          clearable
          @keyup.enter.native="deckQuery"
        ></el-input>
      </div>
      <div class="deck-content-addition-item" v-if="isAdmin === 'true'">
        <el-select
          size="mini"
          v-model="deckQueryAddition.targetUser"
          placeholder="请选择玩家"
          clearable
        >
          <el-option
            v-for="item in userList"
            :key="'deck-' + item.userName + item.userId"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </div>
      <div class="deck-content-addition-item special">
        <el-button type="info" size="mini" @click="deckClearAddition"
          >清除条件
        </el-button>
        <el-button type="primary" size="mini" @click="deckQuery"
          >查询
        </el-button>
        <el-button
          type="primary"
          size="mini"
          v-if="isAdmin === 'false'"
          @click="isUploadDialogShowing = true"
          >上传卡组
        </el-button>
      </div>
    </div>
    <div class="deck-content-table-wrap">
      <el-table
        :data="deckTableData"
        size="mini"
        height="auto"
        @expand-change="detailExpandCallback"
      >
        <el-table-column :key="'deck-column-' + 0" type="expand">
          <template slot-scope="scope">
            <div class="deck-box">
              <div
                class="el-loading-mask"
                v-if="!deckDetailObject[scope.row.deckId]"
              >
                <div class="el-loading-spinner">
                  <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" />
                  </svg>
                </div>
              </div>
              <div class="deck-box-content" v-else>
                <div class="deck-box-item">
                  <div class="deck-box-item-title">主卡组</div>
                  <div class="deck-box-item-content">
                    <div
                      class="deck-image"
                      v-for="(mainItem, mainIndex) in deckDetailObject[
                        scope.row.deckId
                      ].mainList"
                      :key="scope.row.deckId + '-main-' + mainIndex"
                    >
                      <img
                        :class="mainItem.count > mainItem.own ? 'img-grayscale' : ''"
                        :src="
                          'http://cdn.233.momobako.com/ygopro/pics/' +
                            mainItem.code +
                            '.jpg!thumb'
                        "
                        @mouseenter="
                          showCardDescHover(
                            $event,
                            mainItem.desc,
                            mainItem.code
                          )
                        "
                        @click="
                          showCardDescClick(
                            $event,
                            mainItem.desc,
                            mainItem.code
                          )
                        "
                        @mouseleave="closeCardDesc"
                      />
                      <span class="deck-own">{{mainItem.own}}</span>
                      <span class="deck-count">{{mainItem.count}}</span>
                    </div>
                  </div>
                </div>
                <div class="deck-box-item">
                  <div class="deck-box-item-title">副卡组</div>
                  <div class="deck-box-item-content">
                    <el-image
                      v-for="(exItem, exIndex) in deckDetailObject[
                        scope.row.deckId
                      ].exList"
                      :key="scope.row.deckId + '-ex-' + exIndex"
                      :src="
                        'http://cdn.233.momobako.com/ygopro/pics/' +
                          exItem.code +
                          '.jpg!thumb'
                      "
                      @mouseenter.native="
                        showCardDescHover($event, exItem.desc, exItem.code)
                      "
                      @click="
                        showCardDescClick($event, exItem.desc, exItem.code)
                      "
                      @mouseleave.native="closeCardDesc"
                    ></el-image>
                  </div>
                </div>
                <div class="deck-box-item">
                  <div class="deck-box-item-title">额外卡组</div>
                  <div class="deck-box-item-content">
                    <el-image
                      v-for="(sideItem, sideIndex) in deckDetailObject[
                        scope.row.deckId
                      ].sideList"
                      :key="scope.row.deckId + '-side-' + sideIndex"
                      :src="
                        'http://cdn.233.momobako.com/ygopro/pics/' +
                          sideItem.code +
                          '.jpg!thumb'
                      "
                      @mouseenter.native="
                        showCardDescHover($event, sideItem.desc, sideItem.code)
                      "
                      @click="
                        showCardDescClick($event, sideItem.desc, sideItem.code)
                      "
                      @mouseleave.native="closeCardDesc"
                    ></el-image>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :key="'deck-column-' + 1"
          prop="deckName"
          label="卡组名"
        ></el-table-column>
        <el-table-column
          :key="'deck-column-' + 2"
          prop="userName"
          label="玩家名"
          v-if="isAdmin === 'true'"
        ></el-table-column>
        <el-table-column
          :key="'deck-column-' + 3"
          prop="lastModifyTime"
          label="最后编辑时间"
        >
          <template slot-scope="scope">
            <div>
              {{ formatDate(scope.row.lastModifyTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :key="'deck-column-' + 4" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="editDeckName(scope.row.deckId, scope.row.deckName)"
              >重命名
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="removeDeck(scope.row.deckId, scope.row.deckName)"
              >删除卡组
            </el-button>
            <el-button
              v-if="deckDetailObject[scope.row.deckId]"
              type="text"
              size="mini"
              @click="downloadYDK(scope.row.deckId)"
              >下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="deck-content-table-pagination">
        <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="deckPagination.total"
          :page-size="deckPagination.pageSize"
          :current-page="deckPagination.page"
          @current-change="deckQuery"
        ></el-pagination>
      </div>
    </div>

    <!-- 上传文件dialog -->
    <el-dialog
      title="上传卡组"
      :visible.sync="isUploadDialogShowing"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelUploadDeck"
    >
      <el-upload
        ref="deck_uploader"
        class="deck-uploader"
        size="mini"
        action=""
        multiple
        accept=".ydk"
        :auto-upload="false"
      >
        <el-button size="mini" type="primary">选择文件</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isUploadDialogShowing = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="uploadDeck" size="small"
          >上 传</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Moment from "moment";
import {
  queryDeckUrl,
  addDeckUrl,
  batchAddDeckUrl,
  queryDeckDetailUrl,
  renameDeckUrl,
  removeDeckUrl,
} from "../../../config/url";
import { MessageBox } from "element-ui";
import { axiosPostAsJSON } from "@/utils/fetch.js";
import { saveAs } from "file-saver";
import { Blob } from "buffer";
export default {
  name: "DeckGenerator",
  props: {
    userList: {
      type: Array,
      default: () => [],
    },
    showCardDescHover: {
      type: Function,
      default: () => {},
    },
    showCardDescClick: {
      type: Function,
      default: () => {},
    },
    closeCardDesc: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isAdmin: window.localStorage.getItem("isAdmin"),

      deckQueryAddition: {
        sortType: 1,
        sortWay: 1,
        deckName: "",
        targetUser: undefined,
      },
      deckTableData: null,

      deckPagination: {
        total: 0,
        pageSize: 20,
        page: 1,
      },

      isUploadDialogShowing: false,

      deckDetailObject: {},
    };
  },
  async mounted() {},
  methods: {
    queryDeckList(page, pageSize, deckName, sortType, sortWay, targetUser) {
      return new Promise((resolve) => {
        axiosPostAsJSON({
          url: queryDeckUrl,
          data: {
            deckName: deckName,
            sortType: sortType,
            sortWay: sortWay,
            page: page || 1,
            pagesize: pageSize,
            targetUser: targetUser ? targetUser : undefined,
          },
        }).then((res) => {
          resolve({
            pagination: {
              page: res.data.data.currPage,
              total: res.data.data.totalCount,
              pageSize: res.data.data.pageSize,
            },
            data: res.data.data.dataList,
          });
        });
      });
    },
    deckQuery(page) {
      this.$openLoading();
      let currPage = typeof page === "number" ? page : undefined;
      this.queryDeckList(
        currPage,
        20,
        this.deckQueryAddition.deckName,
        this.deckQueryAddition.sortType,
        this.deckQueryAddition.sortWay,
        this.deckQueryAddition.targetUser
      ).then((data) => {
        this.deckPagination.page = data.pagination.page;
        this.deckPagination.total = data.pagination.total;
        this.deckTableData = data.data;
        this.$closeLoading();
      });
    },
    deckClearAddition() {
      Object.assign(
        this.$data.deckQueryAddition,
        this.$options.data().deckQueryAddition
      );
    },

    editDeckName(id, originName) {
      MessageBox.prompt("请修改卡组名（原名：" + originName + "）", "编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        if (value) {
          this.$openLoading();
          axiosPostAsJSON({
            url: renameDeckUrl,
            data: {
              deck: {
                deckId: id,
                deckName: value,
              },
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.deckQuery();
            }
          });
        }
      });
    },

    checkDeckDetail(id) {
      return new Promise((resolve) => {
        axiosPostAsJSON({
          url: queryDeckDetailUrl,
          data: {
            deckId: id,
          },
        }).then((res) => {
          resolve(res.data.data);
        });
      });
    },

    async detailExpandCallback(row, expanded) {
      if (expanded.includes(row) && !this.deckDetailObject[row.deckId]) {
        this.$set(
          this.deckDetailObject,
          row.deckId,
          await this.checkDeckDetail(row.deckId)
        );
      }
    },

    removeDeck(id, name) {
      MessageBox.confirm("是否删除卡组【" + name + "】", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$openLoading();
          axiosPostAsJSON({
            url: removeDeckUrl,
            data: {
              deck: {
                deckId: id,
              },
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.deckQuery();
            }
          });
        })
        .catch(() => {});
    },

    uploadDeck(params) {
      let files = this.$refs["deck_uploader"].uploadFiles;
      if (files.length === 0) return;
      this.$openLoading();
      let tempNameGroup = [];
      for (let fileItem of files) {
        if (tempNameGroup.includes(fileItem.name)) {
          this.$alertInfo("存在相同文件，请移除重复项后提交");
          return;
        }
        tempNameGroup.push(fileItem.name);
        if (
          !(fileItem.name.includes(".ydk") || fileItem.name.includes(".YDK"))
        ) {
          this.$alertInfo("存在不支持的文件类型，请移除后提交");
          return;
        }
      }
      let dataStream = [];
      files.forEach((fileItem) => {
        let fileReader = new FileReader();
        //异步加载的监听
        fileReader.addEventListener("loadend", () => {
          dataStream.push({
            name: fileItem.name.replace(/\.ydk/i, ""),
            stream: fileReader.result,
          });
          //通过数组长度判断是否加载完
          if (dataStream.length === files.length) {
            this.$closeLoading();
            this.submitUpload(dataStream);
          }
        });
        let textInstance = fileReader.readAsText(fileItem.raw);
      });
    },

    submitUpload(dataStream) {
      this.$openLoading();
      let deckDetail = [];
      dataStream.forEach((item) => {
        deckDetail.push({
          deckName: item.name,
          ydk: item.stream,
        });
      });

      axiosPostAsJSON({
        url: batchAddDeckUrl,
        data: {
          deckList: deckDetail,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.isUploadDialogShowing = false;
          this.deckQuery();
        }
      });
    },

    cancelUploadDeck() {
      this.$refs["deck_uploader"].clearFiles();
    },

    downloadYDK(id) {
      const str = this.deckDetailObject[id].ydk;
      console.log(str);
      const blob = new Blob([str]);
      saveAs(blob, this.deckDetailObject[id].deckName + ".ydk");
    },

    formatDate(srcDate) {
      return Moment(srcDate).format("yyyy-MM-DD hh:mm:ss");
    },
  },
};
</script>

<style scoped>
#deck-generator {
  flex: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.deck-content-addition {
  /* border: 1px solid #eeeeee;
  border-radius: 0.3rem; */
  min-height: 30px;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
}

.deck-content-addition-item {
  width: 10rem;
  height: 3rem;
  margin-right: 0.6rem;
}
.deck-content-addition-item.special {
  width: auto;
}
.deck-content-table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.deck-content-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-top: 10px;
}

.deck-box {
  min-height: 100px;
}

.deck-box-item-title {
  font-size: 13px;
  line-height: 24px;
}

.deck-image {
  display: inline-block;
  position: relative;

  cursor: pointer;
  margin-left: 5px;
}
.deck-image img {
  height: 64px;
  width: 44px;
}

.deck-image .deck-count, .deck-image .deck-own {
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  left: 26px;
  top: 48px;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background-color: rgb(136, 136, 136);
}
.deck-image .deck-own {
  background-color: #dfb466;
  left: 0;
}

.img-grayscale {
  filter: grayscale(100%)
}
</style>

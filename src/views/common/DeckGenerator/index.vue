/* 卡组编辑查看页面 */
<template>
  <div id="deck-generator">
    <div class="deck-content-addition">
      <div class="deck-content-addition-item">
        <el-select
          size="mini"
          v-model="deckQueryAddition.sortType"
          placeholder="请选择排序方式"
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
      <div class="deck-content-addition-item" v-if="checkIfShowUser()">
        <el-autocomplete
          size="mini"
          v-model="deckQueryAddition.targetUser"
          placeholder="请选择玩家"
          clearable
          :trigger-on-focus="false"
          :fetch-suggestions="queryDeckUser"
          @keyup.enter.native="deckQuery"
        ></el-autocomplete>
      </div>
      <div class="deck-content-addition-item special">
        <el-checkbox
          size="mini"
          v-model="deckQueryAddition.share"
          >分享中</el-checkbox
        >
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
                  <div class="deck-box-item-title">主卡组（{{ deckDetailObject[scope.row.deckId].mainCount }}）</div>
                  <div class="deck-box-item-content">
                    <div
                      class="deck-image"
                      v-for="(mainItem, mainIndex) in deckDetailObject[
                        scope.row.deckId
                      ].mainList"
                      :key="scope.row.deckId + '-main-' + mainIndex"
                    >
                      <img
                        :class="mainItem.legal ? '' : 'img-grayscale'"
                        :src="
                          'http://cdn.233.momobako.com/ygopro/pics/' +
                            mainItem.code +
                            '.jpg!thumb'
                        "
                        @mouseenter="
                          showCardDescHover(
                            $event,
                            getDeckCardDesc(mainItem),
                            mainItem.code
                          )
                        "
                        @click="
                          showCardDescClick(
                            $event,
                            getDeckCardDesc(mainItem),
                            mainItem.code
                          )
                        "
                        @mouseleave="closeCardDesc"
                      />
                      <span :class="mainItem.legal ? 'deck-count' : 'deck-count-illegal'">{{mainItem.own + ' / ' + mainItem.count}}</span>
                    </div>
                  </div>
                </div>
                <div class="deck-box-item">
                  <div class="deck-box-item-title">额外卡组（{{ deckDetailObject[scope.row.deckId].exCount }}）</div>
                  <div class="deck-box-item-content">
                    <div
                      class="deck-image"
                      v-for="(exItem, exIndex) in deckDetailObject[
                        scope.row.deckId
                      ].exList"
                      :key="scope.row.deckId + '-ex-' + exIndex"
                    >
                      <img
                        :class="exItem.legal ? '' : 'img-grayscale'"
                        :src="
                          'http://cdn.233.momobako.com/ygopro/pics/' +
                            exItem.code +
                            '.jpg!thumb'
                        "
                        @mouseenter="
                          showCardDescHover(
                            $event,
                            getDeckCardDesc(exItem),
                            exItem.code
                          )
                        "
                        @click="
                          showCardDescClick(
                            $event,
                            getDeckCardDesc(exItem),
                            exItem.code
                          )
                        "
                        @mouseleave="closeCardDesc"
                      />
                      <span :class="exItem.legal ? 'deck-count' : 'deck-count-illegal'">{{exItem.own + ' / ' + exItem.count}}</span>
                    </div>
                  </div>
                </div>
                <div class="deck-box-item">
                  <div class="deck-box-item-title">副卡组（{{ deckDetailObject[scope.row.deckId].sideCount }}）</div>
                  <div class="deck-box-item-content">
                    <div
                      class="deck-image"
                      v-for="(sideItem, sideIndex) in deckDetailObject[
                        scope.row.deckId
                      ].sideList"
                      :key="scope.row.deckId + '-side-' + sideIndex"
                    >
                      <img
                        :class="sideItem.legal ? '' : 'img-grayscale'"
                        :src="
                          'http://cdn.233.momobako.com/ygopro/pics/' +
                            sideItem.code +
                            '.jpg!thumb'
                        "
                        @mouseenter="
                          showCardDescHover(
                            $event,
                            getDeckCardDesc(sideItem),
                            sideItem.code
                          )
                        "
                        @click="
                          showCardDescClick(
                            $event,
                            getDeckCardDesc(sideItem),
                            sideItem.code
                          )
                        "
                        @mouseleave="closeCardDesc"
                      />
                      <span :class="sideItem.legal ? 'deck-count' : 'deck-count-illegal'">{{sideItem.own + ' / ' + sideItem.count}}</span>
                    </div>
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
        <el-table-column :key="'deck-column-' + 4" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="checkIfCanOperate(scope.row)"
              type="text"
              size="mini"
              @click="editDeck(scope.row)"
              >修改
            </el-button>
            <el-button
              v-if="checkIfCanOperate(scope.row)"
              type="text"
              size="mini"
              @click="removeDeck(scope.row.deckId, scope.row.deckName)"
              >删除
            </el-button>
            <el-button
              v-if="checkIfCanShare(scope.row)"
              type="text"
              size="mini"
              @click="shareOperation(scope.row.deckId, 1)"
              >分享
            </el-button>
            <el-button
              v-if="checkIfCanDisShare(scope.row)"
              type="text"
              size="mini"
              @click="shareOperation(scope.row.deckId, 0)"
              >取消分享
            </el-button>
            <el-button
              v-if="deckDetailObject[scope.row.deckId]"
              type="text"
              size="mini"
              @click="downloadYDK(scope.row.deckId)"
              >下载
            </el-button>
            <el-button
              v-if="deckDetailObject[scope.row.deckId]"
              type="text"
              size="mini"
              @click="copyDeck(scope.row.deckId)"
              >复制分享码
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


    <!-- 修改 -->
    <el-dialog
      title="修改"
      :visible.sync="isEditDialogShowing"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelUploadDeck"
    >
      <el-form label-position="top" :model="editDeckInfo">
        <el-form-item label="卡组名" size="small">
          <el-input
            v-model="editDeckInfo.deckName"
            type="text"
            clearable
          ></el-input>
        </el-form-item>
        <el-upload
          ref="deck_uploader"
          class="deck-uploader"
          size="mini"
          action=""
          accept=".ydk"
          :auto-upload="false"
          :limit=1
        >
          <el-button size="mini" type="primary">选择文件</el-button>
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogShowing = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditDeck" size="small"
          >修 改</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="复制"
      :visible.sync="isCopyDialogShowing"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closeCopyCallback">
      <el-input id="copying_text_box" type="textarea" :rows='6' v-model="copyingText">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isCopyDialogShowing = false" size="small"
          >取 消</el-button
        >
        <el-button id="copying_text_btn" type="primary" data-clipboard-target="#copying_text_box" size="small"
          >复 制</el-button
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
  editDeckUrl,
  queryDeckDetailUrl,
  renameDeckUrl,
  removeDeckUrl,
  shareDeckUrl,
} from "../../../config/url";
import { MessageBox } from "element-ui";
import { axiosPostAsJSON } from "@/utils/fetch.js";
import { saveAs } from "file-saver";
import ClipboardJS from 'clipboard'
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
      username: JSON.parse(window.localStorage.getItem("info")).u,

      deckQueryAddition: {
        sortType: 1,
        sortWay: 1,
        deckName: "",
        targetUser: undefined,
        share: 0
      },
      deckTableData: null,

      deckPagination: {
        total: 0,
        pageSize: 20,
        page: 1,
      },

      isUploadDialogShowing: false,
      isEditDialogShowing: false,
      editDeckInfo: {
        deckName: "",
        deckId: 0
      },

      deckDetailObject: {},
      userCandidateList: [],

      isCopyDialogShowing: false,
      copyingText: '',
      clipboardObj: null
    };
  },
  async mounted() {
    this.generateUserName();
  },
  methods: {
    queryDeckList(page, pageSize, deckName, sortType, sortWay, targetUser, share) {
      this.deckDetailObject = {};
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
            share: share,
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
        this.deckQueryAddition.targetUser,
        this.deckQueryAddition.share
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

    uploadDeck() {
      let files = this.$refs["deck_uploader"].uploadFiles;
      if (files.length === 0) return;
      this.$openLoading();
      let tempNameGroup = [];
      for (let fileItem of files) {
        if (tempNameGroup.includes(fileItem.name)) {
          this.$alertInfo("存在相同文件，请移除重复项后提交");
          this.$closeLoading();
          return;
        }
        tempNameGroup.push(fileItem.name);
        if (
          !(fileItem.name.includes(".ydk") || fileItem.name.includes(".YDK"))
        ) {
          this.$alertInfo("存在不支持的文件类型，请移除后提交");
          this.$closeLoading();
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

    copyDeck(id) {
      const str = this.deckDetailObject[id].mobileCode;
      this.copyingText = str;
      this.isCopyDialogShowing = true;
      this.$nextTick(() => {
        this.clipboardObj = new ClipboardJS('#copying_text_btn');
        this.clipboardObj.on('success', () => {
          this.$alertSuccess('已复制到剪贴板');
          this.clipboardObj.destroy();
          this.isCopyDialogShowing = false;
        })
      })
    },

    closeCopyCallback() {
      this.copyingText = '',
      this.clipboardObj = null
    },

    formatDate(srcDate) {
      return Moment(srcDate).format("yyyy-MM-DD HH:mm:ss");
    },

    checkIfCanOperate(row) {
      return row.userName === this.username || JSON.parse(this.isAdmin) === true;
    },

    checkIfCanShare(row) {
      return this.checkIfCanOperate(row) && row.share === 0;
    },

    checkIfCanDisShare(row) {
      return this.checkIfCanOperate(row) && row.share === 1;
    },

    shareOperation(deckId, operation) {
      axiosPostAsJSON({
          url: shareDeckUrl,
          data: {
              deckId: deckId,
              share: operation
          },
      }).then((res) => {
        if (res.data.code === 200) {
          this.deckQuery(this.deckPagination.page);
        }
      });
    },

    getDeckCardDesc(item) {
      return item.desc + "\n\n" + item.packageName + " - " + item.rare;
    },

    editDeck(row) {
      this.editDeckInfo.deckId = row.deckId;
      this.editDeckInfo.deckName = row.deckName;
      this.isEditDialogShowing = true;
    },

    submitEditDeck() {
      let files = this.$refs["deck_uploader"].uploadFiles;
      // 没有选择文件，只修改卡组名
      if (files.length === 0) {
        let deckName = this.editDeckInfo.deckName;
        if (deckName) {
          this.$openLoading();
          axiosPostAsJSON({
            url: renameDeckUrl,
            data: {
              deck: {
                deckId: this.editDeckInfo.deckId,
                deckName: deckName,
              },
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.deckQuery();
            }
            this.isEditDialogShowing = false;
          });
        }
        return;
      };
      if (files.length > 1) {
        this.$alertInfo("修改卡组只需要上传一个文件，请移除后提交");
      };
      this.$openLoading();
      for (let fileItem of files) {
        if (
          !(fileItem.name.includes(".ydk") || fileItem.name.includes(".YDK"))
        ) {
          this.$alertInfo("存在不支持的文件类型，请移除后提交");
          return;
        }
      }
      files.forEach((fileItem) => {
        let fileReader = new FileReader();
        //异步加载的监听
        fileReader.addEventListener("loadend", () => {
          let ydk = fileReader.result;
          console.log(ydk);
          axiosPostAsJSON({
            url: editDeckUrl,
            data: {
              deck: {
                deckId: this.editDeckInfo.deckId,
                deckName: this.editDeckInfo.deckName,
                ydk: ydk
              }
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.isEditDialogShowing = false;
              this.deckQuery();
            }
          });
        });
        fileReader.readAsText(fileItem.raw);
        return;
      });
    },

    checkIfShowUser() {
      return this.deckQueryAddition.share == true || JSON.parse(this.isAdmin) === true;
    },

    async generateUserName() {
      this.userCandidateList = this.userList.map((item) => {
        return {
          value: item.userName,
        };
      });
    },

    queryDeckUser(queryString, callback) {
      let result = queryString
        ? this.userCandidateList.filter(this.userNameFilter(queryString))
        : this.userCandidateList;
      callback(result);
    },

    userNameFilter(queryString) {
      return item => {
        return item.value.indexOf(queryString) >= 0;
      };
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

.deck-image .deck-count {
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  left: 10px;
  top: 48px;
  height: 16px;
  width: 36px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: bold;
  color: #2df77a;
  background-color: rgb(61, 61, 61);
  transform: scale(0.8)
}

.deck-image .deck-count-illegal {
  position: absolute;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  left: 10px;
  top: 48px;
  height: 16px;
  width: 36px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: bold;
  color: #f5f25a;
  background-color: rgb(61, 61, 61);
  transform: scale(0.8)
}

.img-grayscale {
  filter: grayscale(100%)
}
</style>

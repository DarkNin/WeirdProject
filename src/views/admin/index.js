import common from "../mixins/common";
import {
  searchCardUrl,
  addCardUrl,
  editCardNameUrl,
  editPackageNameUrl,
  editPackageDetailUrl,
  addPackageUrl,
  addUserUrl,
  resetPasswordUrl,
  editCardCountUrl,
  editDustUrl,
  editAwardUrl,
  editCoinUrl,
  editRouletteUrl,
  editRollCountUrl,
  setDrawResultUrl,
  importDrewResultUrl,
  exchangeCardsRareUrl,
  editPackageOrderUrl,
  swapUserOwnCardUrl,
  changeUserOwnCardUrl,
  editRouletteConfigUrl,
  addUserDeckUrl,
} from "../../config/url";
import { axiosFetch, axiosGet, axiosPostAsJSON } from "../../utils/fetch";
import CardDesc from "@/components/CardDesc";
import DeckGenerator from "../common/DeckGenerator/index";
import draggable from "vuedraggable";
import { MessageBox } from "element-ui";
import { exportToExcelByJson } from "@/utils/xlsx";
import { LuckyWheel } from "vue-luck-draw";
export default {
  name: "Admin",
  mixins: [common],
  components: {
    CardDesc,
    draggable,
    DeckGenerator,
    LuckyWheel,
  },
  data() {
    return {
      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      cardCandicateList: [],

      //新增卡包
      isAddingPackage: false,
      addingPackageData: {
        package: ""
      },
      //编辑卡包
      isEditingPackage: false,
      editingPackageData: {
        oldname: "",
        newname: ""
      },
      //编辑卡包描述
      isEditingPackageDetail: false,
      editingPackageDetailData: {
        package: "",
        detail: ""
      },
      //新增卡片
      isAddingCard: false,
      addingCardData: {
        package: "",
        card: "",
        rare: "N"
      },
      //批量新增卡片
      isBatchAddingCard: false,
      batchAddingMenuRenderOptions: [
        {
          label: "N",
          keyWord: "stash-n-",
          dataKey: "nList"
        },
        {
          label: "R",
          keyWord: "stash-r-",
          dataKey: "rList"
        },
        {
          label: "SR",
          keyWord: "stash-sr-",
          dataKey: "srList"
        },
        {
          label: "UR",
          keyWord: "stash-ur-",
          dataKey: "urList"
        },
        {
          label: "HR",
          keyWord: "stash-hr-",
          dataKey: "hrList"
        },
        {
          label: "GR",
          keyWord: "stash-gr-",
          dataKey: "grList"
        },
        {
          label: "SER",
          keyWord: "stash-ser-",
          dataKey: "serList"
        }
      ],
      tempBatchAddingCardData: {
        nList: "",
        rList: "",
        srList: "",
        hrList: "",
        urList: "",
        grList: "",
        serList: ""
      },
      batchAddingCardData: {
        packageName: "",
        nList: [],
        rList: [],
        srList: [],
        hrList: [],
        urList: [],
        grList: [],
        serList: []
      },
      //编辑卡片
      isEditingCard: false,
      editingCardData: {
        oldname: "",
        newname: "",
        rare: "",
        needCoin: 0,
        show: false
      },

      //交换两卡片稀有度
      isExchangingCard: false,
      exchangingCardData: {
        card1: "",
        card2: "",
        show: false
      },

      //卡库查询
      libPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      libQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: ""
      },
      libTableData: [],
      //玩家卡库查询
      playerLibPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      playerLibQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: ""
      },
      playerLibTableData: [],

      //玩家页
      //新增玩家
      isAddingUser: false,
      addingUserData: {
        target: ""
      },
      //玩家查询
      userQueryAddition: {
        target: "",
        package: "",
        card: "",
        rare: ""
      },

      userSelectedInfo: {
        dust: 0,
        award: 0,
        duelPoint: 0,
        coin: 0,
        roulette: 0,
        rollCount: 0
      },
      //编辑玩家数据
      isEditingUserInfoItem: false,
      editingUserInfoItemType: "",
      editingUserInfoItemCount: "",
      editingUserInfoItemTips: "",

      userPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      userTableData: [],

      //编辑玩家卡数量
      isEditingCardCount: false,
      isAddingUserCard: false, //利用相同接口做新增卡
      editingCardCountData: {
        card: "",
        target: "",
        count: null
      },
      addingUserCardTips: "",
      editingCardCountTips: "",

      //通过导入ydk批量新增玩家卡片
      isAddingUserCardDeck: false,
      addingUserCardDeckTips: "",

      //修改记录查询
      recordPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      recordQueryAddition: {
        packageName: "",
        cardName: "",
        rare: ""
      },
      recordTableData: [],
      highlightKey: null,

      //抽卡记录查询
      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      drawRecordQueryAddition: {
        package: [],
        user: [],
        dateRange: null,
        cardName: ""
      },
      drawRecordTableData: [],

      //日志查询
      logPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      logQueryAddition: {
        operator: "",
        detail: "",
        dateRange: null
      },
      logTableData: [],

      //设置抽卡记录状态
      isSettingDrawRecord: false,
      drawRecordStatusData: {
        status: 0,
        id: null
      },
      //导入抽卡记录
      isImportingDrewCards: false,
      importingDrewCardsInfo: {
        target: "",
        cards: []
      },
      tempDrewCardsInfo: "",
      //编辑卡包排序
      isEditingPackageOrder: false,
      editingPackageOrderList: [],
      isDragging: false,

      //交换两玩家卡片
      isSwappingUserCards: false,
      swappingCardsDetails: {
        userA: "",
        cardA: "",
        userB: "",
        cardB: ""
      },

      //交换玩家自己的卡片
      isExchangingUserCard: false,
      exchangeUserCardTips: "",
      exchangeUserCardDetails: {
        targetUser: "",
        oldCardName: "",
        newCardName: "",
        count: 0
      },

      windowWidth: 1000
    };
  },

  mounted() {
    this.generateCandicateCardList();
    this.windowWidth = document.body.clientWidth;
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth;
    };

    this.$on("preloaded", () => {
      this._refreshRoulette();
    });
  },
  methods: {
    handleSelect(index) {
      this.showTab = index;
    },

    async reloadPage() {
      this.$openLoading();
      var tempIndex = this.showTab;
      Object.assign(this.$data, this.$options.data());
      this.showTab = tempIndex;
      this.cardPackageList = await this._queryPackageList();
      this.userList = await this._queryUserList();
      this.$closeLoading();
      this.generateCandicateCardList();
    },

    //生成输入卡片名字时的输入建议列表
    async generateCandicateCardList() {
      let cardList = await this._queryCardList(
        1,
        65535,
        undefined,
        undefined,
        undefined,
        undefined,
        "admin_search"
      );
      this.cardCandicateList = cardList.data.map(item => {
        return {
          value: item.cardName
        };
      });
    },

    querySearchCandicateCardList(queryString, callback) {
      let result = queryString
        ? this.cardCandicateList.filter(this.listFilter(queryString))
        : this.cardCandicateList;
      callback(result);
    },

    listFilter(queryString) {
      return item => {
        return item.value.indexOf(queryString) >= 0;
      };
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
        this.cardPackageList[itemIndex]["packageName"],
        undefined,
        undefined,
        undefined,
        "admin_package"
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
        this.cardPackageList[this.activeItemIndex]["packageName"],
        undefined,
        undefined,
        undefined,
        "admin_package"
      ).then(data => {
        this.$set(this.packageListContent, this.activeItemIndex, data);
        this.$closeLoading();
      });
    },

    addPackage() {
      this.isAddingPackage = true;
    },

    cancelAddingPackage() {
      this.addingPackageData.package = "";
    },

    submitAddingPackage() {
      if (this.addingPackageData.package) {
        this.$openLoading();
        axiosFetch({
          url: addPackageUrl,
          data: {
            package: this.addingPackageData.package
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isAddingPackage = false;
            this.reloadPage();
          }
        });
      }
    },

    editPackage(packageName) {
      this.editingPackageData.oldname = packageName;
      this.isEditingPackage = true;
    },

    cancelEditingPackage() {
      this.editingPackageData.oldname = "";
      this.editingPackageData.newname = "";
    },

    submitEditingPackage() {
      if (this.editingPackageData.newname) {
        this.$openLoading();
        axiosFetch({
          url: editPackageNameUrl,
          data: {
            oldname: this.editingPackageData.oldname,
            newname: this.editingPackageData.newname
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingPackage = false;
            this.reloadPage();
          }
        });
      }
    },

    editPackageDetail(packageName, detail) {
      this.editingPackageDetailData.package = packageName;
      this.editingPackageDetailData.detail = detail;
      this.isEditingPackageDetail = true;
    },

    cancelEditingPackageDetail() {
      this.editingPackageDetailData.package = "";
      this.editingPackageDetailData.detail = "";
    },

    submitEditingPackageDetail() {
      if (this.editingPackageDetailData.detail) {
        this.$openLoading();
        axiosFetch({
          url: editPackageDetailUrl,
          data: {
            package: this.editingPackageDetailData.package,
            detail: this.editingPackageDetailData.detail
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingPackageDetail = false;
            this.reloadPage();
          }
        });
      }
    },

    addCard(packageName) {
      this.addingCardData.package = packageName;
      this.isAddingCard = true;
    },

    cancelAddingCard() {
      this.addingCardData.package = "";
      this.addingCardData.card = "";
      this.addingCardData.rare = "N";
    },

    submitAddingCard() {
      if (this.addingCardData.card) {
        this.$openLoading();
        axiosGet({
          url: addCardUrl,
          data: {
            package: this.addingCardData.package,
            card: this.addingCardData.card,
            rare: this.addingCardData.rare
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isAddingCard = false;
            this.reloadPage();
          }
        });
      }
    },

    batchAddCard(packageName) {
      this.batchAddingCardData.packageName = packageName;
      this.isBatchAddingCard = true;
    },
    cancelBatchAddingCard() {
      Object.assign(
        this.$data.batchAddingCardData,
        this.$options.data().batchAddingCardData
      );
      Object.assign(
        this.$data.tempBatchAddingCardData,
        this.$options.data().tempBatchAddingCardData
      );
    },
    analyseBatchAddingCardList() {
      [
        "nList",
        "rList",
        "srList",
        "hrList",
        "urList",
        "grList",
        "serList"
      ].forEach(item => {
        this.batchAddingCardData[item] = this.tempBatchAddingCardData[item]
          ? this.tempBatchAddingCardData[item].split("|").map(t => t.trim())
          : [];
      });
    },

    submitBatchAddingCard() {
      this.$openLoading();
      axiosPostAsJSON({
        url: addCardUrl,
        data: {
          packageName: this.batchAddingCardData.packageName,
          nList: this.batchAddingCardData.nList,
          rList: this.batchAddingCardData.rList,
          srList: this.batchAddingCardData.srList,
          hrList: this.batchAddingCardData.hrList,
          urList: this.batchAddingCardData.urList,
          grList: this.batchAddingCardData.grList,
          serList: this.batchAddingCardData.serList
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.isBatchAddingCard = false;
          this.$alertSuccess(res.data.data);
          this.reloadPage();
        }
      });
    },
    editCard(row) {
      this.editingCardData.oldname = row.cardName;
      this.editingCardData.newname = row.cardName;
      this.editingCardData.rare = row.rare;
      this.editingCardData.needCoin = row.needCoin;
      this.isEditingCard = true;
    },

    cancelEditingCard() {
      this.editingCardData.oldname = "";
      this.editingCardData.newname = "";
      this.editingCardData.rare = "";
      this.editingCardData.needCoin = 0;
      this.editingCardData.show = false;
    },

    submitEditingCard() {
      if (this.editingCardData.newname) {
        this.$openLoading();
        axiosFetch({
          url: editCardNameUrl,
          data: {
            oldname: this.editingCardData.oldname,
            newname: this.editingCardData.newname,
            newRare: this.editingCardData.rare,
            needCoin: this.editingCardData.needCoin,
            show: Number(this.editingCardData.show) || undefined
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingCard = false;
            this.reloadPage();
          }
        });
      }
    },
    //互换卡片稀有度
    exchangeCard() {
      this.isExchangingCard = true;
    },

    cancelExchangeCard() {
      this.exchangingCardData.card1 = "";
      this.exchangingCardData.card2 = "";
      this.exchangingCardData.show = false;
    },

    submitExchangeCard() {
      if (this.exchangingCardData.card1 && this.exchangingCardData.card2) {
        this.$openLoading();
        axiosFetch({
          url: exchangeCardsRareUrl,
          data: {
            card1: this.exchangingCardData.card1,
            card2: this.exchangingCardData.card2,
            show: Number(this.exchangingCardData.show) || undefined
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isExchangingCard = false;
            this.reloadPage();
          }
        });
      }
    },

    //检索页面 清除条件
    libClearAddition() {
      Object.assign(
        this.$data.libQueryAddition,
        this.$options.data().libQueryAddition
      );
    },

    //检索查询 && 分页切换
    libQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.libQueryAddition.packageName || undefined,
        this.libQueryAddition.cardName || undefined,
        this.libQueryAddition.rare.length > 0
          ? this.libQueryAddition.rare
          : undefined,
        this.libQueryAddition.userName || undefined,
        "admin_search"
      ).then(data => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
    },
    //玩家卡库页面 清除条件
    playerLibClearAddition() {
      Object.assign(
        this.$data.playerLibQueryAddition,
        this.$options.data().playerLibQueryAddition
      );
    },

    //玩家卡库查询 && 分页切换
    playerLibQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.playerLibQueryAddition.packageName || undefined,
        this.playerLibQueryAddition.cardName || undefined,
        this.playerLibQueryAddition.rare.length > 0
          ? this.playerLibQueryAddition.rare
          : undefined,
        this.playerLibQueryAddition.userName || undefined,
        "player_lib"
      ).then(data => {
        this.playerLibPagination.page = data.pagination.page;
        this.playerLibPagination.total = data.pagination.total;
        this.playerLibTableData = data.data;
        this.$closeLoading();
      });
    },
    playerLibExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.playerLibQueryAddition.packageName || undefined,
            this.playerLibQueryAddition.cardName || undefined,
            this.playerLibQueryAddition.rare.length > 0
              ? this.playerLibQueryAddition.rare
              : undefined,
            this.playerLibQueryAddition.userName || undefined,
            "player_lib"
          ).then(data => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then(_res => {
                this.$alertSuccess(_res);
              })
              .catch(_err => {
                this.$alertWarning(_err);
              });

            this.$closeLoading();
          });
        })
        .catch(() => {});
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
      ).then(data => {
        this.recordPagination.page = data.pagination.page;
        this.recordPagination.total = data.pagination.total;
        this.recordTableData = data.data;
        this.$closeLoading();
      });
    },

    //记录 高亮同carkPk行
    recordHighlightRow(row, column, cell, event) {
      this.highlightKey = row["cardPk"];
    },
    recordCancelHighlightRow(row, column, cell, event) {
      this.highlightKey = null;
    },
    recordHightlightClass({row, rowIndex}) {
      if (row["cardPk"] === this.highlightKey) {
        return "record-hightlight-row"
      }
    },
    //新增玩家
    addUser() {
      this.isAddingUser = true;
    },

    cancelAddingUser() {
      this.addingUserData.target = "";
    },

    submitAddingUser() {
      if (this.addingUserData.target) {
        this.$openLoading();
        axiosFetch({
          url: addUserUrl,
          data: {
            target: this.addingUserData.target
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isAddingUser = false;
            this.reloadPage();
          }
        });
      }
    },

    userClearAddition() {
      Object.assign(
        this.$data.userQueryAddition,
        this.$options.data().userQueryAddition
      );
    },

    setUserInfo(userName) {
      let userInfo = this.userList.find(
        element => element.userName === userName
      );
      this.userSelectedInfo.dust = userInfo.dustCount;
      this.userSelectedInfo.award = userInfo.nonawardCount;
      this.userSelectedInfo.duelPoint = userInfo.duelPoint;
      this.userSelectedInfo.coin = userInfo.coin;
      this.userSelectedInfo.roulette = userInfo.roulette;
      this.userSelectedInfo.rollCount = userInfo.rollCount;
    },

    userQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.userQueryAddition.package || undefined,
        this.userQueryAddition.card || undefined,
        this.userQueryAddition.rare.length > 0
          ? this.userQueryAddition.rare
          : undefined,
        this.userQueryAddition.target || undefined,
        "player_lib"
      ).then(data => {
        this.userPagination.page = data.pagination.page;
        this.userPagination.total = data.pagination.total;
        this.userTableData = data.data;
        this.$closeLoading();
      });
    },

    userOwnExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.userQueryAddition.package || undefined,
            this.userQueryAddition.card || undefined,
            this.userQueryAddition.rare.length > 0
              ? this.userQueryAddition.rare
              : undefined,
            this.userQueryAddition.target || undefined,
            "player_lib"
          ).then(data => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then(_res => {
                this.$alertSuccess(_res);
              })
              .catch(_err => {
                this.$alertWarning(_err);
              });

            this.$closeLoading();
          });
        })
        .catch(() => {});
    },

    editCardCount(card, target) {
      this.editingCardCountData.card = card;
      this.editingCardCountData.target = target;
      this.editingCardCountTips = `正在编辑玩家【${target}】的【${card}】`;
      this.isEditingCardCount = true;
    },
    //利用相同接口新增卡牌
    addUserCard() {
      this.editingCardCountData.target = this.userQueryAddition.target;
      this.addingUserCardTips = `正在为玩家【${
        this.userQueryAddition.target
      }】新增卡牌`;
      this.isAddingUserCard = true;
    },
    cancelEditCardCount() {
      this.editingCardCountData.card = "";
      this.editingCardCountData.target = "";
      this.editingCardCountData.count = null;
      this.editingCardCountTips = "";
      this.addingUserCardTips = "";
    },
    submitEditCardCount_() {
      MessageBox.confirm("请确认是否修改", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.showTab === "3") {
            this.submitEditCardCount(this.playerLibQueryCard, 1);
          } else if (this.showTab === "4") {
            this.submitEditCardCount(this.userQuery, 1);
          }
        })
        .catch(() => {});
    },
    //通过
    addUserCardDeck() {
      this.addingUserCardDeckTips = `正在为玩家【${
        this.userQueryAddition.target
      }】新增卡组`;
      this.isAddingUserCardDeck = true;
    },
    cancelAddUserCardDeck() {
      this.addingUserCardDeckTips = "";
      this.$refs["deck_uploader"].clearFiles();
    },
    resetUploadCount(file, filesList) {
      if (filesList.length > 1) {
        filesList.splice(0, 1);
      }
    },
    submitAddUserCardDeck() {
      let files = this.$refs["deck_uploader"].uploadFiles;
      if (files.length === 0) return;
      this.$openLoading();
      let fileItem = files[0];
      if (
        !(fileItem.name.includes(".ydk") || fileItem.name.includes(".YDK"))
      ) {
        this.$alertInfo("存在不支持的文件类型，请移除后提交");
        this.$closeLoading();
        return;
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", () => {
        axiosPostAsJSON({
          url: addUserDeckUrl,
          data: {
            deck: {
              userName: this.userQueryAddition.target,
              ydk: fileReader.result
            }
          }

        }).then(async res => {
          if (res.data.code === 200) {
            this.isAddingUserCardDeck = false;
            this.userList = await this._queryUserList();
            this.setUserInfo(this.userQueryAddition.target);
          }
        }).finally(() => {
          this.$closeLoading();
        })
      })
      fileReader.readAsText(fileItem.raw)
    },

    //编辑卡片数量
    submitEditCardCount(callback, arg) {
      if (
        typeof this.editingCardCountData.count === "number" &&
        this.editingCardCountData.count >= 0 &&
        !!this.editingCardCountData.card
      ) {
        this.$openLoading();
        axiosGet({
          url: editCardCountUrl,
          data: {
            card: this.editingCardCountData.card,
            target: this.editingCardCountData.target,
            count: this.editingCardCountData.count
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingCardCount = false;
            this.isAddingUserCard = false;
            callback(arg);
          }
        });
      }
    },

    editUserInfo(type) {
      this.editingUserInfoItemType = type;
      switch (type) {
        // case "DP":
        //   this.editingUserInfoItemCount = this.userSelectedInfo.duelPoint;
        //   break;
        case "月见黑":
          this.editingUserInfoItemCount = this.userSelectedInfo.award;
          break;
        case "尘数":
          this.editingUserInfoItemCount = this.userSelectedInfo.dust;
          break;
        case "硬币":
          this.editingUserInfoItemCount = this.userSelectedInfo.coin;
          break;
        case "转盘":
          this.editingUserInfoItemCount = this.userSelectedInfo.roulette;
          break;
        case "计数":
          this.editingUserInfoItemCount = this.userSelectedInfo.rollCount;
          break;
      }
      this.editingUserInfoItemTips = `正在编辑玩家【${
        this.userQueryAddition.target
      }】`;
      this.isEditingUserInfoItem = true;
    },

    cancelEditUserInfo() {
      this.editingUserInfoItemType = "";
      this.editingUserInfoItemCount = "";
      this.editingUserInfoItemTips = "";
    },

    submitEditUserInfo() {
      if (
        typeof this.editingUserInfoItemCount === "number"
      ) {
        this.$openLoading();
        let options = {
          url: "",
          data: {
            target: this.userQueryAddition.target
          }
        };
        switch (this.editingUserInfoItemType) {
          case "月见黑":
            options.url = editAwardUrl;
            options.data.award = this.editingUserInfoItemCount;
            break;
          case "尘数":
            options.url = editDustUrl;
            options.data.count = this.editingUserInfoItemCount;
            break;
          case "硬币":
            options.url = editCoinUrl;
            options.data.coin = this.editingUserInfoItemCount;
            break;
          case "转盘":
            options.url = editRouletteUrl;
            options.data.roulette = this.editingUserInfoItemCount;
            break;
          case "计数":
            options.url = editRollCountUrl;
            options.data.rollCount = this.editingUserInfoItemCount;
            break;
        }
        axiosFetch(options).then(async res => {
          if (res.data.code === 200) {
            this.isEditingUserInfoItem = false;
            this.userList = await this._queryUserList();
            this.setUserInfo(this.userQueryAddition.target);
            this.$closeLoading();
            //this.reloadPage();
          }
        });
      }
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
        this.drawRecordQueryAddition.package || undefined,
        this.drawRecordQueryAddition.user || undefined,
        this.drawRecordQueryAddition.dateRange
          ? this.drawRecordQueryAddition.dateRange[0]
          : undefined,
        this.drawRecordQueryAddition.dateRange
          ? this.drawRecordQueryAddition.dateRange[1]
          : undefined,
        this.drawRecordQueryAddition.cardName || undefined
      ).then(data => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },

    //设置抽卡结果是否生效
    setDrawStatus(id, status) {
      this.drawRecordStatusData.status = status;
      this.drawRecordStatusData.id = id;
      this.isSettingDrawRecord = true;
    },

    cancelSetDrawStatus() {
      this.drawRecordStatusData.status = 0;
      this.drawRecordStatusData.id = null;
    },

    submitDrawStatus() {
      this.$openLoading();
      axiosFetch({
        url: setDrawResultUrl,
        data: {
          status: this.drawRecordStatusData.status,
          id: this.drawRecordStatusData.id
        }
      }).then(async res => {
        if (res.data.code === 200) {
          this.isSettingDrawRecord = false;
          this.drawRecordQuery(1);
          this.userList = await this._queryUserList();
          //this.reloadPage();
        }
      });
    },

    //导入已抽得的卡
    importDrewCards() {
      this.isImportingDrewCards = true;
    },
    cancelImportDrewCards() {
      Object.assign(
        this.$data.importingDrewCardsInfo,
        this.$options.data().importingDrewCardsInfo
      );
      this.tempDrewCardsInfo = "";
    },
    analyseImportDrewCards() {
      let regx = /\n\r|\r|\n/g;
      let tempArray = this.tempDrewCardsInfo
        .split(regx)
        .filter(t => !!t)
        .map(t => t.trim());
      let result = [];
      tempArray.forEach(item => {
        result.push(item.split("|").map(t => t.trim()));
      });
      this.importingDrewCardsInfo.cards = result;
    },
    submitImportDrewCards() {
      if (
        this.importingDrewCardsInfo.target &&
        this.importingDrewCardsInfo.cards.length > 0
      ) {
        this.$openLoading();
        axiosPostAsJSON({
          url: importDrewResultUrl,
          data: {
            target: this.importingDrewCardsInfo.target,
            cards: this.importingDrewCardsInfo.cards
          }
        }).then(async res => {
          if (res.data.code === 200) {
            this.isImportingDrewCards = false;
            this.drawRecordQuery(1);
            this.userList = await this._queryUserList();
            //this.reloadPage();
          }
        });
      }
    },

    //编辑卡包排序
    editPackageOrder() {
      this.isEditingPackageOrder = true;
      this.editingPackageOrderList = this.cardPackageList.map(item => {
        return {
          name: item["packageName"],
          order: item["packageId"]
        };
      });
    },
    cancelEditingPackageOrder() {
      this.isEditingPackageOrder = false;
      this.editingPackageOrderList = [];
    },
    submitEditingPackageOrder() {
      this.$openLoading();
      axiosPostAsJSON({
        url: editPackageOrderUrl,
        data: {
          packageIndexList: this.editingPackageOrderList.map(i => i.order)
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.reloadPage();
        }
      });
    },

    //交换玩家持有的卡片
    swapUserCards() {
      this.isSwappingUserCards = true;
    },

    cancelSwapUserCards() {
      Object.assign(
        this.$data.swappingCardsDetails,
        this.$options.data().swappingCardsDetails
      );
    },

    submitSwapUserCards() {
      MessageBox.confirm("请确认是否交换", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let temp = this.swappingCardsDetails;
          if (temp.cardA && temp.cardB && temp.userA && temp.userB) {
            this.$openLoading();
            axiosPostAsJSON({
              url: swapUserOwnCardUrl,
              data: {
                userA: temp.userA,
                cardA: temp.cardA,
                userB: temp.userB,
                cardB: temp.cardB
              }
            }).then(res => {
              if (res.data.code === 200) {
                this.reloadPage();
              }
            });
          }
        })
        .catch(() => {});
    },

    submitResetPassword() {
      let confirmStr = `是否重置玩家【${
        this.userQueryAddition.target
      }】的密码？`;
      MessageBox.confirm(confirmStr, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$openLoading();
          let param = {
            url: resetPasswordUrl,
            data: {
              target: this.userQueryAddition.target
            }
          }
          axiosGet(param).then(async res => {
            if (res.data.code === 200) {
              this.userList = await this._queryUserList();
              this.setUserInfo(this.userQueryAddition.target);
              this.$closeLoading();
              //this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    //交换玩家持有的卡片
    exchangeUserCard() {
      this.exchangeUserCardDetails.targetUser = this.userQueryAddition.target;
      this.exchangeUserCardTips = `正在替换玩家【${
        this.userQueryAddition.target
      }】的卡片`;
      this.isExchangingUserCard = true;
    },

    cancelExchangeUserCard() {
      this.exchangeUserCardTips = "";
      Object.assign(
        this.$data.exchangeUserCardDetails,
        this.$options.data().exchangeUserCardDetails
      );
    },

    submitExchangeUserCard() {
      MessageBox.confirm("请确认是否替换", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let temp = this.exchangeUserCardDetails;
          if (temp.targetUser && temp.oldCardName && temp.newCardName) {
            this.$openLoading();
            let param = {
              url: changeUserOwnCardUrl,
              data: {
                targetUser: temp.targetUser,
                oldCardName: temp.oldCardName,
                newCardName: temp.newCardName,
                count: temp.count
              }
            }
            axiosPostAsJSON(param).then(async res => {
              if (res.data.code === 200) {
                this.isExchangingUserCard = false;
                this.userList = await this._queryUserList();
                this.setUserInfo(this.userQueryAddition.target);
                this.$closeLoading();
                //this.reloadPage();
              }
            });
          }
        })
        .catch(() => {});
    },

    // 日志
    logClearAddition() {
      Object.assign(
        this.$data.logQueryAddition,
        this.$options.data().logQueryAddition
      );
    },

    logQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryLogList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.logQueryAddition.operator || undefined,
        this.logQueryAddition.detail || undefined,
        this.logQueryAddition.dateRange
          ? this.logQueryAddition.dateRange[0]
          : undefined,
        this.logQueryAddition.dateRange
          ? this.logQueryAddition.dateRange[1]
          : undefined
      ).then(data => {
        this.logPagination.page = data.pagination.page;
        this.logPagination.total = data.pagination.total;
        this.logTableData = data.data;
        this.$closeLoading();
      });
    },

    //转盘配置操作
    addRouletteLine() {
      this.rouletteConfigData.push({detail: "", rate: "", color: ""});
      this._refreshRoulette();
    },
    deleteRouletteLine(index) {
      this.rouletteConfigData.splice(index, 1);
      this._refreshRoulette();
    },
    async refreshRouletteConfig() {
      this.$openLoading();
      this.rouletteConfigData = await this._queryRouletteConfig();
      this._refreshRoulette();
      this.$closeLoading();
    },
    submitRouletteConfig() {
      this.$openLoading();
      let param = {
        url: editRouletteConfigUrl,
        data: {
          list: this.rouletteConfigData
        }
      }
      axiosPostAsJSON(param).then(async res => {
        if (res.data.code === 200) {
          this.refreshRouletteConfig();
        }
      });
    }
  }
};
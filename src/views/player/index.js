import { axiosFetch, axiosGet } from "@/utils/fetch.js";
import common from "../mixins/common";
import MD5 from "crypto-js/md5";
import { MessageBox } from "element-ui";
import {
  transDustToCardUrl,
  transDustToCardRandomUrl,
  transCardToDustUrl,
  transCoinToCardUrl,
  runRouletteUrl,
  searchRouletteHistoryUrl
} from "@/config/url.js";
import CardDesc from "@/components/CardDesc";
import DeckGenerator from "../common/DeckGenerator/index";
import { exportToExcelByJson } from "@/utils/xlsx";
import { LuckyWheel } from "vue-luck-draw";
import { axiosPostAsJSON } from '../../utils/fetch';
import { exchangeCardsRareUrl } from '../../config/url';
import NavTabs from "@/components/navs/NavTabs";
import NavItem from "@/components/navs/NavItem";
import {debounce} from "throttle-debounce";
export default {
  name: "Player",
  mixins: [common],
  components: {
    CardDesc,
    DeckGenerator,
    LuckyWheel,
    NavTabs,
    NavItem
  },
  data() {
    return {
      leftDust: 0,
      coin: 0,
      leftAward: 0,
      duelPoint: 0,
      roulette: 0,
      rollCount: 0,

      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      cardCandidateList: [],

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
        searchInCollection: "",
      },
      libTableData: [],
      //玩家卡库查询
      playerLibPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      playerLibQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: "",
      },
      playerLibTableData: [],

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
      highlightKey: null,

      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      drawRecordQueryAddition: {
        package: [],
        user: [],
        cardName: "",
        dateRange: null,
      },
      drawRecordTableData: [],

      //合成卡片
      isFusingCard: false,
      isFusingCardInner: false,
      fusingCardType: "", //'standard' 'random'
      fusingCardData: {
        package: "",
        card: "",
        dustFirst: false,
      },

      //卡转尘
      isTurningToDust: false,
      turnToDustInfo: {
        card: "",
        count: null,
        basicCount: null,
      },

      //转盘
      rouletteResult: "",
      rouletteHistory: [],
      rouletteHistoryPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },

      windowWidth: 1000,
      windowHeight: 2000,

      isScrolledOutScreen_FOR_MOBILE: false
    };
  },
  computed: {
    wheelScaleWidth() {
      if (this.windowWidth < 800) {
        return this.windowWidth * 0.6 / 800
      } else {
        return this.windowWidth * 0.3 / 800
      }
    }
  },
  async mounted() {
    this.generateCandidateCardList();
    this.$on("preloaded", () => {
      let userInfo = this.userList.find(
        (element) => element.userName === this.username
      );
      if (userInfo) {
        this.duelPoint = userInfo.duelPoint;
        this.leftDust = userInfo.dustCount;
        this.leftAward = userInfo.nonawardCount;
        this.coin = userInfo.coin;
        this.roulette = userInfo.roulette;
        this.rollCount = userInfo.rollCount;
      }
      if (
        JSON.parse(window.localStorage.getItem("info")).p ===
        MD5("123456").toString()
      ) {
        MessageBox.confirm("正在使用默认密码，是否修改？", "提示", {
          confirmButtonText: "前往修改",
          cancelButtonText: "暂不",
          type: "info",
        })
          .then(() => {
            this.$router.push("/edit_password");
          })
          .catch(() => {});
      }
      this._refreshRoulette();
    });

    this.windowWidth = document.body.clientWidth;
    this.windowHeight = document.body.clientHeight;
    window.onresize = () => {
      this.windowWidth = document.body.clientWidth;
      this.windowHeight = document.body.clientHeight;
    }
    const ele = document.getElementById("player");
    ele.onscroll = debounce(100, false, () => {
      this.isScrolledOutScreen_FOR_MOBILE = (ele.scrollTop > ele.clientHeight)
    })
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
      this.rouletteConfigData = await this._queryRouletteConfig();
      let userInfo = this.userList.find(
        (element) => element.userName === this.username
      );
      if (userInfo) {
        this.duelPoint = userInfo.duelPoint;
        this.leftDust = userInfo.dustCount;
        this.leftAward = userInfo.nonawardCount;
        this.coin = userInfo.coin;
        this.roulette = userInfo.roulette;
        this.rollCount = userInfo.rollCount;
      }
      this._refreshRoulette();
      this.$closeLoading();
      this.generateCandidateCardList();

      this.windowWidth = document.body.clientWidth;
      window.onresize = () => {
        this.windowWidth = document.body.clientWidth;
      }
    },

    //滚动至顶
    scrollToTop() {
      document.getElementById('player').scrollTop = 0
    },

    //生成输入卡片名字时的输入建议列表
    async generateCandidateCardList() {
      let cardList = await this._queryCardList(
        1,
        65535,
        undefined,
        undefined,
        undefined,
        undefined,
        "admin_search"
      );
      this.cardCandidateList = cardList.data.map((item) => {
        return {
          value: item.cardName,
        };
      });
    },

    querySearchCandidateCardList(queryString, callback) {
      let result = queryString
        ? this.cardCandidateList.filter(this.listFilter(queryString))
        : [];
      callback(result);
    },

    listFilter(queryString) {
      return (item) => {
        return item.value.indexOf(queryString) >= 0;
      };
    },

    //情报页面点击手风琴面板时触发
    async handleItemChange(itemIndex) {
      console.log(itemIndex)
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
        "player_info"
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
        "player_info"
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
        this.libQueryAddition.userName || undefined,
        "player_lib"
      ).then((data) => {
        this.playerLibPagination.page = data.pagination.page;
        this.playerLibPagination.total = data.pagination.total;
        this.playerLibTableData = data.data;
        this.$closeLoading();
      });
    },

    //全卡池卡库查询 && 分页切换
    libAllQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.libQueryAddition.packageName || undefined,
        this.libQueryAddition.cardName || undefined,
        this.libQueryAddition.rare || undefined,
        this.libQueryAddition.userName || undefined,
        "admin_search",
        this.libQueryAddition.searchInCollection
      ).then((data) => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
    },

    setToMineInLib() {
      this.libQueryAddition.userName = [];
      this.libQueryAddition.userName.push(this.username);
      this.libQueryCard();
    },
    libExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.libQueryAddition.packageName || undefined,
            this.libQueryAddition.cardName || undefined,
            this.libQueryAddition.rare || undefined,
            this.libQueryAddition.userName || undefined,
            "player_lib"
          ).then((data) => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then((_res) => {
                this.$alertSuccess(_res);
              })
              .catch((_err) => {
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
      ).then((data) => {
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
    recordHightlightClass({ row, rowIndex }) {
      if (row["cardPk"] === this.highlightKey) {
        return "record-hightlight-row";
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
      ).then((data) => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },
    setToMineInRecord() {
      this.drawRecordQueryAddition.user = [];
      this.drawRecordQueryAddition.user.push(this.username);
      this.drawRecordQuery();
    },

    fuseCard() {
      this.isFusingCard = true;
    },
    fuseCardInner(type) {
      this.isFusingCardInner = true;
      this.fusingCardType = type;
    },

    cancelFusingCard() {
      this.fusingCardType = "";
      this.fusingCardData.package = "";
      this.fusingCardData.card = "";
      this.fusingCardData.dustFirst = false;
    },
    submitFusingCard() {
      if (this.fusingCardType === "standard" && !this.fusingCardData.card)
        return;
      if (this.fusingCardType === "random" && !this.fusingCardData.package)
        return;
      MessageBox.confirm("请确认是否合成", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$openLoading();
          let options = {
            url: "",
            data: {},
          };
          if (this.fusingCardType === "standard") {
            options.url = transDustToCardUrl;
            options.data.card = this.fusingCardData.card;
          }
          if (this.fusingCardType === "random") {
            options.url = transDustToCardRandomUrl;
            options.data.package = this.fusingCardData.package;
            options.data.dustFirst = Number(this.fusingCardData.dustFirst);
          }
          axiosFetch(options).then((res) => {
            if (res.data.code === 200) {
              this.isFusingCardInner = false;
              this.isFusingCard = false;
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    //转化多余闪为尘
    checkIfTurnColumnShow(row) {
      return (
        row.count > 3 &&
        ["UR", "SR", "HR"].includes(row.rare) &&
        row.userName === this.username
      );
    },
    turnToDust(row) {
      this.turnToDustInfo.card = row.cardName;
      this.turnToDustInfo.count = row.count - 3;
      this.turnToDustInfo.basicCount = row.count;
      this.isTurningToDust = true;
    },
    cancelTurnToDust() {
      this.turnToDustInfo.card = "";
      this.turnToDustInfo.count = null;
      this.turnToDustInfo.basicCount = null;
    },
    submitTurnToDust() {
      let temp = this.turnToDustInfo;
      let regx = /^[1-9][0-9]*$/;
      if (!regx.test(temp.count) || temp.count > temp.basicCount - 3) {
        this.$alertInfo("请输入合适的数量");
        return;
      }
      MessageBox.confirm(
        `是否将${temp.count}张【${temp.card}】转化为尘？`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$openLoading();
          axiosGet({
            url: transCardToDustUrl,
            data: {
              card: temp.card,
              count: temp.count,
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.isTurningToDust = false;
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    checkIfCanCollect(row) {
      return row.inCollection === 0;
    },

    checkIfCanDisCollect(row) {
      return row.inCollection === 1;
    },

    toCollection(row) {
      this._collectionOperation(row.cardName, 1).then((res) => {
        if (res.data.code === 200) {
          this.libAllQueryCard(this.libPagination.page);
        }
      });
    },

    disCollection(row) {
      this._collectionOperation(row.cardName, 2).then((res) => {
        if (res.data.code === 200) {
          this.libAllQueryCard(this.libPagination.page);
        }
      });
    },

    checkIfCanUseCoin(row) {
      return row.needCoin > 0 && row.needCoin <= this.coin && row.count === 0;
    },

    confirmUseCoin(row) {
      MessageBox.confirm(
        `是否使用${row.needCoin}枚硬币兑换【${row.cardName}】？`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$openLoading();
          axiosGet({
            url: transCoinToCardUrl,
            data: {
              cardName: row.cardName,
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    startRoulette() {
      if (this.roulette <= 0) {
        this.$alertWarning("你的转盘次数已用完！");
        return;
      }
      if (this.rouletteConfigData.length <= 0) {
        this.$alertWarning("转盘未设置，请联系管理员！");
        return;
      }

      this.roulette -= 1;
      this.$refs.LuckyWheel.play();
      axiosPostAsJSON({
        url: runRouletteUrl,
        data: {}
      }).then((res) => {
        if (res.data.code === 200) {
          var data = res.data.data;
          this.rouletteResult = data.result;
          this.$refs.LuckyWheel.stop(data.index);
        } else {
          this.rouletteResult = res.data.data;
          this.$refs.LuckyWheel.stop(-1);
        }
      });
    },
    endRoulette(prize) {
      this.$alertSuccess(this.rouletteResult);
      this.refreshRouletteHistory(this.rouletteHistoryPagination);
    },
    refreshRouletteHistory(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      axiosPostAsJSON({
        url: searchRouletteHistoryUrl,
        data: {
          page: currPage || this.defaultPage,
          pagesize: this.rouletteHistoryPagination.pageSize || this.defaultPageSize,
        }
      }).then((data) => {
        this.rouletteHistoryPagination.page = data.data.data.currPage;
        this.rouletteHistoryPagination.total = data.data.data.totalCount;
        this.rouletteHistory = data.data.data.dataList;
        this.$closeLoading();
      });
    },
  },
};
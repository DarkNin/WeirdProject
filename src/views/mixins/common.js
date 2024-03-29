import {
    axiosFetch,
    axiosGet,
    axiosPostAsJSON
} from '@/utils/fetch'
import {
    searchOwningCardUrl,
    searchCardUrl,
    queryCardPackageListUrl,
    searchEditedRecordUrl,
    searchUserUrl,
    queryDrawResultUrl,
    queryLogUrl,
    collectionOpeationUrl,
    searchRouletteConfigUrl
} from "@/config/url.js";
import {
    openLoading,
    closeLoading
} from '@/utils/loading';
import Moment from 'moment';

//格式化传参时稀有度列表的顺序
const formatRareListSeq = (arr) => {
    if (arr === undefined) {
        return undefined;
    }
    let tempArr = [];
    ["N", "R", "SR", "UR", "HR", "GR", "SER"].forEach(item => {
        if (arr.indexOf(item) >= 0) {
            tempArr.push(item)
        }
    })
    return tempArr;
}

export default {
    data() {
        return {
            username: JSON.parse(window.localStorage.getItem("info")).u,
            userList: [],
            cardPackageList: [],
            defaultPage: 1,
            defaultPageSize: 20,
            pickerOptions: {
                shortcuts: [{
                    text: '最近24小时',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近3天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近1周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            isShowingCardDesc: false,
            cardDesc: {
                x: 0,
                y: 0,
                desc: "",
                picId: 0,
            },
            
            //转盘配置
            rouletteConfigData: [],
            roulettePrizes: []
        }

    },

    async mounted() {
        openLoading();
        this.cardPackageList = await this._queryPackageList();
        this.userList = await this._queryUserList();
        this.rouletteConfigData = await this._queryRouletteConfig();
        closeLoading();
        this.$emit('preloaded');
    },
    methods: {
        //查询玩家列表
        _queryUserList() {
            return new Promise((resolve) => {
                axiosFetch({
                    url: searchUserUrl,
                    data: {
                        page: 1,
                        pagesize: 65535,
                    },
                }).then((res) => {
                    resolve(res.data.data.dataList);
                });
            });
        },

        //查询卡包列表
        _queryPackageList() {
            return new Promise((resolve) => {
                axiosFetch({
                    url: queryCardPackageListUrl,
                }).then((res) => {
                    resolve(res.data.data);
                });
            });
        },

        //查询卡片列表
        _queryCardList(page, pageSize, _package, card, rare, target, type, collection=undefined) {
            let url;
            switch (type) {
                case 'admin_package':
                    url = searchCardUrl;
                    break;
                case 'admin_search':
                    url = searchCardUrl;
                    break;
                case 'player_info':
                    url = searchCardUrl;
                    break;
                case 'player_lib':
                    url = searchOwningCardUrl;
                    break;
            }
            return this._queryList(page, pageSize, _package, card, rare, target, url, collection)
        },
        _queryList(page, pageSize, _package, card, rare, target, url, collection) {
            return new Promise((resolve) => {
                axiosPostAsJSON({
                    url: url,
                    data: {
                        packageNameList: _package,
                        cardName: card,
                        rareList: formatRareListSeq(rare),
                        targetUserList: target,
                        page: page || this.defaultPage,
                        pagesize: pageSize || this.defaultPageSize,
                        searchInCollection: collection || undefined
                    },
                }).then((res) => {
                    resolve({
                        pagination: {
                            page: res.data.data.currPage,
                            total: res.data.data.totalCount,
                            pageSize: res.data.data.pageSize
                        },
                        data: res.data.data.dataList,
                    });
                });
            });
        },

        //查询记录列表
        _queryRecordList(page, pageSize, _package, card, rare) {
            return new Promise((resolve) => {
                axiosPostAsJSON({
                    url: searchEditedRecordUrl,
                    data: {
                        packageNameList: _package,
                        cardName: card,
                        rareList: formatRareListSeq(rare),
                        page: page || this.defaultPage,
                        pagesize: pageSize || this.defaultPageSize,
                    },
                }).then((res) => {
                    resolve({
                        pagination: {
                            page: res.data.data.currPage,
                            total: res.data.data.totalCount,
                            pageSize: res.data.data.pageSize
                        },
                        data: res.data.data.dataList,
                    });
                });
            });
        },

        //查询记录列表
        _queryDrawRecordList(page, pageSize, _package, user, startTime, endTime, cardName) {
            return new Promise((resolve) => {
                axiosPostAsJSON({
                    url: queryDrawResultUrl,
                    data: {
                        packageNameList: _package,
                        userNameList: user,
                        page: page || this.defaultPage,
                        pagesize: pageSize || this.defaultPageSize,
                        startTime: startTime ? Math.floor(new Date(startTime).getTime() / 1000) : undefined,
                        endTime: endTime ? Math.floor(new Date(endTime).getTime() / 1000) : undefined,
                        cardName: cardName
                    },
                }).then((res) => {
                    resolve({
                        pagination: {
                            page: res.data.data.currPage,
                            total: res.data.data.totalCount,
                            pageSize: res.data.data.pageSize
                        },
                        data: res.data.data.dataList,
                    });
                });
            });
        },

        //查询日志
        _queryLogList(page, pageSize, user, detail, startTime, endTime) {
            return new Promise((resolve) => {
                axiosPostAsJSON({
                    url: queryLogUrl,
                    data: {
                        page: page || this.defaultPage,
                        pagesize: pageSize || this.defaultPageSize,
                        operator: user,
                        detail: detail,
                        startTime: startTime ? Math.floor(new Date(startTime).getTime() / 1000) : undefined,
                        endTime: endTime ? Math.floor(new Date(endTime).getTime() / 1000) : undefined
                    },
                }).then((res) => {
                    resolve({
                        pagination: {
                            page: res.data.data.currPage,
                            total: res.data.data.totalCount,
                            pageSize: res.data.data.pageSize
                        },
                        data: res.data.data.dataList,
                    });
                });
            });
        },

        //收藏卡片操作
        _collectionOperation(cardName, operation) {
            return axiosPostAsJSON({
                url: collectionOpeationUrl,
                data: {
                    cardName: cardName,
                    op: operation
                },
            });
        },

        //列表稀有度图标
        _getRareColor(rare) {
            switch (rare) {
                case "N":
                    return "color-normal";
                case "R":
                    return "color-rare";
                case "SR":
                case "UR":
                case "SER":
                case "GR":
                case "HR":
                    return "color-ultra-rare";
            }
        },

        _checkAnyUsingCoin(data) {
            let result = false;
            for (let i = 0; i < data.length; i++) {
                let row = data[i]
                if (row.needCoin > 0) {
                    result = true;
                    return true;
                }
            }
            return result;
        },

        //查询转盘配置
        _queryRouletteConfig() {
            return new Promise((resolve) => {
                axiosPostAsJSON({
                    url: searchRouletteConfigUrl,
                }).then((res) => {
                    resolve(res.data.data);
                });
            });
        },
        // 刷新转盘数据
        _refreshRoulette() {
            var prizes = []
            this.rouletteConfigData.forEach((item, index) => {
                prizes.push({
                    background: item.color,
                    fonts: [{
                        text: item.detail,
                        top: "20px"
                    }]
                })
            });
            this.roulettePrizes = prizes;
        },

        //检测是否移动端应用
        _checkIfMobile() {
            return 'ontouchend' in document.body;
        },

        //PC-鼠标悬浮时显示卡片描述
        _showCardDescHover(event, desc, pid) {
            if (this._checkIfMobile()) return;
            let tarRect = event.target.getBoundingClientRect();
            let currentX = tarRect.x + tarRect.width / 2;
            if (currentX < 600) {
                this.cardDesc.x = Math.ceil(currentX + 600);
            } else {
                this.cardDesc.x = Math.ceil(currentX);
            }
            this.cardDesc.y = Math.floor(tarRect.y + tarRect.height / 2);
            this.cardDesc.desc = desc;
            this.cardDesc.picId = pid;
            this.isShowingCardDesc = true;
        },

        //移动端-点击时显示卡片描述
        _showCardDescClick(event, desc, pid) {
            if (!this._checkIfMobile()) return;
            this.cardDesc.desc = desc;
            this.cardDesc.picId = pid;
            this.isShowingCardDesc = true;
        },
        //关闭卡片描述
        _closeCardDesc() {
            this.isShowingCardDesc = false;
        },

        //根据查询得数据生成用于导出的数据
        // 返回 {data: 列表数组, fileName: 文件名(不含后缀)}
        _generateLibDataForExport(data) {
            let sheetHeader = ['卡包名', '卡名', '稀有度', '持有者', '持有数']
            let sheet = data.map(item => [item.packageName, item.cardName, item.rare, item.userName, item.count]);
            sheet.unshift(sheetHeader);
            return {
                data: sheet,
                fileName: `诡异-导出-${Moment().format('YYYYMMDDhhmmss')}`
            }
        }

    }
}
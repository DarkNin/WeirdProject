import {
    axiosFetch
} from '@/utils/fetch'
import {
    searchOwningCardUrl,
    searchCardUrl,
    queryCardPackageListUrl,
    searchEditedRecordUrl,
    searchUserUrl,
    queryDrawResultUrl
} from "@/config/url.js";
import {
    openLoading,
    closeLoading
} from '@/utils/loading';


export default {
    data() {
        return {
            username: JSON.parse(window.localStorage.getItem("info")).u,
            userList: [],
            cardPackageList: [],
            defaultPage: 1,
            defaultPageSize: 20,
        }

    },

    async mounted() {
        openLoading();
        this.cardPackageList = await this._queryPackageList();
        this.userList = await this._queryUserList();
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
        _queryCardList(page, pageSize, _package, card, rare, target, type) {
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
            return this._queryList(page, pageSize, _package, card, rare, target, url)
        },
        _queryList(page, pageSize, _package, card, rare, target, url) {
            return new Promise((resolve) => {
                axiosFetch({
                    url: url,
                    data: {
                        package: _package,
                        card: card,
                        rare: rare,
                        target: target,
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
        _queryRecordList(page, pageSize, _package, card, rare) {
            return new Promise((resolve) => {
                axiosFetch({
                    url: searchEditedRecordUrl,
                    data: {
                        package: _package,
                        card: card,
                        rare: rare,
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
        _queryDrawRecordList(page, pageSize, _package, user) {
            return new Promise((resolve) => {
                axiosFetch({
                    url: queryDrawResultUrl,
                    data: {
                        package: _package,
                        user: user,
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

        //列表稀有度图标
        _getRareColor(rare) {
            switch (rare) {
                case "N":
                    return "color-normal";
                case "R":
                    return "color-rare";
                case "SR":
                case "UR":
                case "HR":
                    return "color-ultra-rare";
            }
        },
    }
}
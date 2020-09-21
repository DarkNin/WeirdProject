const BASE_URL = '/weird_project';
const Url = {
    //管理端
    //卡片列表
    //全卡片搜索
    searchCardUrl: BASE_URL + '/card/list/admin',
    //添加卡片信息
    addCardUrl: BASE_URL + '/card/add',
    //修改卡片名
    editCardNameUrl: BASE_URL + '/card/update',
    //卡片拥有情况搜索
    searchOwningCardUrl: BASE_URL + '/card/list',
    //卡片修改记录搜索
    searchEditedRecordUrl: BASE_URL + '/card/history',

    //卡包
    //新增卡包
    addPackageUrl: BASE_URL + '/package/add',
    //编辑包名
    editPackageNameUrl: BASE_URL + '/package/update',
    //查询卡包列表
    queryCardPackageListUrl: BASE_URL + '/package/list',

    //用户
    //新增用户
    addUserUrl: BASE_URL + '/user/add',
    //修改用户持有卡片数量
    editCardCountUrl: BASE_URL + '/user/card/update',
    //修改尘数
    editDustUrl: BASE_URL + '/user/dust',
    //修改月见黑计数
    editAwardUrl: BASE_URL + '/user/award',
    //查询用户信息
    searchUserUrl: BASE_URL + '/user/list',

    //抽卡
    //设置抽卡结果
    setDrawResultUrl: BASE_URL + '/roll/set',
    //查询抽卡结果
    queryDrawResultUrl: BASE_URL + '/roll/list',


    //玩家端
    //尘转卡
    transDustToCardUrl: BASE_URL + '/user/card/change',
}



module.exports = {
    interfaceList: [{
            url: Url.searchCardUrl,
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [{
                            "cardName": "义豪灵蜥",
                            "packageName": "再造的世界",
                            "rare": "N"
                        },
                        {
                            "cardName": "巨歧蜥·魔蜥义豪",
                            "packageName": "再造的世界",
                            "rare": "N"
                        },
                        {
                            "cardName": "歧蜥·魔蜥义豪",
                            "packageName": "再造的世界",
                            "rare": "N"
                        },
                        {
                            "cardName": "魔蜥义豪",
                            "packageName": "再造的世界",
                            "rare": "N"
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 4,
                    "totalPage": 1
                }
            }
        },
        {
            url: Url.addCardUrl,
            response: {
                "code": 200,
                "data": "添加成功！"
            }
        },
        {
            url: Url.editCardNameUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.searchOwningCardUrl,
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [{
                            "cardName": "一骑加势",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "N",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        },
                        {
                            "cardName": "义豪灵蜥",
                            "count": 0,
                            "packageName": "再造的世界",
                            "rare": "R",
                            "userName": "test"
                        },
                        {
                            "cardName": "除草兽",
                            "count": 3,
                            "packageName": "再造的世界",
                            "rare": "UR",
                            "userName": "test"
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 30,
                    "totalPage": 1
                }
            }
        },
        {
            url: Url.searchEditedRecordUrl,
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [{
                            "createdTime": "2020-09-12 18:30:07",
                            "newName": "草泥马",
                            "oldName": "除草兽",
                            "packageName": "再造的世界",
                            "rare": "N"
                        },
                        {
                            "createdTime": "2020-09-12 17:54:30",
                            "newName": "除草兽",
                            "oldName": "草",
                            "packageName": "再造的世界",
                            "rare": "N"
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 2,
                    "totalPage": 1
                }
            }
        },
        {
            url: Url.addPackageUrl,
            response: {
                "code": 200,
                "data": "新增成功！"
            }
        },
        {
            url: Url.editPackageNameUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.queryCardPackageListUrl,
            response: {
                "code": 200,
                "data": [{
                        "packageId": 1,
                        "packageName": "咕咕咕1"
                    },
                    {
                        "packageId": 2,
                        "packageName": "咕咕咕2"
                    },
                    {
                        "packageId": 3,
                        "packageName": "咕咕咕3"
                    },
                    {
                        "packageId": 4,
                        "packageName": "咕咕咕4"
                    },
                ]
            }
        },
        {
            url: Url.addUserUrl,
            response: {
                "code": 200,
                "data": "添加成功！"
            }
        },
        {
            url: Url.editCardCountUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.editDustUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.editAwardUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.searchUserUrl,
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [{
                            "duelPoint": 0,
                            "dustCount": 0,
                            "nonawardCount": 0,
                            "userId": 8,
                            "userName": "新用户"
                        },
                        {
                            "duelPoint": 0,
                            "dustCount": 1,
                            "nonawardCount": 1,
                            "userId": 9,
                            "userName": "新的用户"
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 2,
                    "totalPage": 1
                }
            }
        },
        {
            url: Url.setDrawResultUrl,
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: Url.queryDrawResultUrl,
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [{
                            "isDisabled": 0,
                            "rollId": 4,
                            "rollPackageName": "再造的世界",
                            "rollResult": [{
                                    "cardName": "怨念之魂 业火",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "喔喔雏鸡",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "增草剂",
                                    "rare": "R"
                                }
                            ],
                            "rollUserName": "新的用户",
                            "time": "2020-09-06 13:27:19"
                        },
                        {
                            "isDisabled": 0,
                            "rollId": 3,
                            "rollPackageName": "再造的世界",
                            "rollResult": [{
                                    "cardName": "除草兽",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "义豪灵蜥",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "一骑加势",
                                    "rare": "N"
                                }
                            ],
                            "rollUserName": "test",
                            "time": "2020-09-05 17:48:00"
                        },
                        {
                            "isDisabled": 0,
                            "rollId": 2,
                            "rollPackageName": "再造的世界",
                            "rollResult": [{
                                    "cardName": "除草兽",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "义豪灵蜥",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "一骑加势",
                                    "rare": "N"
                                }
                            ],
                            "rollUserName": "test",
                            "time": "2020-09-05 16:55:38"
                        },
                        {
                            "isDisabled": 0,
                            "rollId": 1,
                            "rollPackageName": "再造的世界",
                            "rollResult": [{
                                    "cardName": "除草兽",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "义豪灵蜥",
                                    "rare": "N"
                                },
                                {
                                    "cardName": "一骑加势",
                                    "rare": "N"
                                }
                            ],
                            "rollUserName": "test",
                            "time": "2020-09-05 16:53:11"
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 4,
                    "totalPage": 1
                }
            }
        },
        {
            url: Url.transDustToCardUrl,
            response: {
                "code": 500,
                "data": "转换失败！"
            }
        }
    ]
}
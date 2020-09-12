//const Url = require('./src/config/_url');
import {searchCardUrl} from ('./src/config/url')
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
            url: Url.transDustToCardUrl,
            response: {
                "code": 500,
                "data": "转换失败！"
            }
        }
    ]
}
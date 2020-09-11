module.exports = {
    interfaceList: [{
            url: '/card/list/admin',
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
            url: '/card/add',
            response: {
                "code": 200,
                "data": "添加成功！"
            }
        },
        {
            url: '/card/update',
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: '/card/list',
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [
                        {
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
                        }
                    ],
                    "pageSize": 20,
                    "totalCount": 3,
                    "totalPage": 1
                }
            }
        },
        {
            url: '/package/add',
            response: {
                "code": 200,
                "data": "新增成功！"
            }
        },
        {
            url: '/package/update',
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: '/package/list',
            response:{
                "code": 200,
                "data": [
                    {
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
            url: '/user/add',
            response: {
                "code": 200,
                "data": "添加成功！"
            }
        },
        {
            url: '/user/card/update',
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: '/user/dust',
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: '/user/award',
            response: {
                "code": 200,
                "data": "修改成功！"
            }
        },
        {
            url: '/user/list',
            response: {
                "code": 200,
                "data": {
                    "currPage": 1,
                    "dataList": [
                        {
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
            url: '/user/card/change',
            response: {
                "code": 500,
                "data": "转换失败！"
            }
        }
    ]
}
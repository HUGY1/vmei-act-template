const Mock = require('mockjs')

Mock.mock(/\/serverTime/, {
    "success": true,
    "msg": "操作成功",
    "data": {
        "serverTimes": Date.parse(new Date()),
        "serverTime": "2019-01-04 15:10:05"
    },
    "apiCode": 0
})
Mock.mock(/\/vmeiActivity\//, {
    "success": true,
    "msg": "操作成功",
    "data": {
        "channelList|2-4": [
            {
                "id": 2618,
                "activityId": 533,
                "name": "热卖爆款",
                "orderNum": 5,
                "accomplishId": 0,
                "status": 0,
                "productList|4-6": [
                    {
                        "marketPrice": "685.00",
                        "price": "628.00",
                        "pictureUrl": "https://img01.vmei.com/201701/C0C5F93BE54B4F698CA2164679BCE709.jpg",
                        "customPictureUrl": null,
                        "freeShipping": false,
                        "name": "Estee Lauder/雅诗兰黛 多效智妍面霜50ml 黄金抗衰老 提拉紧致 抗皱保湿",
                        "postCount": 104,
                        "activityName": [
                            "限时打折"
                        ],
                        "function": [

                        ],
                        "storage": 9999969,
                        "productId": 501968,
                        "activityChannelProductId": 0,
                        "promotionTempName": "",
                        "orderNum": 0,
                        "tagName": null,
                        "brand": null,
                        "defaultSku": null,
                        "futurePrice": null,
                        "useSpecialPrice": false
                    }
                ]
            },
        ]
    },
    "apiCode": 0
})

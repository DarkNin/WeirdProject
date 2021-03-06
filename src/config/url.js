//修改mock数据请同步修改mock.config.js

const BASE_URL = '/weird_project';
//const BASE_URL = '';

//管理端
//卡片列表
//全卡片搜索
const searchCardUrl = BASE_URL + '/card/list';
//添加卡片信息
const addCardUrl = BASE_URL + '/card/add';
//修改卡片名
const editCardNameUrl = BASE_URL + '/card/update';
//卡片拥有情况搜索
const searchOwningCardUrl = BASE_URL + '/card/ownlist';
//卡片修改记录搜索
const searchEditedRecordUrl = BASE_URL + '/card/history';
//互换卡片稀有度
const exchangeCardsRareUrl = BASE_URL + '/card/exchange';

//卡包
//新增卡包
const addPackageUrl = BASE_URL + '/package/add';
//编辑包名
const editPackageNameUrl = BASE_URL + '/package/update';
//查询卡包列表
const queryCardPackageListUrl = BASE_URL + '/package/list';
//编辑卡包排序
const editPackageOrderUrl = BASE_URL + '/package/sort';

//用户
//新增用户
const addUserUrl = BASE_URL + '/user/add';
//修改用户持有卡片数量
const editCardCountUrl = BASE_URL + '/user/card/update';
//修改尘数
const editDustUrl = BASE_URL + '/user/dust';
//修改月见黑计数
const editAwardUrl = BASE_URL + '/user/award';
//查询用户信息
const searchUserUrl = BASE_URL + '/user/list';
//编辑用户密码
const editUserPasswordUrl = BASE_URL + '/user/pw';
//验证用户权限
const validateUserUrl = BASE_URL + '/user/check';
//抽卡
//设置抽卡结果
const setDrawResultUrl = BASE_URL + '/roll/set';
//查询抽卡结果
const queryDrawResultUrl = BASE_URL + '/roll/list';
//导入抽卡结果
const importDrewResultUrl = BASE_URL + '/roll/add';
//交换玩家持卡
const swapUserOwnCardUrl = BASE_URL + '/user/card/swap';
//查询日志
const queryLogUrl = BASE_URL + '/record/list';


//玩家端
//尘转卡
const transDustToCardUrl = BASE_URL + '/user/card/change';
//随机尘转卡
const transDustToCardRandomUrl = BASE_URL + '/user/card/random';
//闪卡转尘
const transCardToDustUrl = BASE_URL + '/user/card/todust';



//需要验证账号密码的地址列表
const urlNeededValidate = [
    searchCardUrl,
    addCardUrl,
    editCardNameUrl,
    exchangeCardsRareUrl,

    addPackageUrl,
    editPackageNameUrl,
    editPackageOrderUrl,


    addUserUrl,
    editCardCountUrl,
    editDustUrl,
    editAwardUrl,
    setDrawResultUrl,
    importDrewResultUrl,
    swapUserOwnCardUrl,

    transDustToCardUrl,
    transDustToCardRandomUrl,
    transCardToDustUrl,
    queryLogUrl
]




export {
    searchCardUrl,
    addCardUrl,
    editCardNameUrl,
    searchOwningCardUrl,
    searchEditedRecordUrl,
    exchangeCardsRareUrl,
    addPackageUrl,
    editPackageNameUrl,
    queryCardPackageListUrl,
    editPackageOrderUrl,
    addUserUrl,
    editCardCountUrl,
    editDustUrl,
    editAwardUrl,
    editUserPasswordUrl,
    validateUserUrl,
    searchUserUrl,
    setDrawResultUrl,
    queryDrawResultUrl,
    importDrewResultUrl,
    swapUserOwnCardUrl,
    transDustToCardUrl,
    transDustToCardRandomUrl,
    transCardToDustUrl,
    queryLogUrl,

    urlNeededValidate
}
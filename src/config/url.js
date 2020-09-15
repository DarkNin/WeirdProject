//修改mock数据请同步修改mock.config.js

const BASE_URL = '/weird_project';

//管理端
//卡片列表
//全卡片搜索
const searchCardUrl = BASE_URL + '/card/list/admin';
//添加卡片信息
const addCardUrl = BASE_URL + '/package/card/add';
//修改卡片名
const editCardNameUrl = BASE_URL + '/card/update';
//卡片拥有情况搜索
const searchOwningCardUrl = BASE_URL + '/card/list';
//卡片修改记录搜索
const searchEditedRecordUrl = BASE_URL + '/card/history';

//卡包
//新增卡包
const addPackageUrl = BASE_URL + '/package/add';
//编辑包名
const editPackageNameUrl = BASE_URL + '/package/update';
//查询卡包列表
const queryCardPackageListUrl = BASE_URL + '/package/list';

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

//抽卡
//设置抽卡结果
const setDrawResultUrl = BASE_URL + '/roll/set';
//查询抽卡结果
const queryDrawResultUrl = BASE_URL + '/roll/list';


//玩家端
//尘转卡
const transDustToCardUrl = BASE_URL + '/user/card/change';



//需要验证账号密码的地址列表
const urlNeededValidate = [
    searchCardUrl,
    addCardUrl,
    editCardNameUrl,

    addPackageUrl,
    editPackageNameUrl,


    addUserUrl,
    editCardCountUrl,
    editDustUrl,
    editAwardUrl,
    setDrawResultUrl,

    transDustToCardUrl
]




export {
    searchCardUrl,
    addCardUrl,
    editCardNameUrl,
    searchOwningCardUrl,
    searchEditedRecordUrl,
    addPackageUrl,
    editPackageNameUrl,
    queryCardPackageListUrl,
    addUserUrl,
    editCardCountUrl,
    editDustUrl,
    editAwardUrl,
    searchUserUrl,
    setDrawResultUrl,
    queryDrawResultUrl,
    transDustToCardUrl,

    urlNeededValidate
}
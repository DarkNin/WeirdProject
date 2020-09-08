const baseUrl = '/weird_project';

//管理端
//卡片列表
//全卡片搜索
const searchCardUrl = baseUrl + '/card/list/admin';
//修改用户持有卡片数量
const editCardCountUrl = baseUrl + '/user/card/update';
//添加卡片信息
const addCardUrl = baseUrl + '/package/card/add';
//卡片拥有情况搜索
const searchOwningCardUrl = baseUrl + '/card/list';

//卡包
//新增卡包
const addPackageUrl = baseUrl + '/package/add';
//编辑包名
const editPackageNameUrl = baseUrl + '/package/update';
//修改卡片名
const editCardNameInPackageUrl = baseUrl + '/package/card/update';

//用户
//新增用户
const addUserUrl = baseUrl + '/user/add';
//修改尘数
const editDustUrl = baseUrl + '/user/dust';
//修改月见黑计数
const editAwardUrl = baseUrl + '/user/award';
//查询用户信息
const searchUserUrl = baseUrl + '/user/list';

//抽卡
//设置抽卡结果
const setDrawResultUrl = baseUrl + '/roll/set';
//查询抽卡结果
const queryDrawResultUrl = baseUrl + '/roll/list';


//玩家端
//尘转卡
const transDustToCardUrl = baseUrl + '/user/change';
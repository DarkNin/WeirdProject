<template>
  <div id="admin">
    <div class="admin-info">
      <p class="admin-info-tips">欢迎来到诡异云，{{username}}。</p>
      <el-button type="text" @click="addPackage()" v-show="showTab === '1'">新增卡包</el-button>
      <el-button type="text" @click="addUser()" v-show="showTab === '3'">新增玩家</el-button>
    </div>

    <div class="admin-main">
      <el-menu mode="horizontal" default-active="1" @select="handleSelect">
        <el-menu-item index="1">卡包</el-menu-item>
        <el-menu-item index="2">检索</el-menu-item>
        <el-menu-item index="3">玩家</el-menu-item>
        <el-menu-item index="4">抽卡记录</el-menu-item>
        <el-menu-item index="5">修改记录</el-menu-item>
      </el-menu>
      <div class="admin-main-content" v-if="showTab === '1'">
        <el-collapse v-model="activeItemIndex" @change="handleItemChange" accordion>
          <el-collapse-item
            v-for="(item, index) in cardPackageList"
            :key="index"
            :name="index"
            :title="item.packageName"
          >
            <div class="collapse-table-wrap">
              <div class="collapse-table-operation">
                <el-button type="primary" size="mini" @click="editPackage(item.packageName)">编辑卡包</el-button>
                <el-button type="primary" size="mini" @click="addCard(item.packageName)">新增卡片</el-button>
              </div>
              <el-table
                :data="packageListContent[index] ? packageListContent[index]['data'] : []"
                size="mini"
                height="44vh"
              >
                <el-table-column
                  :key="'package-' + item.packageName + '-1'"
                  prop="cardName"
                  label="卡名"
                ></el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-2'"
                  prop="rare"
                  width="80"
                  label="稀有度"
                >
                  <template slot-scope="scope">
                    <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
                  </template>
                </el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-3'"
                  fixed="right"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click="editCard(item.packageName, scope.row.cardName)"
                    >编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="collapse-table-pagination">
                <el-pagination
                  small
                  background
                  layout="prev, pager, next"
                  :total="packageListContent[index] ? packageListContent[index]['pagination'].total : 0"
                  :page-size="packageListContent[index] ? packageListContent[index]['pagination'].pageSize : defaultPageSize"
                  @current-change="pageChange"
                ></el-pagination>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="admin-main-content" v-else-if="showTab === '2'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="libQueryAddition.packageName"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'lib' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select size="mini" v-model="libQueryAddition.rare" placeholder="请选择稀有度" clearable>
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="libQueryAddition.userName"
              placeholder="请选择玩家"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="'lib' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-input size="mini" v-model="libQueryAddition.cardName" placeholder="请填写卡名" clearable></el-input>
          </div>
          <div class="admin-main-content-addition-item">
            <el-button type="info" size="mini" @click="libClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="libQueryCard">查询</el-button>
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="libTableData" size="mini" height="48vh">
            <el-table-column :key="'lib-column-' + 1" prop="cardName" label="卡名"></el-table-column>
            <el-table-column :key="'lib-column-' + 2" prop="packageName" label="卡包名"></el-table-column>
            <el-table-column :key="'lib-column-' + 3" prop="rare" label="稀有度">
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'lib-column-' + 4" prop="userName" label="拥有者"></el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="libPagination.total"
              :page-size="libPagination.pageSize"
              @current-change="libQueryCard"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="admin-main-content" v-else-if="showTab === '3'">
        <div class="admin-main-content-addition seperate">
          <div class="admin-main-content-addition-special">
            <el-select
              size="mini"
              v-model="userQueryAddition.target"
              placeholder="请选择玩家"
              @change="setUserInfo"
            >
              <el-option
                v-for="item in userList"
                :key="'user' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="special-user-info" v-if="userQueryAddition.target">
            <span>
              DP:
              <!-- <el-button type="text" @click="editUserInfo('DP')">{{userSelectedInfo.duelPoint}}</el-button> -->
              {{userSelectedInfo.duelPoint}}
            </span>
            <span>
              月见黑:
              <el-button type="text" @click="editUserInfo('月见黑')">{{userSelectedInfo.award}}</el-button>
            </span>
            <span>
              剩余尘数:
              <el-button type="text" @click="editUserInfo('剩余尘数')">{{userSelectedInfo.dust}}</el-button>
            </span>
          </div>
        </div>
        <div class="admin-main-content-addition" v-if="userQueryAddition.target">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="userQueryAddition.package"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'lib' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select size="mini" v-model="userQueryAddition.rare" placeholder="请选择稀有度" clearable>
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-input size="mini" v-model="userQueryAddition.card" placeholder="请填写卡名" clearable></el-input>
          </div>
          <div class="admin-main-content-addition-item">
            <el-button type="info" size="mini" @click="userClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="userQuery">查询</el-button>
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="userTableData" size="mini" height="48vh">
            <el-table-column :key="'user-column-' + 1" prop="packageName" label="卡包名"></el-table-column>
            <el-table-column :key="'user-column-' + 2" prop="cardName" label="卡名"></el-table-column>
            <el-table-column :key="'user-column-' + 3" prop="rare" label="稀有度">
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'user-column-' + 4" prop="count" label="持有数量"></el-table-column>
            <el-table-column :key="'user-column-' + 5" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="editCardCount(scope.row.packageName, scope.row.cardName, scope.row.userName)"
                >编辑数量</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="userPagination.total"
              :page-size="userPagination.pageSize"
              @current-change="userQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="admin-main-content" v-else-if="showTab === '4'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="drawRecordQueryAddition.package"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'draw-record' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="drawRecordQueryAddition.user"
              placeholder="请选择玩家"
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="'draw-record' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-button type="info" size="mini" @click="recordClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="drawRecordQuery">查询</el-button>
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="drawRecordTableData" size="mini" height="48vh">
            <el-table-column :key="'draw-record-column-' + 1" prop="rollPackageName" label="卡包名"></el-table-column>
            <el-table-column :key="'draw-record-column-' + 2" prop="rollUserName" label="抽卡人"></el-table-column>
            <el-table-column :key="'draw-record-column-' + 3" prop="time" label="抽卡时间"></el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 4"
              prop="rollResult"
              label="抽卡结果"
              min-width="200"
            >
              <template slot-scope="scope">
                <div
                  class="table-tag-draw"
                  v-for="(item, index) in scope.row.rollResult"
                  :key="'draw-result-' + index"
                >
                  <span class="draw-result-rare" :class="_getRareColor(item.rare)">{{item.rare}}</span>
                  <span class="draw-result-name">{{item.cardName}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :key="'draw-record-column-' + 5"
              prop="isDisabled"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="setDrawStatus(scope.row.rollId, scope.row.isDisabled)"
                >设置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="drawRecordPagination.total"
              :page-size="drawRecordPagination.pageSize"
              @current-change="drawRecordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="admin-main-content" v-else-if="showTab === '5'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="recordQueryAddition.packageName"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'record' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="recordQueryAddition.rare"
              placeholder="请选择稀有度"
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-input
              size="mini"
              v-model="recordQueryAddition.cardName"
              placeholder="请填写卡名"
              clearable
            ></el-input>
          </div>
          <div class="admin-main-content-addition-item">
            <el-button type="info" size="mini" @click="recordClearAddition">清除条件</el-button>
            <el-button type="primary" size="mini" @click="recordQuery">查询</el-button>
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="recordTableData" size="mini" height="48vh">
            <el-table-column :key="'record-column-' + 1" prop="packageName" label="卡包名"></el-table-column>
            <el-table-column :key="'record-column-' + 2" prop="oldName" label="旧卡名"></el-table-column>
            <el-table-column :key="'record-column-' + 3" prop="newName" label="新卡名"></el-table-column>
            <el-table-column :key="'record-column-' + 4" prop="rare" label="稀有度">
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
              </template>
            </el-table-column>
            <el-table-column :key="'record-column-' + 5" prop="createdTime" label="添加时间"></el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="recordPagination.total"
              :page-size="recordPagination.pageSize"
              @current-change="recordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增卡包dialog -->
    <el-dialog
      title="新增卡包"
      :visible.sync="isAddingPackage"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelAddingPackage"
    >
      <el-form label-position="top">
        <el-form-item label="卡包名" size="small" required>
          <el-input
            v-model="addingPackageData.package"
            type="text"
            @keyup.enter.native="submitAddingPackage"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingPackage = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddingPackage" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑卡包dialog -->
    <el-dialog
      title="编辑卡包"
      :visible.sync="isEditingPackage"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditingPackage"
    >
      <el-form label-position="top">
        <el-form-item label="原卡包名" size="small">
          <el-input disabled v-model="editingPackageData.oldname" type="text"></el-input>
        </el-form-item>
        <el-form-item label="新卡包名" size="small" required>
          <el-input
            v-model="editingPackageData.newname"
            type="text"
            @keyup.enter.native="submitEditingPackage"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingPackage = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEditingPackage" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增卡片dialog -->
    <el-dialog
      title="新增卡片"
      :visible.sync="isAddingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelAddingCard"
    >
      <el-form label-position="top">
        <el-form-item label="卡包" size="small">
          <el-input disabled v-model="addingCardData.package" type="text"></el-input>
        </el-form-item>
        <el-form-item label="卡名" size="small" required>
          <el-input
            v-model="addingCardData.card"
            type="text"
            @keyup.enter.native="submitAddingCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="稀有度" size="small" required>
          <el-select size="mini" v-model="addingCardData.rare">
            <el-option label="N" value="N"></el-option>
            <el-option label="R" value="R"></el-option>
            <el-option label="SR" value="SR"></el-option>
            <el-option label="UR" value="UR"></el-option>
            <el-option label="HR" value="HR"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingCard = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddingCard" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑卡片dialog -->
    <el-dialog
      title="编辑卡片"
      :visible.sync="isEditingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditingCard"
    >
      <el-form label-position="top">
        <el-form-item label="卡包" size="small">
          <el-input disabled v-model="editingCardData.package" type="text"></el-input>
        </el-form-item>
        <el-form-item label="旧卡名" size="small">
          <el-input disabled v-model="editingCardData.oldname" type="text"></el-input>
        </el-form-item>
        <el-form-item label="新卡名" size="small" required>
          <el-input
            v-model="editingCardData.newname"
            type="text"
            @keyup.enter.native="submitEditingCard"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="是否记录" size="small">
          <el-checkbox v-model="editingCardData.show"></el-checkbox>
        </el-form-item>
        <!-- <el-form-item label="稀有度" size="small" required>
          <el-select size="mini" v-model="editingCardData.rare" clearable>
            <el-option label="N" value="N"></el-option>
            <el-option label="R" value="R"></el-option>
            <el-option label="SR" value="SR"></el-option>
            <el-option label="UR" value="UR"></el-option>
            <el-option label="HR" value="HR"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingCard = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEditingCard" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增用户dialog -->
    <el-dialog
      title="新增玩家"
      :visible.sync="isAddingUser"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelAddingUser"
    >
      <el-form label-position="top">
        <el-form-item label="玩家名" size="small" required>
          <el-input
            v-model="addingUserData.target"
            type="text"
            @keyup.enter.native="submitAddingUser"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingUser = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddingUser" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户卡片dialog -->
    <el-dialog
      :title="editingCardCountTips"
      :visible.sync="isEditingCardCount"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditCardCount"
    >
      <el-form label-position="top">
        <el-form-item label="持卡数量" size="small" required>
          <el-input
            v-model.number="editingCardCountData.count"
            type="text"
            @keyup.enter.native="submitEditCardCount"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingCardCount = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEditCardCount" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息dialog -->
    <el-dialog
      :title="editingUserInfoItemTips"
      :visible.sync="isEditingUserInfoItem"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditUserInfo"
    >
      <el-form label-position="top">
        <el-form-item :label="editingUserInfoItemType" size="small" required>
          <el-input
            v-model.number="editingUserInfoItemCount"
            type="text"
            @keyup.enter.native="submitEditUserInfo"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingUserInfoItem = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEditUserInfo" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改抽卡结果dialog -->
    <el-dialog
      title="确认抽卡结果"
      :visible.sync="isSettingDrawRecord"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cacelSetDrawStatus"
    >
      <el-form label-position="top">
        <el-form-item label="状态" size="small" required>
          <el-select v-model="drawRecordStatusData.status">
            <el-option label="可用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSettingDrawRecord = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitDrawStatus" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import common from "./mixins/common";
import {
  searchCardUrl,
  addCardUrl,
  editCardNameUrl,
  editPackageNameUrl,
  addPackageUrl,
  addUserUrl,
  editCardCountUrl,
  editDustUrl,
  editAwardUrl,
  setDrawResultUrl
} from "../config/url";
import { axiosFetch } from "../utils/fetch";
export default {
  name: "Admin",
  mixins: [common],
  data() {
    return {
      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      //卡包页
      isAddingPackage: false,
      addingPackageData: {
        package: "",
      },
      isEditingPackage: false,
      editingPackageData: {
        oldname: "",
        newname: "",
      },
      isAddingCard: false,
      addingCardData: {
        package: "",
        card: "",
        rare: "N",
      },
      isEditingCard: false,
      editingCardData: {
        package: "",
        oldname: "",
        newname: "",
        show: false,
      },

      //卡库
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
      },
      libTableData: [],

      //玩家页
      isAddingUser: false,
      addingUserData: {
        target: "",
      },

      userQueryAddition: {
        target: "",
        package: "",
        card: "",
        rare: "",
      },

      userSelectedInfo: {
        dust: 0,
        award: 0,
        duelPoint: 0,
      },

      isEditingUserInfoItem: false,
      editingUserInfoItemType: "",
      editingUserInfoItemCount: "",
      editingUserInfoItemTips: "",

      userPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      userTableData: [],

      isEditingCardCount: false,
      editingCardCountData: {
        package: "",
        card: "",
        target: "",
        count: null,
      },
      editingCardCountTips: "",

      //修改记录
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

      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      drawRecordQueryAddition: {
        package: "",
        user: "",
      },
      drawRecordTableData: [],

      isSettingDrawRecord: false,
      drawRecordStatusData: {
        status: 0,
        id: null,
      },
    };
  },

  methods: {
    handleSelect(index) {
      this.showTab = index;
    },

    async reloadPage() {
      this.$openLoading();
      Object.assign(this.$data, this.$options.data());
      this.cardPackageList = await this._queryPackageList();
      this.userList = await this._queryUserList();
      this.$closeLoading();
    },

    //查询卡片列表
    queryCardList(page, pageSize, _package, card, rare, target) {
      return new Promise((resolve) => {
        axiosFetch({
          url: searchCardUrl,
          data: {
            package: _package,
            card: card,
            rare: rare,
            target: target,
            page: page || this.defaultPage,
            pageSize: pageSize || this.defaultPageSize,
          },
        }).then((res) => {
          resolve({
            pagination: {
              page: res.data.data.currPage,
              total: res.data.data.totalCount,
            },
            data: res.data.data.dataList,
          });
        });
      });
    },

    //情报页面点击手风琴面板时触发
    async handleItemChange(itemIndex) {
      if (!!this.packageListContent[itemIndex] || itemIndex === "") {
        return;
      }
      this.$openLoading();
      let packageData = await this.queryCardList(
        undefined,
        undefined,
        this.cardPackageList[itemIndex]["packageName"]
      );
      this.$set(this.packageListContent, itemIndex, packageData);
      this.$closeLoading();
    },

    //情报页面表格分页切换
    pageChange(page) {
      this.$openLoading();
      this.queryCardList(
        page,
        this.defaultPageSize,
        this.cardPackageList[this.activeItemIndex]["packageName"]
      ).then((data) => {
        this.$set(this.packageListContent, this.activeItemIndex, data);
        this.$closeLoading();
      });
    },

    addPackage() {
      this.isAddingPackage = true;
    },

    cancelAddingPackage() {
      this.addingPackageData.package = "";
    },

    submitAddingPackage() {
      if (this.addingPackageData.package) {
        this.$openLoading();
        axiosFetch({
          url: addPackageUrl,
          data: {
            package: this.addingPackageData.package,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isAddingPackage = false;
            this.reloadPage();
          }
        });
      }
    },

    editPackage(packageName) {
      this.editingPackageData.oldname = packageName;
      this.isEditingPackage = true;
    },

    cancelEditingPackage() {
      this.editingPackageData.oldname = "";
      this.editingPackageData.newname = "";
    },

    submitEditingPackage() {
      if (this.editingPackageData.newname) {
        this.$openLoading();
        axiosFetch({
          url: editPackageNameUrl,
          data: {
            oldname: this.editingPackageData.oldname,
            newname: this.editingPackageData.newname,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isEditingPackage = false;
            this.reloadPage();
          }
        });
      }
    },

    addCard(packageName) {
      this.addingCardData.package = packageName;
      this.isAddingCard = true;
    },

    cancelAddingCard() {
      this.addingCardData.package = "";
      this.addingCardData.card = "";
      this.addingCardData.rare = "N";
    },

    submitAddingCard() {
      if (this.addingCardData.card) {
        this.$openLoading();
        axiosFetch({
          url: addCardUrl,
          data: {
            package: this.addingCardData.package,
            card: this.addingCardData.card,
            rare: this.addingCardData.rare,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isAddingCard = false;
            this.reloadPage();
          }
        });
      }
    },

    editCard(packageName, cardName) {
      this.editingCardData.package = packageName;
      this.editingCardData.oldname = cardName;
      this.isEditingCard = true;
    },

    cancelEditingCard() {
      this.editingCardData.package = "";
      this.editingCardData.oldname = "";
      this.editingCardData.newname = "";
      this.editingCardData.show = false;
    },

    submitEditingCard() {
      if (this.editingCardData.newname) {
        this.$openLoading();
        axiosFetch({
          url: editCardNameUrl,
          data: {
            package: this.editingCardData.package,
            oldname: this.editingCardData.oldname,
            newname: this.editingCardData.newname,
            show: this.editingCardData.rare || undefined,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isEditingCard = false;
            this.reloadPage();
          }
        });
      }
    },

    //检索页面 清除条件
    libClearAddition() {
      Object.assign(
        this.$data.libQueryAddition,
        this.$options.data().libQueryAddition
      );
    },

    //检索查询 && 分页切换
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
        this.libQueryAddition.userName || undefined
      ).then((data) => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
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

    //新增玩家
    addUser() {
      this.isAddingUser = true;
    },

    cancelAddingUser() {
      this.addingUserData.target = "";
    },

    submitAddingUser() {
      if (this.addingUserData.target) {
        this.$openLoading();
        axiosFetch({
          url: addUserUrl,
          data: {
            target: this.addingUserData.target,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isAddingUser = false;
            this.reloadPage();
          }
        });
      }
    },

    userClearAddition() {
      Object.assign(
        this.$data.userQueryAddition,
        this.$options.data().userQueryAddition
      );
    },

    setUserInfo(userName) {
      let userInfo = this.userList.find(
        (element) => element.userName === userName
      );
      this.userSelectedInfo.dust = userInfo.dustCount;
      this.userSelectedInfo.award = userInfo.nonawardCount;
      this.userSelectedInfo.duelPoint = userInfo.duelPoint;
    },

    userQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.userQueryAddition.package || undefined,
        this.userQueryAddition.card || undefined,
        this.userQueryAddition.rare || undefined,
        this.userQueryAddition.target || undefined
      ).then((data) => {
        this.userPagination.page = data.pagination.page;
        this.userPagination.total = data.pagination.total;
        this.userTableData = data.data;
        this.$closeLoading();
      });
    },

    editCardCount(_package, card, target) {
      this.editingCardCountData.package = _package;
      this.editingCardCountData.card = card;
      this.editingCardCountData.target = target;
      this.editingCardCountTips = `正在编辑玩家【${target}】的【${card}】`;
      this.isEditingCardCount = true;
    },
    cancelEditCardCount() {
      this.editingCardCountData.package = "";
      this.editingCardCountData.card = "";
      this.editingCardCountData.target = "";
      this.editingCardCountData.count = null;
      this.editingCardCountTips = "";
    },
    submitEditCardCount() {
      if (
        typeof this.editingCardCountData.count === "number" &&
        this.editingCardCountData.count >= 0
      ) {
        this.$openLoading();
        axiosFetch({
          url: editCardCountUrl,
          data: {
            package: this.editingCardCountData.package,
            card: this.editingCardCountData.card,
            target: this.editingCardCountData.target,
            count: this.editingCardCountData.count,
          },
        }).then((res) => {
          if (res.data.code === 200) {
            this.isEditingCardCount = false;
            this.userQuery(1);
          }
        });
      }
    },

    editUserInfo(type) {
      this.editingUserInfoItemType = type;
      switch (type) {
        // case "DP":
        //   this.editingUserInfoItemCount = this.userSelectedInfo.duelPoint;
        //   break;
        case "月见黑":
          this.editingUserInfoItemCount = this.userSelectedInfo.award;
          break;
        case "剩余尘数":
          this.editingUserInfoItemCount = this.userSelectedInfo.dust;
          break;
      }
      this.editingUserInfoItemTips = `正在编辑玩家【${this.userQueryAddition.target}】`;
      this.isEditingUserInfoItem = true;
    },

    cancelEditUserInfo() {
      this.editingUserInfoItemType = "";
      this.editingUserInfoItemCount = "";
      this.editingUserInfoItemTips = "";
    },

    submitEditUserInfo() {
      if (
        typeof this.editingUserInfoItemCount === "number" &&
        this.editingUserInfoItemCount >= 0
      ) {
        this.$openLoading();
        let options = {
          url: "",
          data: {
            target: this.userQueryAddition.target,
            count: this.editingUserInfoItemCount,
          },
        };
        switch (this.editingUserInfoItemType) {
          case "月见黑":
            options.url = editAwardUrl;
            break;
          case "剩余尘数":
            options.url = editDustUrl;
            break;
        }
        axiosFetch(options).then((res) => {
          if (res.data.code === 200) {
            this.isEditingUserInfoItem = false;
            this.reloadPage();
          }
        });
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
        this.drawRecordQueryAddition.packageName || undefined,
        this.drawRecordQueryAddition.user || undefined
      ).then((data) => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },

    setDrawStatus(id, status) {
      this.drawRecordStatusData.status = status;
      this.drawRecordStatusData.id = id;
      this.isSettingDrawRecord = true;
    },

    cacelSetDrawStatus() {
      this.drawRecordStatusData.status = 0;
      this.drawRecordStatusData.id = null;
    },

    submitDrawStatus() {
      this.$openLoading();
      axiosFetch({
        url: setDrawResultUrl,
        data: {
          status: this.drawRecordStatusData.status,
          id: this.drawRecordStatusData.id,
        },
      }).then((res) => {
        if (res.data.code === 200) {
          this.isSettingDrawRecord = false;
          this.reloadPage();
        }
      });
    },
  },
};
</script>

<style scoped>
#admin {
  width: 100%;
  height: 3rem;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
}
.admin-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
}

.admin-info p {
  margin: 0;
  color: #8f8f8f;
  height: 3rem;
  line-height: 3rem;
}

.admin-info .el-button {
  margin-left: auto;
  font-size: 0.9rem;
}

.admin-main {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  padding: 0 1rem;
  box-sizing: border-box;
}

.admin-main-content {
  box-sizing: border-box;
  padding: 1rem;
  height: 70vh;
  overflow-y: auto;
}

.admin-main-content /deep/ .el-collapse-item__header {
  color: #66b1ff;
  font-weight: bold;
}

.collapse-table-wrap {
  height: 50vh;
}
.collapse-table-operation {
  display: flex;
  justify-content: flex-end;
  margin: 0.5rem 0;
}
.table-tag {
  display: inline-block;
  width: 2rem;
  height: 100%;
  text-align: center;
  border-radius: 0.3rem;
  border: 1px solid #eee;
  font-weight: bold;
}

.table-tag.color-normal {
  background-color: #75b2f3;
  color: #ffffff;
}
.table-tag.color-rare {
  background-color: #ffe3a7;
  color: #cccccc;
}
.table-tag.color-ultra-rare {
  background-color: #ffe3a7;
  color: #c5b314;
}
.collapse-table-pagination,
.admin-main-content-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-top: 5px;
}

.admin-main-content-addition-special {
  min-height: 30px;
  width: 10rem;
}
.special-user-info {
  color: #606266;
  font-size: 0.7rem;
  border-radius: 0.3rem;
  border: 1px solid #dcdfe6;
  height: 30px;
  width: auto;
  padding: 0 0.5rem;
  margin-left: auto;
}
.special-user-info .el-button {
  padding: 0;
  font-size: 0.7rem;
}
.special-user-info span {
  height: 30px;
  line-height: 30px;
}
.special-user-info span + span {
  margin-left: 10px;
}
.admin-main-content-addition {
  /* border: 1px solid #eeeeee;
  border-radius: 0.3rem; */
  min-height: 30px;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
}
.admin-main-content-addition.seperate {
  border-bottom: 1px solid #eeeeee;
}

.admin-main-content-addition-item {
  width: 10rem;
  height: 3rem;
  margin-right: 0.6rem;
}
.admin-main-content-addition-item.special {
  width: auto;
}
.table-tag-draw {
  display: inline-block;
  width: auto;
  height: 100%;
  text-align: center;
  color: #606266;
  margin-right: 5px;
}
.draw-result-rare {
  display: inline-block;
  border-radius: 0.3rem;
  border: 1px solid #eee;
  font-weight: bold;
  padding: 0 5px;
  margin-right: 2px;
}
.table-tag-draw .color-normal {
  background-color: #75b2f3;
  color: #ffffff;
}
.table-tag-draw .color-rare {
  background-color: #ffe3a7;
  color: #cccccc;
}
.table-tag-draw .color-ultra-rare {
  background-color: #ffe3a7;
  color: #c5b314;
}

.el-dialog .el-select {
  width: 100%;
}
</style>
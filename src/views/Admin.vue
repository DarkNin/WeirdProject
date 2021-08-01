<template>
  <div id="admin">
    <div class="admin-info">
      <p class="admin-info-tips">欢迎来到诡异云，{{ username }}。</p>
    </div>

    <div class="admin-main">
      <div class="admin-main-menu">
        <el-menu mode="horizontal" default-active="1" @select="handleSelect">
          <el-menu-item index="1">卡包</el-menu-item>
          <el-menu-item index="2">检索</el-menu-item>
          <el-menu-item index="3">卡池</el-menu-item>
          <el-menu-item index="4">玩家</el-menu-item>
          <el-menu-item index="5">抽卡记录</el-menu-item>
          <el-menu-item index="6">修改记录</el-menu-item>
          <el-menu-item index="7">日志</el-menu-item>
        </el-menu>
        <div class="admin-main-menu-control">
          <el-button
            type="text"
            @click="editPackageOrder()"
            v-if="showTab === '1' && !isEditingPackageOrder"
            >排序</el-button
          >
          <el-button
            type="text"
            @click="addPackage()"
            v-if="showTab === '1' && !isEditingPackageOrder"
            >新增卡包</el-button
          >
          <el-button
            type="text"
            @click="exchangeCard()"
            v-if="showTab === '1' && !isEditingPackageOrder"
            >交换稀有度</el-button
          >
          <el-button
            type="text"
            @click="cancelEditingPackageOrder()"
            v-if="showTab === '1' && isEditingPackageOrder"
            >取消</el-button
          >
          <el-button
            type="text"
            @click="submitEditingPackageOrder()"
            v-if="showTab === '1' && isEditingPackageOrder"
            >确认</el-button
          >
          <el-button type="text" @click="addUser()" v-if="showTab === '4'"
            >新增玩家</el-button
          >
          <el-button type="text" @click="swapUserCards()" v-if="showTab === '4'"
            >换卡</el-button
          >
          <el-button
            type="text"
            @click="importDrewCards()"
            v-if="showTab === '5'"
            >导入记录</el-button
          >
        </div>
      </div>

      <!-- 卡包查询 -->
      <div class="admin-main-content" v-if="showTab === '1'">
        <el-collapse
          v-if="!isEditingPackageOrder"
          v-model="activeItemIndex"
          @change="handleItemChange"
          accordion
        >
          <el-collapse-item
            v-for="(item, index) in cardPackageList"
            :key="index"
            :name="index"
            :title="item.packageName"
          >
            <div class="collapse-table-wrap">
              <div class="collapse-table-operation">
                <el-button
                  type="primary"
                  size="mini"
                  @click="editPackage(item.packageName)"
                  >编辑卡包</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="addCard(item.packageName)"
                  >新增卡牌</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="batchAddCard(item.packageName)"
                  >批量新增</el-button
                >
              </div>
              <el-table
                :data="
                  packageListContent[index]
                    ? packageListContent[index]['data']
                    : []
                "
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
                    <div
                      class="table-tag"
                      :class="_getRareColor(scope.row.rare)"
                    >
                      {{ scope.row.rare }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-3'"
                  prop="needCoin"
                  label="需要硬币"
                ></el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-4'"
                  prop="desc"
                  label="预览"
                  width="54"
                >
                  <template slot-scope="scope">
                    <el-button
                      class="table-preview-btn"
                      icon="el-icon-caret-right"
                      size="mini"
                      @mouseenter.native="
                        _showCardDescHover(
                          $event,
                          scope.row.desc,
                          scope.row.picId
                        )
                      "
                      @click="
                        _showCardDescClick(
                          $event,
                          scope.row.desc,
                          scope.row.picId
                        )
                      "
                      @mouseleave.native="_closeCardDesc"
                      circle
                    ></el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-5'"
                  fixed="right"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      @click="editCard(scope.row)"
                      >编辑</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="collapse-table-pagination">
                <el-pagination
                  small
                  background
                  layout="prev, pager, next"
                  :total="
                    packageListContent[index]
                      ? packageListContent[index]['pagination'].total
                      : 0
                  "
                  :page-size="
                    packageListContent[index]
                      ? packageListContent[index]['pagination'].pageSize
                      : defaultPageSize
                  "
                  :current-page="
                    packageListContent[index]
                      ? packageListContent[index]['pagination'].page
                      : 1
                  "
                  @current-change="pageChange"
                ></el-pagination>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <draggable
          v-if="isEditingPackageOrder"
          class="package-order-list"
          tag="ul"
          v-model="editingPackageOrderList"
          @start="isDragging = true"
          @end="isDragging = false"
          :ghostClass="'package-order-list-item-ghost'"
          :animation="100"
        >
          <transition-group
            type="transition"
            :name="!isDragging ? 'flip-list' : null"
          >
            <li
              class="package-order-list-item"
              v-for="element in editingPackageOrderList"
              :key="element.order"
            >
              {{ element.name }}
              <i class="el-icon-d-caret"></i>
            </li>
          </transition-group>
        </draggable>
      </div>
      <!-- 全卡检索 -->
      <div class="admin-main-content" v-else-if="showTab === '2'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="libQueryAddition.packageName"
              placeholder="请选择卡包"
              multiple
              collapse-tags
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
            <el-select
              size="mini"
              v-model="libQueryAddition.rare"
              placeholder="请选择稀有度"
              multiple
              collapse-tags
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
              <el-option label="GR" value="GR"></el-option>
              <el-option label="SER" value="SER"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-autocomplete
              size="mini"
              v-model.trim="libQueryAddition.cardName"
              placeholder="请填写卡名"
              clearable
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchCandicateCardList"
              @keyup.enter.native="libQueryCard"
            ></el-autocomplete>
          </div>
          <div class="admin-main-content-addition-item">
            <el-button type="info" size="mini" @click="libClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="libQueryCard"
              >查询</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="libTableData" size="mini" height="auto">
            <el-table-column
              :key="'lib-column-' + 1"
              prop="cardName"
              label="卡名"
            ></el-table-column>
            <el-table-column
              :key="'lib-column-' + 2"
              prop="packageName"
              label="卡包名"
            ></el-table-column>
            <el-table-column
              :key="'lib-column-' + 3"
              prop="rare"
              label="稀有度"
            >
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">
                  {{ scope.row.rare }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'lib-column-' + 4"
              prop="needCoin"
              label="需要硬币"
            ></el-table-column>
            <el-table-column
              :key="'lib-column-' + 5"
              prop="desc"
              label="预览"
              width="54"
            >
              <template slot-scope="scope">
                <el-button
                  class="table-preview-btn"
                  icon="el-icon-caret-right"
                  size="mini"
                  @mouseenter.native="
                    _showCardDescHover($event, scope.row.desc, scope.row.picId)
                  "
                  @click="
                    _showCardDescClick($event, scope.row.desc, scope.row.picId)
                  "
                  @mouseleave.native="_closeCardDesc"
                  circle
                ></el-button>
              </template>
            </el-table-column>

            <el-table-column :key="'lib-column-' + 6" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="editCard(scope.row)"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
            <!-- <el-table-column :key="'lib-column-' + 4" prop="userName" label="拥有者"></el-table-column> -->
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="libPagination.total"
              :page-size="libPagination.pageSize"
              :current-page="libPagination.page"
              @current-change="libQueryCard"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 玩家卡库 -->
      <div class="admin-main-content" v-else-if="showTab === '3'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="playerLibQueryAddition.packageName"
              placeholder="请选择卡包"
              multiple
              collapse-tags
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'player-lib' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="playerLibQueryAddition.rare"
              placeholder="请选择稀有度"
              multiple
              collapse-tags
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
              <el-option label="GR" value="GR"></el-option>
              <el-option label="SER" value="SER"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="playerLibQueryAddition.userName"
              placeholder="请选择玩家"
              multiple
              collapse-tags
              clearable
            >
              <el-option
                v-for="item in userList"
                :key="'player-lib' + item.userName + item.userId"
                :label="item.userName"
                :value="item.userName"
              ></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-input
              size="mini"
              v-model.trim="playerLibQueryAddition.cardName"
              placeholder="请填写卡名"
              clearable
              @keyup.enter.native="playerLibQueryCard"
            ></el-input>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-button type="info" size="mini" @click="playerLibClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="playerLibQueryCard"
              >查询</el-button
            >
            <el-button type="primary" size="mini" @click="playerLibExport"
              >导出</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="playerLibTableData" size="mini" height="auto">
            <el-table-column
              :key="'player-lib-column-' + 1"
              prop="cardName"
              label="卡名"
            ></el-table-column>
            <el-table-column
              :key="'player-lib-column-' + 2"
              prop="packageName"
              label="卡包名"
            ></el-table-column>
            <el-table-column
              :key="'player-lib-column-' + 3"
              prop="rare"
              label="稀有度"
            >
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">
                  {{ scope.row.rare }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'player-lib-column-' + 4"
              prop="userName"
              label="拥有者"
            ></el-table-column>
            <el-table-column
              :key="'player-lib-column-' + 5"
              prop="count"
              label="拥有数量"
            ></el-table-column>
            <el-table-column
              :key="'player-lib-column-' + 6"
              prop="desc"
              label="预览"
              width="54"
            >
              <template slot-scope="scope">
                <el-button
                  class="table-preview-btn"
                  icon="el-icon-caret-right"
                  size="mini"
                  @mouseenter.native="
                    _showCardDescHover($event, scope.row.desc, scope.row.picId)
                  "
                  @click="
                    _showCardDescClick($event, scope.row.desc, scope.row.picId)
                  "
                  @mouseleave.native="_closeCardDesc"
                  circle
                ></el-button>
              </template>
            </el-table-column>

            <el-table-column
              :key="'player-lib-column-' + 7"
              fixed="right"
              width="80"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="editCardCount(scope.row.cardName, scope.row.userName)"
                  >编辑数量</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="playerLibPagination.total"
              :page-size="playerLibPagination.pageSize"
              :current-page="playerLibPagination.page"
              @current-change="playerLibQueryCard"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 玩家操作 -->
      <div class="admin-main-content" v-else-if="showTab === '4'">
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
          <div class="special-user-add" v-if="userQueryAddition.target">
            <el-button type="primary" size="mini" @click="addUserCard"
              >添加卡牌</el-button
            >
          </div>
          <div class="special-user-info" v-if="userQueryAddition.target">
            <span>
              硬币:
              <el-button type="text" @click="editUserInfo('硬币')">{{
                userSelectedInfo.coin
              }}</el-button>
            </span>
            <span>
              月见黑:
              <el-button type="text" @click="editUserInfo('月见黑')">{{
                userSelectedInfo.award
              }}</el-button>
            </span>
            <span>
              剩余尘数:
              <el-button type="text" @click="editUserInfo('剩余尘数')">{{
                userSelectedInfo.dust
              }}</el-button>
            </span>
          </div>
        </div>
        <div
          class="admin-main-content-addition"
          v-if="userQueryAddition.target"
        >
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="userQueryAddition.package"
              placeholder="请选择卡包"
              multiple
              collapse-tags
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
            <el-select
              size="mini"
              v-model="userQueryAddition.rare"
              placeholder="请选择稀有度"
              multiple
              collapse-tags
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
              <el-option label="GR" value="GR"></el-option>
              <el-option label="SER" value="SER"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-autocomplete
              size="mini"
              v-model.trim="userQueryAddition.card"
              placeholder="请填写卡名"
              clearable
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchCandicateCardList"
              @keyup.enter.native="userQuery"
            ></el-autocomplete>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-button type="info" size="mini" @click="userClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="userQuery"
              >查询</el-button
            >
            <el-button type="primary" size="mini" @click="userOwnExport"
              >导出</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="userTableData" size="mini" height="auto">
            <el-table-column
              :key="'user-column-' + 1"
              prop="packageName"
              label="卡包名"
            ></el-table-column>
            <el-table-column
              :key="'user-column-' + 2"
              prop="cardName"
              label="卡名"
            ></el-table-column>
            <el-table-column
              :key="'user-column-' + 3"
              prop="rare"
              label="稀有度"
            >
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">
                  {{ scope.row.rare }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'user-column-' + 4"
              prop="count"
              label="持有数量"
            ></el-table-column>

            <el-table-column
              :key="'user-column-' + 5"
              prop="desc"
              label="预览"
              width="54"
            >
              <template slot-scope="scope">
                <el-button
                  class="table-preview-btn"
                  icon="el-icon-caret-right"
                  size="mini"
                  @mouseenter.native="
                    _showCardDescHover($event, scope.row.desc, scope.row.picId)
                  "
                  @click="
                    _showCardDescClick($event, scope.row.desc, scope.row.picId)
                  "
                  @mouseleave.native="_closeCardDesc"
                  circle
                ></el-button>
              </template>
            </el-table-column>
            <el-table-column :key="'user-column-' + 6" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="editCardCount(scope.row.cardName, scope.row.userName)"
                  >编辑数量</el-button
                >
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
              :current-page="userPagination.page"
              @current-change="userQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 抽卡记录 -->
      <div class="admin-main-content" v-else-if="showTab === '5'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="drawRecordQueryAddition.package"
              placeholder="请选择卡包"
              multiple
              collapse-tags
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
              multiple
              collapse-tags
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
            <el-date-picker
              size="mini"
              v-model="drawRecordQueryAddition.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              clearable
            ></el-date-picker>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-button type="info" size="mini" @click="drawRecordClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="drawRecordQuery"
              >查询</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="drawRecordTableData" size="mini" height="auto">
            <el-table-column :key="'draw-record-column-' + 0" type="expand">
              <template slot-scope="scope">
                <div
                  class="table-expand-desc-box"
                  v-for="(item, index) in scope.row.rollResult"
                  :key="'draw-result-desc-' + index"
                >
                  {{ item.desc }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 1"
              prop="rollPackageName"
              label="卡包名"
            ></el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 2"
              prop="rollUserName"
              label="抽卡人"
            ></el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 3"
              prop="time"
              label="抽卡时间"
            ></el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 4"
              prop="isDisabled"
              label="状态"
            >
              <template slot-scope="scope">{{
                scope.row.isDisabled ? "无效" : "有效"
              }}</template>
            </el-table-column>
            <el-table-column
              :key="'draw-record-column-' + 5"
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
                  <span
                    class="draw-result-rare"
                    :class="_getRareColor(item.rare)"
                    >{{ item.rare }}</span
                  >
                  <span
                    class="draw-result-name"
                    :class="{ grey: item.isDust }"
                    >{{ item.cardName }}</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              :key="'draw-record-column-' + 6"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="setDrawStatus(scope.row.rollId, scope.row.isDisabled)"
                  >设置</el-button
                >
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
              :current-page="drawRecordPagination.page"
              @current-change="drawRecordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 修改记录 -->
      <div class="admin-main-content" v-else-if="showTab === '6'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-select
              size="mini"
              v-model="recordQueryAddition.packageName"
              placeholder="请选择卡包"
              multiple
              collapse-tags
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
              multiple
              collapse-tags
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
              <el-option label="GR" value="GR"></el-option>
              <el-option label="SER" value="SER"></el-option>
            </el-select>
          </div>
          <div class="admin-main-content-addition-item">
            <el-autocomplete
              size="mini"
              v-model.trim="recordQueryAddition.cardName"
              placeholder="请填写卡名"
              clearable
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchCandicateCardList"
              @keyup.enter.native="recordQuery"
            ></el-autocomplete>
          </div>
          <div class="admin-main-content-addition-item">
            <el-button type="info" size="mini" @click="recordClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="recordQuery"
              >查询</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="recordTableData" size="mini" height="auto" @cell-mouse-enter="recordHighlightRow" @cell-mouse-leave="recordCancelHighlightRow" :row-class-name="recordHightlightClass">
            <el-table-column :key="'record-column-' + 0" type="expand">
              <template slot-scope="scope">
                <div class="table-expand-desc-box">
                  {{ scope.row.oldDesc }}
                </div>
                <div class="table-expand-desc-box">
                  {{ scope.row.newDesc }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'record-column-' + 1"
              prop="packageName"
              label="卡包名"
            ></el-table-column>
            <el-table-column
              :key="'record-column-' + 2"
              prop="oldName"
              label="旧卡名"
            ></el-table-column>
            <el-table-column
              :key="'record-column-' + 3"
              prop="newName"
              label="新卡名"
            ></el-table-column>
            <el-table-column
              :key="'record-column-' + 4"
              prop="rare"
              label="稀有度"
            >
              <template slot-scope="scope">
                <div class="table-tag" :class="_getRareColor(scope.row.rare)">
                  {{ scope.row.rare }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :key="'record-column-' + 5"
              prop="createdTime"
              label="添加时间"
            ></el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="recordPagination.total"
              :page-size="recordPagination.pageSize"
              :current-page="recordPagination.page"
              @current-change="recordQuery"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 日志 -->
      <div class="admin-main-content" v-else-if="showTab === '7'">
        <div class="admin-main-content-addition">
          <div class="admin-main-content-addition-item">
            <el-input
              size="mini"
              v-model.trim="logQueryAddition.operator"
              placeholder="操作人"
              clearable
              :trigger-on-focus="false"
              @keyup.enter.native="logQuery"
            ></el-input>
          </div>
          <div class="admin-main-content-addition-item">
            <el-input
              size="mini"
              v-model.trim="logQueryAddition.detail"
              placeholder="操作内容"
              clearable
              :trigger-on-focus="false"
              @keyup.enter.native="logQuery"
            ></el-input>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-date-picker
              size="mini"
              v-model="logQueryAddition.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              clearable
            ></el-date-picker>
          </div>
          <div class="admin-main-content-addition-item special">
            <el-button type="info" size="mini" @click="logClearAddition"
              >清除条件</el-button
            >
            <el-button type="primary" size="mini" @click="logQuery"
              >查询</el-button
            >
          </div>
        </div>
        <div class="admin-main-content-table-wrap">
          <el-table :data="logTableData" size="mini" height="auto">
            <el-table-column
              :key="'log-column-' + 1"
              prop="operator"
              label="操作人"
            ></el-table-column>
            <el-table-column
              :key="'log-column-' + 2"
              prop="time"
              label="操作时间"
            ></el-table-column>
            <el-table-column
              :key="'log-column-' + 3"
              prop="detail"
              label="操作内容"
              min-width="400"
            ></el-table-column>
          </el-table>
          <div class="admin-main-content-table-pagination">
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="logPagination.total"
              :page-size="logPagination.pageSize"
              :current-page="logPagination.page"
              @current-change="logQuery"
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
            v-model.trim="addingPackageData.package"
            type="text"
            @keyup.enter.native="submitAddingPackage"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingPackage = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitAddingPackage" size="small"
          >确 定</el-button
        >
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
          <el-input
            disabled
            v-model.trim="editingPackageData.oldname"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="新卡包名" size="small" required>
          <el-input
            v-model.trim="editingPackageData.newname"
            type="text"
            @keyup.enter.native="submitEditingPackage"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingPackage = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditingPackage" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增卡牌dialog -->
    <el-dialog
      title="新增卡牌"
      :visible.sync="isAddingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelAddingCard"
    >
      <el-form label-position="top">
        <el-form-item label="卡包" size="small">
          <el-input
            disabled
            v-model.trim="addingCardData.package"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="卡名" size="small" required>
          <el-input
            v-model.trim="addingCardData.card"
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
            <el-option label="GR" value="GR"></el-option>
            <el-option label="SER" value="SER"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingCard = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddingCard" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 批量新增卡牌dialog -->
    <el-dialog
      title="批量新增卡牌"
      :visible.sync="isBatchAddingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelBatchAddingCard"
    >
      <el-form label-position="top">
        <el-form-item label="卡包" size="small">
          <el-input
            disabled
            v-model.trim="batchAddingCardData.packageName"
            type="text"
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="renderItem.label"
          size="small"
          v-for="(renderItem, renderIndex) in batchAddingMenuRenderOptions"
          :key="'batch-add-card-render-' + renderIndex"
        >
          <el-input
            type="textarea"
            :rows="3"
            :placeholder="`请输入${renderItem.label}卡列表, 以“|”分割, 不使用换行, 例：卡1|卡2`"
            v-model="tempBatchAddingCardData[renderItem.dataKey]"
          ></el-input>
          <div class="stash-card-list">
            <span
              class="stash-card-list-title"
              v-if="batchAddingCardData[renderItem.dataKey].length !== 0"
              >待添加卡牌列表</span
            >
            <el-tag
              size="small"
              v-for="(item, index) in batchAddingCardData[renderItem.dataKey]"
              :key="renderItem.keyWord + index"
              >{{ item }}</el-tag
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isBatchAddingCard = false" size="small"
          >取 消</el-button
        >
        <el-button type="info" @click="analyseBatchAddingCardList" size="small"
          >解 析</el-button
        >
        <el-button type="primary" @click="submitBatchAddingCard" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑卡牌dialog -->
    <el-dialog
      title="编辑卡牌"
      :visible.sync="isEditingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditingCard"
    >
      <el-form label-position="top">
        <el-form-item label="旧卡名" size="small">
          <el-input
            disabled
            v-model.trim="editingCardData.oldname"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="新卡名" size="small" required>
          <el-input
            v-model.trim="editingCardData.newname"
            type="text"
            @keyup.enter.native="submitEditingCard"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="新稀有度" size="small" required>
            <el-select
              size="mini"
              v-model="editingCardData.rare"
              placeholder="请选择稀有度"
              clearable
            >
              <el-option label="N" value="N"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="SR" value="SR"></el-option>
              <el-option label="UR" value="UR"></el-option>
              <el-option label="HR" value="HR"></el-option>
              <el-option label="GR" value="GR"></el-option>
              <el-option label="SER" value="SER"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="需要硬币" size="small" required>
          <el-input
            v-model.number="editingCardData.needCoin"
            type="number"
            @keyup.enter.native="submitEditingCard"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="是否记录" size="small">
          <el-checkbox v-model="editingCardData.show"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingCard = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitEditingCard" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 交换卡牌稀有度dialog -->
    <el-dialog
      title="交换稀有度"
      :visible.sync="isExchangingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelExchangeCard"
    >
      <el-form label-position="top">
        <el-form-item label="卡1" size="small" required>
          <el-autocomplete
            size="mini"
            v-model.trim="exchangingCardData.card1"
            placeholder="请填写卡名"
            clearable
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchCandicateCardList"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="卡2" size="small" required>
          <el-autocomplete
            size="mini"
            v-model.trim="exchangingCardData.card2"
            placeholder="请填写卡名"
            clearable
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchCandicateCardList"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="是否记录" size="small">
          <el-checkbox v-model="exchangingCardData.show"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isExchangingCard = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitExchangeCard" size="small"
          >确 定</el-button
        >
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
            v-model.trim="addingUserData.target"
            type="text"
            @keyup.enter.native="submitAddingUser"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingUser = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddingUser" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户卡牌dialog -->
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
            type="number"
            @keyup.enter.native="submitEditCardCount_"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingCardCount = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditCardCount_" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增用户卡牌dialog -->
    <el-dialog
      :title="addingUserCardTips"
      :visible.sync="isAddingUserCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelEditCardCount"
    >
      <el-form label-position="top">
        <el-form-item label="卡名" size="small" required>
          <el-autocomplete
            size="mini"
            v-model.trim="editingCardCountData.card"
            clearable
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchCandicateCardList"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="数量" size="small" required>
          <el-input
            v-model.number="editingCardCountData.count"
            type="number"
            @keyup.enter.native="submitEditCardCount_"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddingUserCard = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditCardCount_" size="small"
          >确 定</el-button
        >
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
            type="number"
            @keyup.enter.native="submitEditUserInfo"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditingUserInfoItem = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitEditUserInfo" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 交换两用户卡片 -->
    <el-dialog
      title="换卡"
      :visible.sync="isSwappingUserCards"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelSwapUserCards"
    >
      <el-form label-position="top">
        <el-form-item label="玩家1" size="small" required>
          <el-select
            size="mini"
            v-model="swappingCardsDetails.userA"
            placeholder="请选择玩家"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="'swap-card-a-' + item.userName + item.userId"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" required>
          <el-autocomplete
            size="mini"
            v-model.trim="swappingCardsDetails.cardA"
            placeholder="请填写卡名"
            clearable
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchCandicateCardList"
            @keyup.enter.native="submitSwapUserCards"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="玩家2" size="small" required>
          <el-select
            size="mini"
            v-model="swappingCardsDetails.userB"
            placeholder="请选择玩家"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="'swap-card-b-' + item.userName + item.userId"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" required>
          <el-autocomplete
            size="mini"
            v-model.trim="swappingCardsDetails.cardB"
            placeholder="请填写卡名"
            clearable
            :trigger-on-focus="false"
            :fetch-suggestions="querySearchCandicateCardList"
            @keyup.enter.native="submitSwapUserCards"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSwappingUserCards = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitSwapUserCards" size="small"
          >确 定</el-button
        >
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
            <el-option label="有效" :value="0"></el-option>
            <el-option label="无效" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isSettingDrawRecord = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitDrawStatus" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 导入抽卡记录dialog -->
    <el-dialog
      title="导入抽卡记录"
      :visible.sync="isImportingDrewCards"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelImportDrewCards"
    >
      <el-form label-position="top">
        <el-form-item label="玩家" size="small" required>
          <el-select
            size="mini"
            v-model="importingDrewCardsInfo.target"
            placeholder="请选择玩家"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="'import-drew-' + item.userName + item.userId"
              :label="item.userName"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="抽卡结果" size="small" required>
          <el-input
            type="textarea"
            :rows="4"
            :placeholder="`请输入抽卡结果列表, 以“|”分割, 例：卡1|卡2|卡3\n卡4|卡5|卡6`"
            v-model="tempDrewCardsInfo"
          ></el-input>
          <div class="stash-card-list">
            <span
              class="stash-card-list-title"
              v-if="importingDrewCardsInfo.cards.length !== 0"
              >待添加结果列表</span
            >
            <div
              class="stash-import-group"
              v-for="(groupItem, groupIndex) in importingDrewCardsInfo.cards"
              :key="'stash-group-' + groupIndex"
            >
              <el-tag
                size="small"
                v-for="(item, index) in groupItem"
                :key="'stash-item-' + index"
                >{{ item }}</el-tag
              >
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isImportingDrewCards = false" size="small"
          >取 消</el-button
        >
        <el-button type="info" @click="analyseImportDrewCards" size="small"
          >解 析</el-button
        >
        <el-button type="primary" @click="submitImportDrewCards" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <card-desc
      :visible.sync="isShowingCardDesc"
      :posX="cardDesc.x"
      :posY="cardDesc.y"
      :picId="cardDesc.picId"
      :desc="cardDesc.desc"
      :is-show-on-mobile="_checkIfMobile()"
    ></card-desc>
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
  editCoinUrl,
  setDrawResultUrl,
  importDrewResultUrl,
  exchangeCardsRareUrl,
  editPackageOrderUrl,
  swapUserOwnCardUrl
} from "../config/url";
import { axiosFetch, axiosGet, axiosPostAsJSON } from "../utils/fetch";
import CardDesc from "@/components/CardDesc";
import draggable from "vuedraggable";
import { MessageBox } from "element-ui";
import { exportToExcelByJson } from "@/utils/xlsx";
export default {
  name: "Admin",
  mixins: [common],
  components: {
    CardDesc,
    draggable
  },
  data() {
    return {
      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      cardCandicateList: [],

      //新增卡包
      isAddingPackage: false,
      addingPackageData: {
        package: ""
      },
      //编辑卡包
      isEditingPackage: false,
      editingPackageData: {
        oldname: "",
        newname: ""
      },
      //新增卡片
      isAddingCard: false,
      addingCardData: {
        package: "",
        card: "",
        rare: "N"
      },
      //批量新增卡片
      isBatchAddingCard: false,
      batchAddingMenuRenderOptions: [
        {
          label: "N",
          keyWord: "stash-n-",
          dataKey: "nList"
        },
        {
          label: "R",
          keyWord: "stash-r-",
          dataKey: "rList"
        },
        {
          label: "SR",
          keyWord: "stash-sr-",
          dataKey: "srList"
        },
        {
          label: "UR",
          keyWord: "stash-ur-",
          dataKey: "urList"
        },
        {
          label: "HR",
          keyWord: "stash-hr-",
          dataKey: "hrList"
        },
        {
          label: "GR",
          keyWord: "stash-gr-",
          dataKey: "grList"
        },
        {
          label: "SER",
          keyWord: "stash-ser-",
          dataKey: "serList"
        }
      ],
      tempBatchAddingCardData: {
        nList: "",
        rList: "",
        srList: "",
        hrList: "",
        urList: "",
        grList: "",
        serList: ""
      },
      batchAddingCardData: {
        packageName: "",
        nList: [],
        rList: [],
        srList: [],
        hrList: [],
        urList: [],
        grList: [],
        serList: []
      },
      //编辑卡片
      isEditingCard: false,
      editingCardData: {
        oldname: "",
        newname: "",
        rare: "",
        needCoin: 0,
        show: false
      },

      //交换两卡片稀有度
      isExchangingCard: false,
      exchangingCardData: {
        card1: "",
        card2: "",
        show: false
      },

      //卡库查询
      libPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      libQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: ""
      },
      libTableData: [],
      //玩家卡库查询
      playerLibPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      playerLibQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: ""
      },
      playerLibTableData: [],

      //玩家页
      //新增玩家
      isAddingUser: false,
      addingUserData: {
        target: ""
      },
      //玩家查询
      userQueryAddition: {
        target: "",
        package: "",
        card: "",
        rare: ""
      },

      userSelectedInfo: {
        dust: 0,
        award: 0,
        duelPoint: 0,
        coin: 0
      },
      //编辑玩家数据
      isEditingUserInfoItem: false,
      editingUserInfoItemType: "",
      editingUserInfoItemCount: "",
      editingUserInfoItemTips: "",

      userPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      userTableData: [],

      //编辑玩家卡数量
      isEditingCardCount: false,
      isAddingUserCard: false, //利用相同接口做新增卡
      editingCardCountData: {
        card: "",
        target: "",
        count: null
      },
      addingUserCardTips: "",
      editingCardCountTips: "",

      //修改记录查询
      recordPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      recordQueryAddition: {
        packageName: "",
        cardName: "",
        rare: ""
      },
      recordTableData: [],
      highlightKey: null,

      //抽卡记录查询
      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      drawRecordQueryAddition: {
        package: "",
        user: "",
        dateRange: null
      },
      drawRecordTableData: [],

      //日志查询
      logPagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      logQueryAddition: {
        operator: "",
        detail: "",
        dateRange: null
      },
      logTableData: [],

      //设置抽卡记录状态
      isSettingDrawRecord: false,
      drawRecordStatusData: {
        status: 0,
        id: null
      },
      //导入抽卡记录
      isImportingDrewCards: false,
      importingDrewCardsInfo: {
        target: "",
        cards: []
      },
      tempDrewCardsInfo: "",
      //编辑卡包排序
      isEditingPackageOrder: false,
      editingPackageOrderList: [],
      isDragging: false,

      //交换两玩家卡片
      isSwappingUserCards: false,
      swappingCardsDetails: {
        userA: "",
        cardA: "",
        userB: "",
        cardB: ""
      }
    };
  },

  mounted() {
    this.generateCandicateCardList();
  },
  methods: {
    handleSelect(index) {
      this.showTab = index;
    },

    async reloadPage() {
      this.$openLoading();
      var tempIndex = this.showTab;
      Object.assign(this.$data, this.$options.data());
      this.showTab = tempIndex;
      this.cardPackageList = await this._queryPackageList();
      this.userList = await this._queryUserList();
      this.$closeLoading();
      this.generateCandicateCardList();
    },

    //生成输入卡片名字时的输入建议列表
    async generateCandicateCardList() {
      let cardList = await this._queryCardList(
        1,
        65535,
        undefined,
        undefined,
        undefined,
        undefined,
        "admin_search"
      );
      this.cardCandicateList = cardList.data.map(item => {
        return {
          value: item.cardName
        };
      });
    },

    querySearchCandicateCardList(queryString, callback) {
      let result = queryString
        ? this.cardCandicateList.filter(this.listFilter(queryString))
        : this.cardCandicateList;
      callback(result);
    },

    listFilter(queryString) {
      return item => {
        return item.value.indexOf(queryString) >= 0;
      };
    },

    //情报页面点击手风琴面板时触发
    async handleItemChange(itemIndex) {
      if (!!this.packageListContent[itemIndex] || itemIndex === "") {
        return;
      }
      this.$openLoading();
      let packageData = await this._queryCardList(
        undefined,
        undefined,
        this.cardPackageList[itemIndex]["packageName"],
        undefined,
        undefined,
        undefined,
        "admin_package"
      );
      this.$set(this.packageListContent, itemIndex, packageData);
      this.$closeLoading();
    },

    //情报页面表格分页切换
    pageChange(page) {
      this.$openLoading();
      this._queryCardList(
        page,
        this.defaultPageSize,
        this.cardPackageList[this.activeItemIndex]["packageName"],
        undefined,
        undefined,
        undefined,
        "admin_package"
      ).then(data => {
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
            package: this.addingPackageData.package
          }
        }).then(res => {
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
            newname: this.editingPackageData.newname
          }
        }).then(res => {
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
        axiosGet({
          url: addCardUrl,
          data: {
            package: this.addingCardData.package,
            card: this.addingCardData.card,
            rare: this.addingCardData.rare
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isAddingCard = false;
            this.reloadPage();
          }
        });
      }
    },

    batchAddCard(packageName) {
      this.batchAddingCardData.packageName = packageName;
      this.isBatchAddingCard = true;
    },
    cancelBatchAddingCard() {
      Object.assign(
        this.$data.batchAddingCardData,
        this.$options.data().batchAddingCardData
      );
      Object.assign(
        this.$data.tempBatchAddingCardData,
        this.$options.data().tempBatchAddingCardData
      );
    },
    analyseBatchAddingCardList() {
      [
        "nList",
        "rList",
        "srList",
        "hrList",
        "urList",
        "grList",
        "serList"
      ].forEach(item => {
        this.batchAddingCardData[item] = this.tempBatchAddingCardData[item]
          ? this.tempBatchAddingCardData[item].split("|").map(t => t.trim())
          : [];
      });
    },

    submitBatchAddingCard() {
      this.$openLoading();
      axiosPostAsJSON({
        url: addCardUrl,
        data: {
          packageName: this.batchAddingCardData.packageName,
          nList: this.batchAddingCardData.nList,
          rList: this.batchAddingCardData.rList,
          srList: this.batchAddingCardData.srList,
          hrList: this.batchAddingCardData.hrList,
          urList: this.batchAddingCardData.urList,
          grList: this.batchAddingCardData.grList,
          serList: this.batchAddingCardData.serList
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.isBatchAddingCard = false;
          this.$alertSuccess(res.data.data);
          this.reloadPage();
        }
      });
    },
    editCard(row) {
      this.editingCardData.oldname = row.cardName;
      this.editingCardData.newname = row.cardName;
      this.editingCardData.rare = row.rare;
      this.editingCardData.needCoin = row.needCoin;
      this.isEditingCard = true;
    },

    cancelEditingCard() {
      this.editingCardData.oldname = "";
      this.editingCardData.newname = "";
      this.editingCardData.rare = "";
      this.editingCardData.needCoin = 0;
      this.editingCardData.show = false;
    },

    submitEditingCard() {
      if (this.editingCardData.newname) {
        this.$openLoading();
        axiosFetch({
          url: editCardNameUrl,
          data: {
            oldname: this.editingCardData.oldname,
            newname: this.editingCardData.newname,
            newRare: this.editingCardData.rare,
            needCoin: this.editingCardData.needCoin,
            show: Number(this.editingCardData.show) || undefined
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingCard = false;
            this.reloadPage();
          }
        });
      }
    },
    //互换卡片稀有度
    exchangeCard() {
      this.isExchangingCard = true;
    },

    cancelExchangeCard() {
      this.exchangingCardData.card1 = "";
      this.exchangingCardData.card2 = "";
      this.exchangingCardData.show = false;
    },

    submitExchangeCard() {
      if (this.exchangingCardData.card1 && this.exchangingCardData.card2) {
        this.$openLoading();
        axiosFetch({
          url: exchangeCardsRareUrl,
          data: {
            card1: this.exchangingCardData.card1,
            card2: this.exchangingCardData.card2,
            show: Number(this.exchangingCardData.show) || undefined
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isExchangingCard = false;
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
        this.libQueryAddition.rare.length > 0
          ? this.libQueryAddition.rare
          : undefined,
        this.libQueryAddition.userName || undefined,
        "admin_search"
      ).then(data => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
    },
    //玩家卡库页面 清除条件
    playerLibClearAddition() {
      Object.assign(
        this.$data.playerLibQueryAddition,
        this.$options.data().playerLibQueryAddition
      );
    },

    //玩家卡库查询 && 分页切换
    playerLibQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.playerLibQueryAddition.packageName || undefined,
        this.playerLibQueryAddition.cardName || undefined,
        this.playerLibQueryAddition.rare.length > 0
          ? this.playerLibQueryAddition.rare
          : undefined,
        this.playerLibQueryAddition.userName || undefined,
        "player_lib"
      ).then(data => {
        this.playerLibPagination.page = data.pagination.page;
        this.playerLibPagination.total = data.pagination.total;
        this.playerLibTableData = data.data;
        this.$closeLoading();
      });
    },
    playerLibExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.playerLibQueryAddition.packageName || undefined,
            this.playerLibQueryAddition.cardName || undefined,
            this.playerLibQueryAddition.rare.length > 0
              ? this.playerLibQueryAddition.rare
              : undefined,
            this.playerLibQueryAddition.userName || undefined,
            "player_lib"
          ).then(data => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then(_res => {
                this.$alertSuccess(_res);
              })
              .catch(_err => {
                this.$alertWarning(_err);
              });

            this.$closeLoading();
          });
        })
        .catch(() => {});
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
      ).then(data => {
        this.recordPagination.page = data.pagination.page;
        this.recordPagination.total = data.pagination.total;
        this.recordTableData = data.data;
        this.$closeLoading();
      });
    },

    //记录 高亮同carkPk行
    recordHighlightRow(row, column, cell, event) {
      this.highlightKey = row["cardPk"];
    },
    recordCancelHighlightRow(row, column, cell, event) {
      this.highlightKey = null;
    },
    recordHightlightClass({row, rowIndex}) {
      if (row["cardPk"] === this.highlightKey) {
        return "record-hightlight-row"
      }
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
            target: this.addingUserData.target
          }
        }).then(res => {
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
        element => element.userName === userName
      );
      this.userSelectedInfo.dust = userInfo.dustCount;
      this.userSelectedInfo.award = userInfo.nonawardCount;
      this.userSelectedInfo.duelPoint = userInfo.duelPoint;
      this.userSelectedInfo.coin = userInfo.coin;
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
        this.userQueryAddition.rare.length > 0
          ? this.userQueryAddition.rare
          : undefined,
        this.userQueryAddition.target || undefined,
        "player_lib"
      ).then(data => {
        this.userPagination.page = data.pagination.page;
        this.userPagination.total = data.pagination.total;
        this.userTableData = data.data;
        this.$closeLoading();
      });
    },

    userOwnExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.userQueryAddition.package || undefined,
            this.userQueryAddition.card || undefined,
            this.userQueryAddition.rare.length > 0
              ? this.userQueryAddition.rare
              : undefined,
            this.userQueryAddition.target || undefined,
            "player_lib"
          ).then(data => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then(_res => {
                this.$alertSuccess(_res);
              })
              .catch(_err => {
                this.$alertWarning(_err);
              });

            this.$closeLoading();
          });
        })
        .catch(() => {});
    },

    editCardCount(card, target) {
      this.editingCardCountData.card = card;
      this.editingCardCountData.target = target;
      this.editingCardCountTips = `正在编辑玩家【${target}】的【${card}】`;
      this.isEditingCardCount = true;
    },
    //利用相同接口新增卡牌
    addUserCard() {
      this.editingCardCountData.target = this.userQueryAddition.target;
      this.addingUserCardTips = `正在为玩家【${
        this.userQueryAddition.target
      }】新增卡牌`;
      this.isAddingUserCard = true;
    },
    cancelEditCardCount() {
      this.editingCardCountData.card = "";
      this.editingCardCountData.target = "";
      this.editingCardCountData.count = null;
      this.editingCardCountTips = "";
      this.addingUserCardTips = "";
    },
    submitEditCardCount_() {
      MessageBox.confirm("请确认是否修改", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.showTab === "3") {
            this.submitEditCardCount(this.playerLibQueryCard, 1);
          } else if (this.showTab === "4") {
            this.submitEditCardCount(this.userQuery, 1);
          }
        })
        .catch(() => {});
    },
    submitEditCardCount(callback, arg) {
      if (
        typeof this.editingCardCountData.count === "number" &&
        this.editingCardCountData.count >= 0 &&
        !!this.editingCardCountData.card
      ) {
        this.$openLoading();
        axiosGet({
          url: editCardCountUrl,
          data: {
            card: this.editingCardCountData.card,
            target: this.editingCardCountData.target,
            count: this.editingCardCountData.count
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.isEditingCardCount = false;
            this.isAddingUserCard = false;
            callback(arg);
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
        case "硬币":
          this.editingUserInfoItemCount = this.userSelectedInfo.coin;
          break;
      }
      this.editingUserInfoItemTips = `正在编辑玩家【${
        this.userQueryAddition.target
      }】`;
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
            target: this.userQueryAddition.target
          }
        };
        switch (this.editingUserInfoItemType) {
          case "月见黑":
            options.url = editAwardUrl;
            options.data.award = this.editingUserInfoItemCount;
            break;
          case "剩余尘数":
            options.url = editDustUrl;
            options.data.count = this.editingUserInfoItemCount;
            break;
          case "硬币":
            options.url = editCoinUrl;
            options.data.coin = this.editingUserInfoItemCount;
            break;
        }
        axiosFetch(options).then(async res => {
          if (res.data.code === 200) {
            this.isEditingUserInfoItem = false;
            this.userList = await this._queryUserList();
            this.setUserInfo(this.userQueryAddition.target);
            this.$closeLoading();
            //this.reloadPage();
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
        this.drawRecordQueryAddition.package || undefined,
        this.drawRecordQueryAddition.user || undefined,
        this.drawRecordQueryAddition.dateRange
          ? this.drawRecordQueryAddition.dateRange[0]
          : undefined,
        this.drawRecordQueryAddition.dateRange
          ? this.drawRecordQueryAddition.dateRange[1]
          : undefined
      ).then(data => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },

    //设置抽卡结果是否生效
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
          id: this.drawRecordStatusData.id
        }
      }).then(async res => {
        if (res.data.code === 200) {
          this.isSettingDrawRecord = false;
          this.drawRecordQuery(1);
          this.userList = await this._queryUserList();
          //this.reloadPage();
        }
      });
    },

    //导入已抽得的卡
    importDrewCards() {
      this.isImportingDrewCards = true;
    },
    cancelImportDrewCards() {
      Object.assign(
        this.$data.importingDrewCardsInfo,
        this.$options.data().importingDrewCardsInfo
      );
      this.tempDrewCardsInfo = "";
    },
    analyseImportDrewCards() {
      let regx = /\n\r|\r|\n/g;
      let tempArray = this.tempDrewCardsInfo
        .split(regx)
        .filter(t => !!t)
        .map(t => t.trim());
      let result = [];
      tempArray.forEach(item => {
        result.push(item.split("|").map(t => t.trim()));
      });
      this.importingDrewCardsInfo.cards = result;
    },
    submitImportDrewCards() {
      if (
        this.importingDrewCardsInfo.target &&
        this.importingDrewCardsInfo.cards.length > 0
      ) {
        this.$openLoading();
        axiosPostAsJSON({
          url: importDrewResultUrl,
          data: {
            target: this.importingDrewCardsInfo.target,
            cards: this.importingDrewCardsInfo.cards
          }
        }).then(async res => {
          if (res.data.code === 200) {
            this.isImportingDrewCards = false;
            this.drawRecordQuery(1);
            this.userList = await this._queryUserList();
            //this.reloadPage();
          }
        });
      }
    },

    //编辑卡包排序
    editPackageOrder() {
      this.isEditingPackageOrder = true;
      this.editingPackageOrderList = this.cardPackageList.map(item => {
        return {
          name: item["packageName"],
          order: item["packageId"]
        };
      });
    },
    cancelEditingPackageOrder() {
      this.isEditingPackageOrder = false;
      this.editingPackageOrderList = [];
    },
    submitEditingPackageOrder() {
      this.$openLoading();
      axiosPostAsJSON({
        url: editPackageOrderUrl,
        data: {
          packageIndexList: this.editingPackageOrderList.map(i => i.order)
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.reloadPage();
        }
      });
    },

    //交换玩家持有的卡片
    swapUserCards() {
      this.isSwappingUserCards = true;
    },

    cancelSwapUserCards() {
      Object.assign(
        this.$data.swappingCardsDetails,
        this.$options.data().swappingCardsDetails
      );
    },

    submitSwapUserCards() {
      MessageBox.confirm("请确认是否交换", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let temp = this.swappingCardsDetails;
          if (temp.cardA && temp.cardB && temp.userA && temp.userB) {
            this.$openLoading();
            axiosPostAsJSON({
              url: swapUserOwnCardUrl,
              data: {
                userA: temp.userA,
                cardA: temp.cardA,
                userB: temp.userB,
                cardB: temp.cardB
              }
            }).then(res => {
              if (res.data.code === 200) {
                this.reloadPage();
              }
            });
          }
        })
        .catch(() => {});
    },

    // 日志
    logClearAddition() {
      Object.assign(
        this.$data.logQueryAddition,
        this.$options.data().logQueryAddition
      );
    },

    logQuery(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryLogList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.logQueryAddition.operator || undefined,
        this.logQueryAddition.detail || undefined,
        this.logQueryAddition.dateRange
          ? this.logQueryAddition.dateRange[0]
          : undefined,
        this.logQueryAddition.dateRange
          ? this.logQueryAddition.dateRange[1]
          : undefined
      ).then(data => {
        this.logPagination.page = data.pagination.page;
        this.logPagination.total = data.pagination.total;
        this.logTableData = data.data;
        this.$closeLoading();
      });
    }
  }
};
</script>

<style scoped>
#admin {
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
.admin-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  height: 3rem;
  flex: initial;
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
.admin-info .el-button + .el-button {
  margin-left: 10px;
}

.admin-main {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  flex: auto;
  min-height: 500px;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.admin-main-menu {
  width: 100%;
  flex: initial;
  display: flex;
  flex-wrap: wrap;
}
.admin-main .el-menu {
  flex: auto;
}
.admin-main-menu-control {
  flex: initial;
  border-bottom: solid 1px #e6e6e6;
  display: flex;
  align-content: center;
  margin-left: auto;
}
.admin-main-menu-control .el-button {
  opacity: 0.4;
}

.admin-main-menu-control .el-button:hover {
  opacity: 1;
}

.admin-main-content {
  box-sizing: border-box;
  padding: 1rem;
  flex: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
.table-preview-btn {
  font-size: 1.2rem;
  padding: 2px;
  border-radius: 5px;
  color: #66b1ff;
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
  margin-top: 10px;
}

.admin-main-content-addition-special {
  min-height: 30px;
  width: 12rem;
}
.special-user-add {
  margin-left: auto;
  margin-right: 10px;
}
.special-user-info {
  color: #606266;
  font-size: 0.7rem;
  border-radius: 0.3rem;
  border: 1px solid #dcdfe6;
  height: 26px;
  width: auto;
  padding: 0 0.5rem;
}
.special-user-info .el-button {
  padding: 0;
  font-size: 0.7rem;
}
.special-user-info span {
  height: 26px;
  line-height: 26px;
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
  width: 12rem;
  height: 3rem;
  margin-right: 0.6rem;
}
.admin-main-content-addition-item.special {
  width: auto;
}
.admin-main-content-addition-special /deep/ .el-tag,
.admin-main-content-addition-item /deep/ .el-tag {
  overflow: hidden;
  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.admin-main-content-table-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
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
.draw-result-name.grey {
  color: #cacaca;
}
.el-dialog .el-select,
.el-dialog .el-autocomplete {
  width: 100%;
}

.stash-card-list-title {
  display: block;
  line-height: 32px;
}

.stash-card-list .el-tag {
  margin-right: 5px;
}

.stash-import-group {
  box-sizing: border-box;
  padding: 0 5px;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  margin-bottom: 5px;
}

.table-expand-desc-box {
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.package-order-list {
  list-style: none;
  border-top: 1px solid #ebeef5;
  padding: 0;
  margin: 0;
}
.package-order-list-item {
  color: #66b1ff;
  font-weight: bold;
  display: flex;
  align-items: center;
  height: 48px;
  line-height: 48px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  transition: border-bottom-color 0.3s;
  outline: 0;
  cursor: move;
}
.package-order-list-item i {
  margin-left: auto;
}
.package-order-list-item-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.el-table /deep/ .record-hightlight-row {
  box-shadow: 0 0 20px inset #409EFF55;
}
</style>
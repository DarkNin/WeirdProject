<template>
  <div id="player">
    <div class="player-info">
      <p class="player-info-tips">欢迎来到诡异云，{{ username }}。</p>
      <span class="player-info-item">
        <p>硬币: {{ coin }}</p>
        <p>月见黑: {{ leftAward }}</p>
        <p>尘数: {{ leftDust }}</p>
      </span>

      <el-button type="text" @click="reloadPage">刷新</el-button>
      <el-button type="text" @click="fuseCard">合成</el-button>
    </div>
    <div class="player-main" :class="{ 'player-main-mobile': _checkIfMobile() }">
      <el-menu mode="horizontal" default-active="0" @select="handleSelect">
        <el-menu-item index="1">情报</el-menu-item>
        <el-menu-item index="2">检索</el-menu-item>
        <el-menu-item index="3">卡库</el-menu-item>
        <el-menu-item index="4">抽卡记录</el-menu-item>
        <el-menu-item index="5">修改记录</el-menu-item>
        <el-menu-item index="6">卡组</el-menu-item>
      </el-menu>
      <div class="player-main-content" v-if="showTab === '1'">
        <el-collapse
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
              <el-table
                :data="
                  packageListContent[index]
                    ? packageListContent[index]['data']
                    : []
                "
                size="mini"
                height="48vh"
              >
                <el-table-column
                  :key="'package-' + item.packageName + '-1'"
                  prop="cardName"
                  label="卡名"
                ></el-table-column>
                <el-table-column
                  :key="'package-' + item.packageName + '-2'"
                  prop="rare"
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
                  prop="count"
                  label="持有数量"
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
      </div>

      <!-- 全卡检索 -->
      <div class="player-main-content-addition" v-if="showTab === '2'">
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
          <el-autocomplete
            size="mini"
            v-model="libQueryAddition.cardName"
            placeholder="请填写搜索条件"
            clearable
            :fetch-suggestions="querySearchCandicateCardList"
            @keyup.enter.native="libAllQueryCard"
          ></el-autocomplete>
        </div>
        <div class="player-main-content-addition-item special">
          <el-checkbox
            size="mini"
            v-model="libQueryAddition.searchInCollection"
            >收藏中</el-checkbox
          >
        </div>

        <div class="player-main-content-addition-item">
          <el-button type="info" size="mini" @click="libClearAddition"
            >清除条件</el-button
          >
          <el-button type="primary" size="mini" @click="libAllQueryCard"
            >查询</el-button
          >
        </div>
      </div>
      <div class="player-main-content-table-wrap" v-if="showTab === '2'">
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
            v-if="_checkAnyUsingCoin(this.libTableData)"
            label="需要硬币"
          ></el-table-column>
          <el-table-column
            :key="'lib-column-' + 5"
            prop="count"
            label="持有数量"
          ></el-table-column>
          <el-table-column
            :key="'lib-column-' + 6"
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
          <el-table-column :key="'lib-column-' + 7" width="64">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="toCollection(scope.row)"
                v-if="checkIfCanCollect(scope.row)"
                >收藏</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="disCollection(scope.row)"
                v-if="checkIfCanDisCollect(scope.row)"
                >取消收藏</el-button
              >
            </template>
          </el-table-column>
          <el-table-column :key="'lib-column-' + 8" width="64">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="confirmUseCoin(scope.row)"
                v-if="checkIfCanUseCoin(scope.row)"
                >兑换</el-button
              >
            </template>
          </el-table-column>

          <!-- <el-table-column :key="'lib-column-' + 4" prop="userName" label="拥有者"></el-table-column> -->
        </el-table>
        <div class="player-main-content-table-pagination">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="libPagination.total"
            :page-size="libPagination.pageSize"
            :current-page="libPagination.page"
            @current-change="libAllQueryCard"
          ></el-pagination>
        </div>
      </div>

      <!-- 持有记录 -->
      <div class="player-main-content-addition" v-if="showTab === '3'">
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
          <el-select
            size="mini"
            v-model="libQueryAddition.userName"
            placeholder="请选择玩家"
            multiple
            collapse-tags
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
        <div class="player-main-content-addition-item">
          <el-autocomplete
            size="mini"
            v-model="libQueryAddition.cardName"
            placeholder="请填写搜索条件"
            clearable
            :fetch-suggestions="querySearchCandicateCardList"
            @keyup.enter.native="libQueryCard"
          ></el-autocomplete>
        </div>
        <div class="player-main-content-addition-item special">
          <el-button type="info" size="mini" @click="libClearAddition"
            >清除条件</el-button
          >
          <el-button type="primary" size="mini" @click="setToMineInLib"
            >只查自己</el-button
          >
          <el-button type="primary" size="mini" @click="libQueryCard"
            >查询</el-button
          >
          <el-button type="primary" size="mini" @click="libExport"
            >导出</el-button
          >
        </div>
      </div>
      <div class="player-main-content-table-wrap" v-if="showTab === '3'">
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
            prop="needCoin"
            v-if="_checkAnyUsingCoin(this.playerLibTableData)"
            label="需要硬币"
          ></el-table-column>
          <el-table-column
            :key="'player-lib-column-' + 5"
            prop="userName"
            label="拥有者"
          ></el-table-column>
          <el-table-column
            :key="'player-lib-column-' + 6"
            prop="count"
            label="拥有数量"
          ></el-table-column>
          <el-table-column
            :key="'player-lib-column-' + 7"
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
          <el-table-column :key="'player-lib-column-' + 8" width="64">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="turnToDust(scope.row)"
                v-if="checkIfTurnColumnShow(scope.row)"
                >转化</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="player-main-content-table-pagination">
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="playerLibPagination.total"
            :page-size="playerLibPagination.pageSize"
            :current-page="playerLibPagination.page"
            @current-change="libQueryCard"
          ></el-pagination>
        </div>
      </div>

      <!-- 抽卡记录 -->
      <div class="player-main-content-addition" v-if="showTab === '4'">
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item special">
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
        <div class="player-main-content-addition-item special">
          <el-button type="info" size="mini" @click="drawRecordClearAddition"
            >清除条件</el-button
          >
          <el-button type="primary" size="mini" @click="setToMineInRecord"
            >只查自己</el-button
          >
          <el-button type="primary" size="mini" @click="drawRecordQuery"
            >查询</el-button
          >
        </div>
      </div>
      <div class="player-main-content-table-wrap" v-if="showTab === '4'">
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
            label="是否有效"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.isDisabled ? "无效" : "有效" }}</div>
            </template>
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
          
        </el-table>
        <div class="player-main-content-table-pagination">
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

      <!-- 修改记录 -->
      <div class="player-main-content-addition" v-if="showTab === '5'">
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
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
        <div class="player-main-content-addition-item">
          <el-input
            size="mini"
            v-model="recordQueryAddition.cardName"
            placeholder="请填写卡名"
            clearable
            @keyup.enter.native="recordQuery"
          ></el-input>
        </div>
        <div class="player-main-content-addition-item">
          <el-button type="info" size="mini" @click="recordClearAddition"
            >清除条件</el-button
          >
          <el-button type="primary" size="mini" @click="recordQuery"
            >查询</el-button
          >
        </div>
      </div>
      <div class="player-main-content-table-wrap" v-if="showTab === '5'">
        <el-table
          :data="recordTableData"
          size="mini"
          height="auto"
          @cell-mouse-enter="recordHighlightRow"
          @cell-mouse-leave="recordCancelHighlightRow"
          :row-class-name="recordHightlightClass"
        >
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
        <div class="player-main-content-table-pagination">
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

      <!-- 卡组 -->
      <deck-generator
        :showCardDescHover="_showCardDescHover"
        :showCardDescClick="_showCardDescClick"
        :closeCardDesc="_closeCardDesc"
        :userList="userList"
        v-if="showTab === '6'"
      />
    </div>

    <!-- 尘转dialog -->
    <el-dialog
      title="转卡"
      :visible.sync="isFusingCard"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelFusingCard"
    >
      <div class="fusion-wrap">
        <el-button
          class="fusion-btn"
          type="primary"
          size="mini"
          @click="fuseCardInner('standard')"
          >指定卡</el-button
        >
        <el-button
          class="fusion-btn"
          type="primary"
          size="mini"
          @click="fuseCardInner('random')"
          >随机抽取</el-button
        >
      </div>
      <el-dialog
        width="20rem"
        :visible.sync="isFusingCardInner"
        append-to-body
        @close="cancelFusingCard"
      >
        <el-form label-position="top">
          <el-form-item
            label="卡名"
            size="small"
            required
            v-if="fusingCardType === 'standard'"
          >
            <el-autocomplete
              v-model="fusingCardData.card"
              type="text"
              clearable
              :fetch-suggestions="querySearchCandicateCardList"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item
            label="卡包"
            size="small"
            required
            v-else-if="fusingCardType === 'random'"
          >
            <el-select
              size="mini"
              v-model="fusingCardData.package"
              placeholder="请选择卡包"
              clearable
            >
              <el-option
                v-for="item in cardPackageList"
                :key="'fuse-card-' + item.packageName + item.packageId"
                :label="item.packageName"
                :value="item.packageName"
              ></el-option>
            </el-select>
            <el-checkbox size="mini" v-model="fusingCardData.dustFirst"
              >优先使用尘</el-checkbox
            >
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isFusingCardInner = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" @click="submitFusingCard" size="small"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-dialog>

    <!-- 转尘dialog -->
    <el-dialog
      title="转尘（50尘/张）"
      :visible.sync="isTurningToDust"
      width="20rem"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="cancelTurnToDust"
    >
      <el-form label-position="top" :model="turnToDustInfo">
        <el-form-item label="卡名" size="small">
          <el-input
            v-model="turnToDustInfo.card"
            type="text"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="数量" size="small" required prop="count">
          <el-input
            v-model.number="turnToDustInfo.count"
            type="number"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isTurningToDust = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitTurnToDust" size="small"
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
import { axiosFetch, axiosGet } from "@/utils/fetch.js";
import common from "./mixins/common";
import MD5 from "crypto-js/md5";
import { MessageBox } from "element-ui";
import {
  transDustToCardUrl,
  transDustToCardRandomUrl,
  transCardToDustUrl,
  transCoinToCardUrl,
} from "@/config/url.js";
import CardDesc from "@/components/CardDesc";
import DeckGenerator from "./common/DeckGenerator";
import { exportToExcelByJson } from "@/utils/xlsx";
export default {
  name: "Player",
  mixins: [common],
  components: {
    CardDesc,
    DeckGenerator,
  },
  data() {
    return {
      leftDust: 0,
      coin: 0,
      leftAward: 0,
      duelPoint: 0,

      showTab: "1",

      packageListContent: {},
      activeItemIndex: "",

      cardCandicateList: [],

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
        searchInCollection: "",
      },
      libTableData: [],
      //玩家卡库查询
      playerLibPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      playerLibQueryAddition: {
        packageName: "",
        cardName: "",
        userName: "",
        rare: "",
      },
      playerLibTableData: [],

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
      highlightKey: null,

      drawRecordPagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      drawRecordQueryAddition: {
        package: "",
        user: "",
        dateRange: null,
      },
      drawRecordTableData: [],

      //合成卡片
      isFusingCard: false,
      isFusingCardInner: false,
      fusingCardType: "", //'standard' 'random'
      fusingCardData: {
        package: "",
        card: "",
        dustFirst: false,
      },

      //卡转尘
      isTurningToDust: false,
      turnToDustInfo: {
        card: "",
        count: null,
        basicCount: null,
      },
    };
  },
  async mounted() {
    this.generateCandicateCardList();
    this.$on("preloaded", () => {
      let userInfo = this.userList.find(
        (element) => element.userName === this.username
      );
      if (userInfo) {
        this.duelPoint = userInfo.duelPoint;
        this.leftDust = userInfo.dustCount;
        this.leftAward = userInfo.nonawardCount;
        this.coin = userInfo.coin;
      }
      if (
        JSON.parse(window.localStorage.getItem("info")).p ===
        MD5("123456").toString()
      ) {
        MessageBox.confirm("正在使用默认密码，是否修改？", "提示", {
          confirmButtonText: "前往修改",
          cancelButtonText: "暂不",
          type: "info",
        })
          .then(() => {
            this.$router.push("/edit_password");
          })
          .catch(() => {});
      }
    });
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
      let userInfo = this.userList.find(
        (element) => element.userName === this.username
      );
      if (userInfo) {
        this.duelPoint = userInfo.duelPoint;
        this.leftDust = userInfo.dustCount;
        this.leftAward = userInfo.nonawardCount;
        this.coin = userInfo.coin;
      }
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
      this.cardCandicateList = cardList.data.map((item) => {
        return {
          value: item.cardName,
        };
      });
    },

    querySearchCandicateCardList(queryString, callback) {
      let result = queryString
        ? this.cardCandicateList.filter(this.listFilter(queryString))
        : [];
      callback(result);
    },

    listFilter(queryString) {
      return (item) => {
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
        "player_info"
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
        "player_info"
      ).then((data) => {
        this.$set(this.packageListContent, this.activeItemIndex, data);
        this.$closeLoading();
      });
    },

    //卡库页面 清除条件
    libClearAddition() {
      Object.assign(
        this.$data.libQueryAddition,
        this.$options.data().libQueryAddition
      );
    },

    //卡库查询 && 分页切换
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
        this.libQueryAddition.userName || undefined,
        "player_lib"
      ).then((data) => {
        this.playerLibPagination.page = data.pagination.page;
        this.playerLibPagination.total = data.pagination.total;
        this.playerLibTableData = data.data;
        this.$closeLoading();
      });
    },

    //全卡池卡库查询 && 分页切换
    libAllQueryCard(page) {
      this.$openLoading();
      //排除默认鼠标事件参数
      let currPage = typeof page === "number" ? page : undefined;
      this._queryCardList(
        currPage || this.defaultPage,
        this.defaultPageSize,
        this.libQueryAddition.packageName || undefined,
        this.libQueryAddition.cardName || undefined,
        this.libQueryAddition.rare || undefined,
        this.libQueryAddition.userName || undefined,
        "admin_search",
        this.libQueryAddition.searchInCollection
      ).then((data) => {
        this.libPagination.page = data.pagination.page;
        this.libPagination.total = data.pagination.total;
        this.libTableData = data.data;
        this.$closeLoading();
      });
    },

    setToMineInLib() {
      this.libQueryAddition.userName = [];
      this.libQueryAddition.userName.push(this.username);
      this.libQueryCard();
    },
    libExport() {
      MessageBox.confirm("请确认是否以当前条件导出Excel文档", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$openLoading();
          this._queryCardList(
            1,
            2147483647,
            this.libQueryAddition.packageName || undefined,
            this.libQueryAddition.cardName || undefined,
            this.libQueryAddition.rare || undefined,
            this.libQueryAddition.userName || undefined,
            "player_lib"
          ).then((data) => {
            let fileData = this._generateLibDataForExport(data.data);
            exportToExcelByJson(fileData.data, fileData.fileName)
              .then((_res) => {
                this.$alertSuccess(_res);
              })
              .catch((_err) => {
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
      ).then((data) => {
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
    recordHightlightClass({ row, rowIndex }) {
      if (row["cardPk"] === this.highlightKey) {
        return "record-hightlight-row";
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
      ).then((data) => {
        this.drawRecordPagination.page = data.pagination.page;
        this.drawRecordPagination.total = data.pagination.total;
        this.drawRecordTableData = data.data;
        this.$closeLoading();
      });
    },
    setToMineInRecord() {
      this.drawRecordQueryAddition.user = [];
      this.drawRecordQueryAddition.user.push(this.username);
      this.drawRecordQuery();
    },

    fuseCard() {
      this.isFusingCard = true;
    },
    fuseCardInner(type) {
      this.isFusingCardInner = true;
      this.fusingCardType = type;
    },

    cancelFusingCard() {
      this.fusingCardType = "";
      this.fusingCardData.package = "";
      this.fusingCardData.card = "";
      this.fusingCardData.dustFirst = false;
    },
    submitFusingCard() {
      if (this.fusingCardType === "standard" && !this.fusingCardData.card)
        return;
      if (this.fusingCardType === "random" && !this.fusingCardData.package)
        return;
      MessageBox.confirm("请确认是否合成", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$openLoading();
          let options = {
            url: "",
            data: {},
          };
          if (this.fusingCardType === "standard") {
            options.url = transDustToCardUrl;
            options.data.card = this.fusingCardData.card;
          }
          if (this.fusingCardType === "random") {
            options.url = transDustToCardRandomUrl;
            options.data.package = this.fusingCardData.package;
            options.data.dustFirst = Number(this.fusingCardData.dustFirst);
          }
          axiosFetch(options).then((res) => {
            if (res.data.code === 200) {
              this.isFusingCardInner = false;
              this.isFusingCard = false;
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    //转化多余闪为尘
    checkIfTurnColumnShow(row) {
      return (
        row.count > 3 &&
        ["UR", "SR", "HR"].includes(row.rare) &&
        row.userName === this.username
      );
    },
    turnToDust(row) {
      this.turnToDustInfo.card = row.cardName;
      this.turnToDustInfo.count = row.count - 3;
      this.turnToDustInfo.basicCount = row.count;
      this.isTurningToDust = true;
    },
    cancelTurnToDust() {
      this.turnToDustInfo.card = "";
      this.turnToDustInfo.count = null;
      this.turnToDustInfo.basicCount = null;
    },
    submitTurnToDust() {
      let temp = this.turnToDustInfo;
      let regx = /^[1-9][0-9]*$/;
      if (!regx.test(temp.count) || temp.count > temp.basicCount - 3) {
        this.$alertInfo("请输入合适的数量");
        return;
      }
      MessageBox.confirm(
        `是否将${temp.count}张【${temp.card}】转化为尘？`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$openLoading();
          axiosGet({
            url: transCardToDustUrl,
            data: {
              card: temp.card,
              count: temp.count,
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.isTurningToDust = false;
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },

    checkIfCanCollect(row) {
      return row.inCollection === 0;
    },

    checkIfCanDisCollect(row) {
      return row.inCollection === 1;
    },

    toCollection(row) {
      this._collectionOperation(row.cardName, 1).then((res) => {
        if (res.data.code === 200) {
          this.libAllQueryCard(this.libPagination.page);
        }
      });
    },

    disCollection(row) {
      this._collectionOperation(row.cardName, 2).then((res) => {
        if (res.data.code === 200) {
          this.libAllQueryCard(this.libPagination.page);
        }
      });
    },

    checkIfCanUseCoin(row) {
      return row.needCoin > 0 && row.needCoin <= this.coin && row.count === 0;
    },

    confirmUseCoin(row) {
      MessageBox.confirm(
        `是否使用${row.needCoin}枚硬币兑换【${row.cardName}】？`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$openLoading();
          axiosGet({
            url: transCoinToCardUrl,
            data: {
              cardName: row.cardName,
            },
          }).then((res) => {
            if (res.data.code === 200) {
              this.reloadPage();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
#player {
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
.player-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  flex: initial;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.player-info p {
  margin: 0;
  color: #8f8f8f;
  height: 3rem;
  line-height: 3rem;
}

.player-info .player-info-item {
  margin-left: auto;
  width: 16rem;
  display: flex;
  justify-content: space-around;
}

.player-info .el-button {
  margin: 0 10px;
  font-size: 0.9rem;
}

.player-main {
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
.player-main-mobile {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  flex: none;
  height: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.el-menu {
  flex: none;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
}

.player-main-content {
  box-sizing: border-box;
  padding: 1rem;
  flex: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.player-main-content /deep/ .el-collapse-item__header {
  color: #66b1ff;
  font-weight: bold;
}

.collapse-table-wrap {
  height: 50vh;
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
.player-main-content-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-top: 10px;
}

.player-main-content-addition {
  /* border: 1px solid #eeeeee;
  border-radius: 0.3rem; */

  flex: none;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: auto;

  min-height: 30px;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: nowrap;
}

.player-main-content-addition-item {
  min-width: 100px;
  width: 10rem;
  height: 3rem;
  margin-right: 0.6rem;
}
.player-main-content-addition-item.special {
  width: auto;
}
.player-main-content-table-wrap {
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
.el-dialog .fusion-wrap {
  display: flex;
  flex-direction: column;
  height: 5rem;
  justify-content: space-around;
}

.fusion-wrap .fusion-btn {
  margin: 0;
}

.el-dialog .el-select {
  width: 100%;
}

.table-preview-btn {
  font-size: 1.2rem;
  padding: 2px;
  border-radius: 5px;
  color: #66b1ff;
}

.table-expand-desc-box {
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.el-table /deep/ .record-hightlight-row {
  box-shadow: 0 0 20px inset #409eff55;
}

.player-main-content-addition-item.special .el-checkbox {
  margin-top: 4px;
}
.player-main-content-addition-item.special .el-checkbox /deep/ * {
  font-size: 12px;
}
</style>

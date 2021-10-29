<template>
  <div id="player" ref="player">
    <div class="player-global-button-group">
      <el-button circle size="mini" @click="scrollToTop" icon="el-icon-top" v-show="isScrolledOutScreen_FOR_MOBILE"></el-button>
      <el-button circle size="mini" @click="reloadPage" icon="el-icon-refresh-right"></el-button>
      <el-button circle size="mini" @click="fuseCard" icon="el-icon-plus"></el-button>
    </div>
    <div class="player-info">
      <p class="player-info-tips">欢迎来到诡异云，{{ username }}。</p>
      <div class="player-info-item">
        <p>硬币: {{ coin }}</p>
        <p>月见黑: {{ leftAward }}</p>
        <p>剩余尘数: {{ leftDust }}</p>
      </div>
    </div>
    <div class="player-main">
      <el-menu mode="horizontal" default-active="1" @select="handleSelect">
        <el-menu-item index="1">情报</el-menu-item>
        <el-menu-item index="2">检索</el-menu-item>
        <el-menu-item index="3">卡库</el-menu-item>
        <el-menu-item index="4">抽卡记录</el-menu-item>
        <el-menu-item index="5">修改记录</el-menu-item>
        <el-menu-item index="6">卡组</el-menu-item>
        <el-menu-item index="7">转盘</el-menu-item>
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
          >
          <template slot="title">
            {{item.packageName}}<span class="collapse-title-details" v-show="activeItemIndex !== index">{{item.detail}}</span>
          </template>
            <div class="collapse-table-wrap">
              <div class="collapse-table-desc" v-show="activeItemIndex === index">
                卡组内容：{{item.detail}}
              </div>
              <el-table
                :data="
                  packageListContent[index]
                    ? packageListContent[index]['data']
                    : []
                "
                size="mini"
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
      <div class="player-main-content" v-else-if="showTab === '2'">
        <div class="player-main-content-addition">
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
              :fetch-suggestions="querySearchCandidateCardList"
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
        <div class="player-main-content-table-wrap">
          <el-table :data="libTableData" size="mini">
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
      </div>
      <div class="player-main-content" v-else-if="showTab === '3'">
        <div class="player-main-content-addition">
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
              :fetch-suggestions="querySearchCandidateCardList"
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
        <div class="player-main-content-table-wrap">
          <el-table :data="playerLibTableData" size="mini">
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
      </div>
      <div class="player-main-content" v-else-if="showTab === '4'">
        <div class="player-main-content-addition">
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
          <div class="player-main-content-addition-item">
            <el-autocomplete
              size="mini"
              v-model="drawRecordQueryAddition.cardName"
              placeholder="请输入卡名"
              clearable
              :fetch-suggestions="querySearchCandidateCardList"
              @keyup.enter.native="drawRecordQuery"
            ></el-autocomplete>
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
        <div class="player-main-content-table-wrap">
          <el-table :data="drawRecordTableData" size="mini">
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
      </div>
      <div class="player-main-content" v-else-if="showTab === '5'">
        <div class="player-main-content-addition">
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
        <div class="player-main-content-table-wrap">
          <el-table
            :data="recordTableData"
            size="mini"
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
      </div>

      <!-- 卡组 -->
      <div class="player-main-content" v-else-if="showTab === '6'">
        <deck-generator
          :showCardDescHover="_showCardDescHover"
          :showCardDescClick="_showCardDescClick"
          :closeCardDesc="_closeCardDesc"
          :userList="userList"
        />
      </div>

      <!-- 转盘 -->
      <div class="player-main-content" v-else-if="showTab === '7'">
        <div class="wheel-wrap">
          <div class="half-content">
            <LuckyWheel
              ref="LuckyWheel"
              width="800px"
              height="800px"
              :style="{transform: 'scale(' + wheelScaleWidth +')'}"
              :blocks="[
                { padding: '10px', background: '#ffc27a' },
                { padding: '10px', background: '#ff4a4c' },
                { padding: '0px', background: '#fff' }
              ]"
              :prizes="roulettePrizes"
              :buttons="[
                { radius: '40px', background: '#d64737' },
                { radius: '35px', background: '#f6c66f', pointer: true },
                {
                  radius: '30px',
                  background: '#fff',
                  fonts: [{ text: `${this.roulette}\n${this.rollCount}/50`, top: '-50%' }]}
              ]"
              @start="startRoulette"
              @end="endRoulette"
            />
          </div>
          <div class="half-content">
            <div class="player-main-content-table-wrap">
              
              <div class="player-main-content-addition-item">
                <el-button type="primary" size="mini" @click="refreshRouletteHistory"
                  >查询</el-button
                >
              </div>
              <el-table
                :data="rouletteHistory"
                size="mini"
              >
                <el-table-column
                  :key="'roulette-history-column-' + 1"
                  prop="userName"
                  label="玩家"
                ></el-table-column>
                <el-table-column
                  :key="'roulette-history-column-' + 2"
                  prop="time"
                  label="转盘时间"
                ></el-table-column>
                <el-table-column
                  :key="'roulette-history-column-' + 3"
                  prop="detail"
                  label="奖品"
                ></el-table-column>
              </el-table>
              <div class="player-main-content-table-pagination">
                <el-pagination
                  small
                  background
                  layout="prev, pager, next"
                  :total="rouletteHistoryPagination.total"
                  :page-size="rouletteHistoryPagination.pageSize"
                  :current-page="rouletteHistoryPagination.page"
                  @current-change="refreshRouletteHistory"
                ></el-pagination>
              </div>
            </div>
          </div>
        </div>

      </div>
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
              :fetch-suggestions="querySearchCandidateCardList"
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

<script src="./index.js"></script>

<style scoped>
#player {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
}
.player-global-button-group {
  position: absolute;
  padding: 1rem;
  box-sizing: border-box;
  bottom: 3rem;
  right: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  justify-content: center;
}
.player-global-button-group .el-button {
  margin: 0;
}
.player-global-button-group .el-button + .el-button {
  margin-top: 0.4rem;
}
.player-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  flex: initial;
  padding: 0.6rem 1rem;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  margin-bottom: 1rem;
  flex-direction: column;

}

.player-info p {
  margin: 0;
  color: #8f8f8f;
  height: 1.5rem;
  line-height: 1.5rem;
}

.player-info .player-info-item {
  width: auto;
  display: inline-flex;
}
.player-info > p {
  display: inline-block;
}
.player-info p+p {
  margin-left: 1rem;
}

.player-info .el-button {
  align-self: flex-end;
  font-size: 0.9rem;
}

.player-main {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #bbbbbb 0 0 5px 0;
  width: 100%;
  flex: auto;
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.player-main .el-menu {
  flex: initial;
}

.player-main-content {
  box-sizing: border-box;
  padding: 1rem;
  flex: auto;
  display: flex;
  flex-direction: column;
}

.player-main-content /deep/ .el-collapse-item__header {
  color: #66b1ff;
  font-weight: bold;
}

.player-main-content /deep/ .el-collapse-item__arrow {
  margin-left: 10px;
}

.collapse-title-details {
  margin-left: auto;
  display: inline-block;
  font-weight: normal;
  width: 50%;
  height: 48px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.collapse-table-wrap {
  height: auto;
}

.collapse-table-desc {
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
.player-main-content-table-pagination {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  margin-top: 10px;
}

.player-main-content-addition {
  /* border: 1px solid #eeeeee;
  border-radius: 0.3rem; */
  min-height: 30px;
  padding: 0.5rem 0;
  display: flex;
  flex-wrap: wrap;
}

.wheel-wrap {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
.half-content {
  width: 50%;
  min-width: 400px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wheel-wrap .half-content > div {
  overflow: unset !important;
}

.player-main-content-addition-item {
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

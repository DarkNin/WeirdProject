<template>
  <div id="player">
    <div class="player-info">
      <p class="player-info-tips">欢迎来到诡异云，{{username}}。</p>
      <p class="player-info-dust">剩余尘数: {{leftDust}}</p>
      <el-button type="text">合成</el-button>
    </div>
    <div class="player-main">
      <el-menu mode="horizontal" default-active="1" @click="handleSelect">
        <el-menu-item index="1">情报</el-menu-item>
        <el-menu-item index="2">卡库</el-menu-item>
      </el-menu>
      <div class="player-main-content">
        <el-collapse v-model="activeItemIndex" @change="handleItemChange" accordion>
          <el-collapse-item
            v-for="(item, index) in cardPackageList"
            :key="index"
            :name="index"
            :title="item.packageName"
          >
            <div class="collapse-table-wrap">
              <el-table :data="packageListContent[index]" size="mini" height="50vh">
                <el-table-column prop="cardName" label="卡名"></el-table-column>
                <el-table-column prop="rare" label="稀有度">
                  <template slot-scope="scope">
                    <div class="collapse-table-tag" :class="getRareColor(scope.row.rare)">{{scope.row.rare}}</div>
                  </template>

                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosFetch } from "@/utils/fetch.js";
import { searchOwningCardUrl, queryCardPackageListUrl } from "@/config/url.js";
export default {
  name: "Player",
  data() {
    return {
      username: JSON.parse(window.localStorage.getItem("info")).u,
      leftDust: 0,
      pagination: {
        page: 1,
        pageSize: 20,
      },

      cardPackageList: [],
      packageListContent: {},
      activeItemIndex: "",

      tableColumns: [
        {
          label: "卡名",
          key: "cardName",
        },
        {
          label: "卡名",
          key: "cardName",
        },
        {
          label: "卡名",
          key: "cardName",
        },
      ],
    };
  },

  async mounted() {
    this.$openLoading();
    this.cardPackageList = await this.queryPackageList();

    this.$closeLoading();
  },

  methods: {
    handleSelect(index) {},

    queryPackageList() {
      return new Promise((resolve) => {
        axiosFetch({
          url: queryCardPackageListUrl,
        }).then((res) => {
          resolve(res.data.data);
        });
      });
    },

    queryCardList(_package, card, rare, target) {
      console.log(...arguments);
      return new Promise((resolve) => {
        axiosFetch({
          url: searchOwningCardUrl,
          data: {
            package: _package,
            card: card,
            rare: rare,
            target: target,
            page: this.pagination.page,
            pageSize: this.pagination.pageSize,
          },
        }).then((res) => {
          resolve(res.data.data.dataList);
        });
      });
    },

    async handleItemChange(itemIndex) {
      if (!!this.packageListContent[itemIndex] || itemIndex === "") {
        return;
      }
      this.$openLoading();
      let packageData = await this.queryCardList(
        this.cardPackageList[itemIndex]["packageName"]
      );
      this.$set(this.packageListContent, itemIndex, packageData);
      this.$closeLoading();
    },

    
    getRareColor(rare) {
      switch (rare) {
        case 'N':
          return 'color-normal';
        case 'R':
          return 'color-rare';
        case 'SR':
        case 'UR':
        case 'HR':
          return 'color-ultra-rare'
      }
    }
  },
};
</script>

<style scoped>
#player {
  width: 100%;
  height: 3rem;
  padding: 1rem;
  box-sizing: border-box;
  font-size: 0.9rem;
}
.player-info {
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

.player-info p {
  margin: 0;
  color: #8f8f8f;
  height: 3rem;
  line-height: 3rem;
}

.player-info .player-info-dust {
  margin-left: auto;
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
  height: 80vh;
  min-height: 500px;
  padding: 0 1rem;
  box-sizing: border-box;
}

.player-main-content {
  box-sizing: border-box;
  padding: 1rem;
  height: 70vh;
  overflow-y: scroll;
}

.player-main-content /deep/ .el-collapse-item__header {
  color: #66b1ff;
  font-weight: bold;
}

.collapse-table-wrap {
  height: 50vh;
}

.collapse-table-tag {
  display: inline-block;
  width: 2rem;
  height: 100%;
  text-align: center;
  border-radius: 0.3rem;
  border: 1px solid #eee;
  font-weight: bold;
}

.collapse-table-tag.color-normal {
  background-color: #75b2f3;
  color: #ffffff;
}
.collapse-table-tag.color-rare {
  background-color: #ffe3a7;
  color: #cccccc;
  
}
.collapse-table-tag.color-ultra-rare {
  background-color: #ffe3a7;
  color: #c5b314;
}
</style>
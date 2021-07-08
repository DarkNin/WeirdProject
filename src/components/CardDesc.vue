<template>
  <div id="card-desc">
    <transition name="el-fade-in">
      <div
        v-show="visible"
        class="card-desc-wrap"
        :style="
          isShowOnMobile
            ? {
                margin: '30vh auto',
                width: '100%',
              }
            : {
                'margin-left': posX - 600 + 'px',
                'margin-top': posY - 300 + 'px',
              }
        "
        @mouseenter="$emit('update:visible', true)"
        @mouseleave="$emit('update:visible', false)"
      >
        <div class="card-pic-box">
          <el-image v-if="picId !== 0" :src="'https://cdn01.moecube.com/images/ygopro-images-en-US/' + picId + '.jpg'">
            <div slot="placeholder">
              <el-image :src="require('../assets/unknown.jpg')" fit="contain">
              </el-image>
            </div>
          </el-image>
        </div>
        <div class="card-desc-box">
          {{ desc }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/base.css";
export default {
  name: "CardDesc",
  props: {
    visible: {
      type: Boolean,
    },
    picId: {
      type: Number,
    },
    posX: {
      type: Number,
    },
    posY: {
      type: Number,
    },
    isShowOnMobile: {
      type: Boolean,
    },
    desc: {
      type: String,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
#card-desc {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 5;
}
.card-desc-wrap {
  width: 600px;
  height: 300px;
  background: #333333aa;
  border-radius: 5px;
  display: flex;
  align-items: center;
  pointer-events: auto;
  box-shadow: #bbbbbb 0 0 5px 0;
}
.card-pic-box {
  width: 190px;
  height: 276px;
  margin: 0 10px;
}
.card-pic-box img {
  width: 190px;
  position: absolute;
}

.card-desc-box {
  width: 380px;
  height: 220px;
  margin: 0 10px 0 0;
  color: #ffffff;
  white-space: pre-wrap;
  overflow-y: auto;
}
</style>
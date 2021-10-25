<template>
  <div id="nav_tabs" :class="positionClass">
    <div class="nav-content">
      <slot></slot>
    </div>

  </div>
</template>

<script>
  export default {
    name: "NavTabs",
    props: {
      size: {
        type: String,
        default: 'normal',
        validator(val) {
          return ['normal', 'small', 'mini'].indexOf(val) !== -1
        }
      },
      position: {
        type: String,
        default: 'bottom',
        validator(val) {
          return ['top', 'bottom'].indexOf(val) !== -1
        }
      }

    },
    computed: {
      positionClass: function () {
        return 'tabs-position__' + this.position
      }
    }
  }
</script>

<style scoped>
  #nav_tabs {
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 100;
  }

  #nav_tabs.tabs__normal {
    height: 3rem;
  }

  #nav_tabs.tabs__small {
    height: 2.4rem;
  }

  #nav_tabs.tabs__mini {
    height: 1.8rem;
  }

  #nav_tabs.tabs-position__top {
    top: 0;
  }
  #nav_tabs.tabs-position__bottom {
    bottom: 0;
  }

  .nav-content {
    width: 100%;
    height: 100%;
    display: flex;
  }
</style>
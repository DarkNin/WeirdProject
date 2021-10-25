<template v-slot="counts">
  <div class="nav-block-wrap">
    <div class="nav-block">
      <div class="nav-block-icon">
        <slot></slot>
      </div>
      <div class="nav-block-label">{{label}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NavItem",
    props: {
      label: {
        type: String,
      },
    }
  }
</script>

<style scoped>
  .nav-block-wrap {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
  }
  .nav-block-icon {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
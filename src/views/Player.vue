<template>
  <div id="player">
    <div class="player-info"></div>
    <logout-btn />
  </div>
</template>

<script>
import LogoutBtn from "@/components/LogoutBtn.vue";
export default {
  name: "Player",
  name: "Admin",
  components: {
    LogoutBtn,
  },
  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped>
#player {
  width: 100%;
  height: 3rem;
  padding: 1rem;
  box-sizing: border-box;
}
.player-info {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: #8f8f8f 0 0 5px 0;
  width: 100%;
  height: 3rem;
}
</style>
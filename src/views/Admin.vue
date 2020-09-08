<template>
  <div id="admin">
    <logout-btn />
  </div>
</template>

<script>
import LogoutBtn from "@/components/LogoutBtn.vue";
export default {
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
</style>
<template>
  <footer class="ft">
    <customAudio :isVideo="false"></customAudio>
  </footer>
</template>

<script>
import customAudio from '../components/play/CustomAudio';
export default {
  components: {
    customAudio
  }
};
</script>

<style lang="scss" scoped>
.ft{
  height: 50px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: rgb(246, 246, 247);
  border-top: 1px solid rgb(225, 225, 226);
}
</style>

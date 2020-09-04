<template>
  <div>
    精品歌单
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data () {
    return {
      boutiquePlaylist: []
    };
  },
  mounted () {
    this.getBoutiquePlaylist();
  },
  methods: {
    async getBoutiquePlaylist (cat = '') {
      let before = '';
      if (this.boutiquePlaylist.length) {
        const arr = _.cloneDeep(this.boutiquePlaylist);
        before = arr.pop().updateTime;
      }
      const res = await this.$remoteInterface.getBoutiquePlaylist(before, cat);
      if (res.code === 200) {
        this.boutiquePlaylist.push(...res.playlists);
      }
      console.log(this.boutiquePlaylist);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>

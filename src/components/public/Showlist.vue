<template>
  <div class="showlist-wrapper">
    <ul class="list-wrap">
      <li class="list-item" v-for="(data, index) in listData" :key="index" @click="jump(data.id)">
        <div class="content">
          <div class="img-box">
            <img :src="data.coverImgUrl" alt="">
          </div>
        </div>
        <p>{{data.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listData: {
      required: true,
      type: Array,
      default: () => {}
    }
  },
  methods: {
    jump (id) {
      this.$router.push('/pldetail?id=' + id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Showlist.scss';
</style>

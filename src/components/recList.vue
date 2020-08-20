<template>
  <div class="list-wrapper">
    <div class="header">
      <h1>{{title}}</h1>
      <router-link :to="more">
        更多
        <Icon type="ios-arrow-forward" />
      </router-link>
    </div>
    <slot>
      <ul class="list">
        <Spin fix size="large" v-if="loading">
          <Icon type="ios-loading" size=18 class="load"></Icon>
          载入中...
        </Spin>
        <li class="item" v-for="(item, index) in data" :key="index" :style="{width: `${100 / rowCount - 1.3}%`}" @click="handleClick(item.id)">
          <template v-if="type==='songlist' || type==='mv'">
            <span class="copywriter">{{item.copywriter}}</span>
            <span class="count">
              <Icon :custom="item.playcount?'iconfont icon-erji': 'iconfont icon-shipin'" size="15"/>
              {{item.playcount?Math.trunc(item.playcount / 10000) + '万': item.playCount}}
            </span>
          </template>
          <div class="img-box">
            <Icon custom="iconfont icon-bofang" size="28" class="playBtn" v-if="type==='songlist'"/>
            <img v-lazy="item.picUrl" :alt="item.createTime">
          </div>
          <span>{{item.name}}</span>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
export default {
  props: ['title', 'data', 'rowCount', 'type', 'more', 'loading'],
  methods: {
    handleClick (id) {
      if (this.type === 'songlist') {
        this.$router.push('/pldetail?id=' + id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/components/recList.scss';
</style>

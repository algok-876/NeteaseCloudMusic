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
        <li class="item" v-for="(item, index) in data" :key="index" :style="{width: `${100 / rowCount - 1.3}%`}">
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
  props: ['title', 'data', 'rowCount', 'type', 'more', 'loading']
};
</script>

<style lang="scss" scoped>
.list-wrapper{
  .header{
    h1{
      font-weight: 300;
      font-size: 20px;
      color: #000;
    }
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 7px 0;
    border-bottom: 1px solid #e1e1e2;
    margin: 20px 0 10px 0;
  }
  .list{
    position: relative;
    min-height: 100px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
    .item{
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      &:hover{
        .copywriter{
          transform: translateY(0%);
        }
        .playBtn{
          opacity: 1;
        }
        .count{
          opacity: 0;
        }
      }
      .copywriter{
        width: calc(100% - 2px);
        position: absolute;
        box-sizing: border-box;
        z-index: 1;
        color: #fff;
        margin: 0 1px;
        left: 0;
        top: 0;
        padding: 7px 10px;
        background-color: rgba(0, 0, 0, .3);
        transition: all .4s;
        transition-delay: .7s;
        font-weight: 100;
        transform: translateY(-100%);
        text-align: justify;
        font-size: 13px;
      }
      .count{
        width: calc(100% - 1px);
        padding: 2px 8px;
        margin: 0;
        display: block;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        color: #fff;
        text-align: right;
        font-size: 12px;
        background:linear-gradient(to left,  rgba(0, 0, 0, .8), transparent 50%);
        transition: opacity .3s;
        transition-delay: .7s;
      }
      .playBtn{
        display: block;
        position: absolute;
        bottom: 10px;
        right: 10px;
        opacity: 0;
        transition: opacity .3s;
        color: #fff;
      }
      .img-box{
        font-size: 0;
        overflow: hidden;
        border: 1px solid #e1e1e2;
        position: relative;
        img{
          width: 100%;
        }
      }
      span{
        display: block;
        margin-top: 6px;
        font-size: 14px;
        color: #000;
        font-weight: 100;
        letter-spacing: 2px;
      }
    }
  }
}
</style>

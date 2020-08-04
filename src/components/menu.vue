<template>
  <div class="menu-wrapper">
    <p class="title">{{title}}</p>
    <ul class="menu">
      <li v-for="(item, index) in menulist" :key="index">
        <router-link :to="item.href">
          <Icon :custom="item.icon" size="20"/>
          {{item.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['title', 'menulist']
};
</script>

<style lang="scss" scoped>
  .menu-wrapper{
    overflow: hidden;
    .title{
      margin: 20px 8px 8px;
      color: #7d7d7d;
    }
    .menu{
      margin: 0;
      padding: 0;
      list-style-type: none;
      li{
        a{
          display: block;
          padding: 0 20px;
          color: #5c5c5c;
          line-height: 35px;
          box-sizing: border-box;
          &:hover{
            color: #000;
          }
          i{
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
  }
  .router-link-active{
    padding-left: 15px!important;
    color: #000!important;
    background-color: #e6e7ea;
    border-left: 5px solid #c62f2f;
  }
</style>

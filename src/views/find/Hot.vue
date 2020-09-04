<template>
  <div class="playlist-content">
    <!-- 歌单分类弹出框 -->
    <Poptip placement="bottom-start" width="580" height="350" v-model="catVisible">
      <div class="catBtn">
        <Spin size="large" v-if="catBtnLoading"><Icon type="ios-loading" size=18 class="load"></Icon></Spin>
        {{curCat === '全部'? '全部歌单':curCat}}
        <Icon type="ios-arrow-down" size="14"/>
      </div>
      <div class="tags" slot="content">
        <vue-scroll>
          <div class="wrapper">
            <div class="allCat"  @click="jumpCat('全部')">
              <div class="tagSelect" v-if="curCat==='全部'" >
                <Icon type="md-checkmark" size="15"/>
              </div>
              全部歌单
            </div>
            <div class="categories" v-for="(item, index) in catList" :key="index">
              <div class="category">
                <div>
                  <Icon :custom="icon[index].icon" :size="icon[index].size" style="color:#f1672e"/>
                  <span>{{item.cat}}</span>
                </div>
              </div>
              <div class="subcat">
                <span class="tag" v-for="(value, index) in item.sub" :key="index" @click="jumpCat(value.name)">
                  <div class="tagSelect" v-if="curCat === value.name">
                    <Icon type="md-checkmark" size="15"/>
                  </div>
                  <span class="hot-icon">
                    <Icon custom="iconfont icon-HOT-copy" size="20" v-if="value.hot"/>
                  </span>
                  {{value.name}}
                </span>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </Poptip>
    <!-- 热门歌单分类 -->
    <div class="hot-tags">
      <span class="hot">热门标签:</span>
      <Spin size="large" v-if="hotCatLoading">
        <Icon type="ios-loading" size=18 class="load"></Icon>
      </Spin>
      <ul>
        <li v-for="(tag, index) in hotCatList" :key="index" @click="jumpCat(tag.playlistTag.name)">{{tag.playlistTag.name}}</li>
      </ul>
    </div>
    <div class="playlists">
      <Spin fix size="large" v-if="catLoading">
        <Icon type="ios-loading" size=18 class="load"></Icon>
        载入中...
      </Spin>
      <ul class="list" v-if="!catLoading">
        <li class="playlistitem" v-if="currentPage===1" :style="{width: `${100 / 5 - 1.3}%`}" @click="$router.push('/find/playlist/boutique')">
          <div class="img-box">
            <img src="../../assets/img/jp.jpg" alt="">
          </div>
          <span>精品歌单轻型推荐，给懂音乐的你</span>
        </li>
        <li class="playlistitem" v-for="(item, index) in playList" :key="index" :style="{width: `${100 / 5 - 1.3}%`}" @click="$router.push('/pldetail?id=' + item.id)">
          <span class="count">
            <Icon custom="iconfont icon-erji" size="15"/>
            {{Math.trunc(item.playCount / 10000)}}万
          </span>
          <div class="img-box">
            <Icon custom="iconfont icon-bofang" size="28" class="playBtn"/>
            <img v-lazyload="item.coverImgUrl" :alt="item.createTime">
            <div class="create-box">
              <Icon type="ios-contact-outline" size="18"/>
              <span class="nickname">{{item.creator.nickname}}</span>
            </div>
          </div>
          <span>{{item.name}}</span>
        </li>
      </ul>
      <!-- 分页 -->
      <div class="page-wrapper">
        <Page :total="playListTotal" @on-change="pageJump" v-show="!catLoading" :current.sync="currentPage"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catList: [],
      hotCatList: [],
      // 歌单列表
      playList: [],
      // 歌单总数，用于分页
      playListTotal: 0,
      // 主分类的图标
      icon: [{ icon: 'iconfont icon-yuzhong', size: 28 },
        { icon: 'iconfont icon-fengge', size: 27 },
        { icon: 'iconfont icon-changjing', size: 31 },
        { icon: 'iconfont icon-smile', size: 32 },
        { icon: 'iconfont icon-zhuti', size: 34 }],
      // 当前歌单分类
      curCat: '全部',
      // 控制分类选择框的显示与隐藏
      catVisible: false,
      // 分类加载显示
      catLoading: false,
      // 控制热门标签加载
      hotCatLoading: false,
      catBtnLoading: false,
      currentPage: 1
    };
  },
  mounted () {
    this.getBaseData();
  },
  methods: {
    async getBaseData () {
      const cat = this.$remoteInterface.getCatList();
      const hotCat = this.$remoteInterface.getHotCat();
      const firstPlayList = this.$remoteInterface.getPlaylist(1, this.$route.query.cat, 99);
      this.catLoading = true;
      this.hotCatLoading = true;
      const res = await Promise.all([cat, hotCat, firstPlayList]);
      // 获得所有歌单标签和标签分类
      const subcat = res[0].sub;
      const categories = res[0].categories;
      // console.log(res[0].categories);
      // 获得热门歌单标签
      this.hotCatList = res[1].tags;
      // 获得第一页的歌单
      this.playList = res[2].playlists;
      this.curCat = res[2].cat;
      // 获得歌单总数
      this.playListTotal = res[2].total;
      // 将类别和属于这个类别的标签整合到一起
      for (const index in categories) {
        this.$set(this.catList, index, {
          cat: categories[index],
          sub: subcat.filter((item) => {
            // eslint-disable-next-line dot-notation
            return item['category'] === parseInt(index);
          })
        });
      }
      this.catLoading = false;
      this.hotCatLoading = false;
    },
    // 切换歌单分类
    async switchCat () {
      this.playList = [];
      this.catLoading = true;
      this.catBtnLoading = true;
      this.catVisible = false;
      const cat = this.$route.query.cat;
      const res = await this.$remoteInterface.getPlaylist(0, cat, 99);
      if (res.code === 200) {
        this.curCat = res.cat;
        this.playList = res.playlists;
        this.playListTotal = res.total;
      }
      this.currentPage = 1;
      this.catLoading = false;
      this.catBtnLoading = false;
    },
    pageJump (offset) {
      this.$router.push(`/find/playlist/hot?cat=${this.curCat}&p=${offset}`);
    },
    // 当前页发生改变
    async pageChange (offset) {
      offset -= 1;
      this.catLoading = true;
      const limit = offset === 0 ? 99 : 100;
      const res = await this.$remoteInterface.getPlaylist(offset, this.curCat, limit);
      if (res.code === 200) {
        this.playList = res.playlists;
      }
      this.catLoading = false;
    },
    jumpCat (cat) {
      this.$router.push(`/find/playlist/hot?cat=${cat}`);
    }
  },
  watch: {
    '$route.query.cat': function () {
      this.switchCat();
    },
    '$route.query.p': function () {
      this.pageChange(this.$route.query.p);
    }
  }
};
</script>

<style lang="scss" scoped>
.playlist-content{
  margin-top: 30px;
}
.catBtn{
  display: flex;
  padding: 3px 10px;
  align-items: center;
  border: 1px solid #e1e1e2;
  color: #666;
  border-radius: 5px;
  cursor: pointer;
  &:hover{
    background-color: #f5f5f7;
  }
}
.tags{
  width: 100%;
  height: 300px;
  .tagSelect{
    position: absolute;
    top: -1px;
    left: -1px;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    border: 1px solid #c62f2f;
    color: #ffffff;
    i{
      display: block;
      position: absolute;
      z-index: 1;
      right: -1px;
      bottom: -1px;
    }
    &::after{
      content: '';
      width: 0;
      height: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      border: 10px solid transparent;
      border-right-color: #c62f2f;
      border-bottom-color: #c62f2f;
    }
  }
  .wrapper{
    padding: 15px;
  }
  .allCat{
    position: relative;
    color: #666666;
    cursor: pointer;
    line-height: 35px;
    border: 1px solid #e1e1e2;
    text-align: center;
    &:hover{
      background-color: #f5f5f7;
      color: #000;
    }
  }
  .categories{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 25px 0;
    .category{
      width: 120px;
      div{
        display: flex;
        // justify-content: center;
        align-items: center;
        span{
          display: inline-block;
          margin-left: 25px;
          font-size: 16px;
          font-weight: 200;
        }
      }
    }
    .subcat{
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .tag{
        display: inline-block;
        position: relative;
        border-right: 1px solid #e1e1e2;
        border-bottom: 1px solid #e1e1e2;
        line-height: 35px;
        width: calc(100% / 5);
        text-align: center;
        color: #666666;
        cursor: pointer;
        &:hover{
          background-color: #f5f5f7;
          color: #000;
        }
        .hot-icon{
          i{
            display: block;
            position: absolute;
            color: #c62f2f;
            top: -3px;
            right: -14px;
          }
        }
        &:nth-child(5n + 1){
          border-left: 1px solid #e1e1e2;
        }
        &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4), &:nth-child(5) {
          border-top: 1px solid #e1e1e2;
        }
      }
    }
  }
}
/* 热门标签 */
.hot-tags{
  position: relative;
  display: flex;
  margin-top: 15px;
  .hot{
    color: #000;
  }
  ul{
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    li{
      font-size: 13px;
      padding: 0 15px;
      border-right: 1px solid #e1e1e2;
      height: 15px;
      line-height: 1.3;
      color: #666666;
      cursor: pointer;
      &:hover{
        color: #000000;
      }
      &:last-child{
        border: none;
      }
    }
  }
}
.playlists{
  margin-top: 15px;
  position: relative;
  min-height: 200px;
  .list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style-type: none;
    margin: 0;
    padding: 0;
    .playlistitem{
      margin-bottom: 30px;
      position: relative;
      overflow: hidden;
      &:hover{
        .playBtn{
          opacity: 1;
        }
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
        .create-box{
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0 10px;
          height: 25px;
          color: #fff;
          position: absolute;
          left: 0;
          bottom: 0;
          background:linear-gradient(to top,  rgba(0, 0, 0, .4), transparent 100%);
          .nickname{
            color: #fff;
            font-size: 13px;
            text-shadow: 0 0 0 1px #4b4b4b;
            margin: 0;
            position: relative;
            left: 10px;
          }
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
.page-wrapper{
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
</style>

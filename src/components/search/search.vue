<template>
  <div class="search-wrapper">
    <Poptip placement="bottom-start" :width="small ? 350 : 420" v-model="visible">
      <!-- 搜索部件 -->
      <div class="search-widget">
        <input type="text" class="search-input" placeholder="搜索音乐,视频,歌词,电台" @input="searchTip" @keyup.enter="enterSearch" @focus="focusSearch">
        <button class="search-btn">
          <i class="iconfont icon-sousuo"></i>
        </button>
      </div>
      <div class="auto-pop" slot="content">
        <div class="wrapper" :style="{height: small ? 'auto' : '400px'}">
          <vue-scroll>
            <div class="hot-search" v-if="searchSuggestList.length <= 0">
              <div class="search-records">
                <h1>搜索记录</h1>
                <ul class="records-list">
                  <li v-for="(tag, index) in recordList" :key="index">
                    {{tag}}
                    <Icon type="ios-close" size="18" @click="deleteTag(index)"/>
                  </li>
                </ul>
              </div>
              <div class="hot">
                <h1>热搜榜</h1>
                <ul class="hot-list">
                  <li class="hot-item" v-for="(item, index) in hotSearchList" :key="index">
                    <span class="order" :class="{hot: index <= 2}">
                      {{index + 1}}
                    </span>
                    <div class="content">
                      <p>
                        <span :class="{'give-word': index <= 2}">{{item.searchWord}}</span>
                        <span style="color: #ccc">{{item.score}}</span>
                      </p>
                      <p style="color: #999">{{item.content}}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="search-suggestions" v-else>
              <p class="search-href" v-special:#0C73C2='keyWords'>搜索 “{{keyWords}}” 相关的结果</p>
              <div class="group" v-for="(order, index) in searchSuggestList.order" :key='index'>
                <p class="mark">
                  <span style="display: inline-block;width: 20px;text-align:center;">
                    <Icon :custom="titleDir[order].icon" />
                  </span>{{titleDir[order].name}}
                </p>
                <ul class="list">
                  <li v-for="(item, index) in searchSuggestList[order]" :key="index" v-parse="{item, order}" v-special:#0C73C2='keyWords'>
                    {{item.name}}
                  </li>
                </ul>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyWords: '',
      // 弹出框的宽度
      poptipWidth: 420,
      hotSearchList: [],
      visible: false,
      debounceTimer: null,
      searchSuggestList: [],
      small: false,
      // 搜索结果标题映射中文
      titleDir: {
        playlists: {
          name: '歌单',
          icon: 'iconfont icon-yinfu_'
        },
        albums: {
          name: '专辑',
          icon: 'iconfont icon-zhuanji'
        },
        artists: {
          name: '歌手',
          icon: 'iconfont icon-yonghu1'
        },
        songs: {
          name: '歌曲',
          icon: 'iconfont icon-yinfu'
        }
      }
    };
  },
  methods: {
    // 按enter键搜索
    enterSearch () {
      // 添加搜索历史
      this.recordList.push(this.keyWords);
      localStorage.setItem('searchRecords', this.recordList.join(','));
    },
    // 搜索框获得焦点
    focusSearch () {
      if (this.hotSearchList.length === 0) {
        this.searchHot();
      }
    },
    // 获取搜索提示
    async searchTip (e) {
      this.keyWords = e.target.value;
      // 内容为空清除建议列表
      if (e.target.value.trim() === '') {
        this.small = false;
        this.searchSuggestList = [];
        return;
      }
      this.keyWords = e.target.value;
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(async () => {
        this.visible = true;
        const res = await this.$remoteInterface.searchSuggest(e.target.value);
        if (res.code === 200 && res.result.order) {
          this.small = true;
          this.searchSuggestList = res.result;
        }
      }, 1000);
    },
    async searchHot () {
      const res = await this.$remoteInterface.getSearchHotDetail();
      this.hotSearchList = res.data;
    },
    // 删除记录
    deleteTag (index) {
      this.recordList.splice(index, 1);
      localStorage.setItem('searchRecords', this.recordList.join(','));
      document.querySelector('.records-list').children[index].style.display = 'none';
    }
  },
  computed: {
    recordList () {
      let list = [];
      if (localStorage.getItem('searchRecords')) {
        list = localStorage.getItem('searchRecords').split(',');
      } else {
        list = [];
      }
      return list;
    }
  },
  directives: {
    // 突出搜索关键词
    special: {
      inserted (el, bind) {
        const reg = new RegExp(`(${bind.value})`, 'gi');
        el.innerHTML = el.innerHTML.replace(reg, `<span style="color: ${bind.arg}">$1</span>`);
      },
      update (el, bind) {
        const reg = new RegExp(`(${bind.value})`, 'gi');
        // 删除span标签，只剩下文字
        el.innerHTML = el.innerHTML.replace(/(<(span).+>(.+)<\/\2>)/gi, '$3');
        // 重新匹配文字并添加新的span标签
        el.innerHTML = el.innerHTML.replace(reg, `<span style="color: ${bind.arg}">$1</span>`);
      }
    },
    parse: {
      inserted (el, bind) {
        const attr = bind.value.order;
        const item = bind.value.item;
        let text = '';
        if (attr === 'albums') {
          text = item.name + ' - ' + item.artist.name;
          el.innerText = text;
        } else if (attr === 'songs') {
          let ars = '';
          item.artists.forEach(ar => {
            ars += ar.name + ' ';
          });
          el.innerText = item.name + ' - ' + ars;
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep .ivu-poptip-popper{
  transition: all .5s ease-in-out;
  top: 40px!important;
}
.search-wrapper{
  .search-widget{
    position: relative;
    .search-input{
      border: none;
      outline: none;
      background-color: #A82828;
      border-radius: 50px;
      width: 220px;
      height: 25px;
      color: #fff;
      padding: .5em 1em;
      padding-right: 30px;
      &::placeholder{
        color: #C77373;
      }
    }
    .search-btn{
      border: none;
      outline: none;
      background-color: transparent;
      position: absolute;
      right: .5em;
      cursor: pointer;
      color: #C77373;
      &:hover{
        color: #fff;
      }
    }
  }
  .auto-pop{
    background-color: #fafafa;
    .hot-search{
      padding-right: 10px;
      h1{
        font-weight: 100;
        font-size: 18px;
        padding-right: 10px;
        padding: 15px;
      }
      .records-list{
        list-style-type: none;
        padding-left: 15px;
        display: flex;
        flex-wrap: wrap;
        li{
          border-radius: 50px;
          border: 1px solid #D9D9D9;
          font-size: 14px;
          padding: 3px 1em;
          margin-right: 15px;
          cursor: pointer;
          margin-bottom: 10px;
          position: relative;
          i{
            display: none;
            position: absolute;
            right: 0px;
            top: 50%;
            transform: translateY(-50%);
          }
          &:hover{
            background-color: #eeeeee;
            i{
              display: inline-block;
            }
          }
        }
      }
      .hot-list{
        margin: 0;
        padding: 0;
        list-style-type: none;
        .hot-item{
          &:hover{
            background-color: #eee;
          }
          display: flex;
          align-items: center;
          padding: 8px 15px 15px;
          padding-left: 15px;
          .order{
            width: 35px;
            font-size: 18px;
            color: #ccc;
            &.hot{
              color: #802e2e;
            }
          }
          .content{
            span{
              display: inline-block;
              margin-right: 15px;
            }
            .give-word{
              font-weight: 600;
              color: #000;
            }
          }
        }
      }
    }
    .search-suggestions{
      cursor: pointer;
      .search-href{
        line-height: 30px;
        padding-left: 20px;
        color: #666;
        &:hover{
          color: #000;
        }
        &::after{
          content: " >";
        }
      }
      .mark{
        line-height: 30px;
        background-color: #F5F5F7;
      }
      .list{
        list-style: none;
        padding: 0;
        margin: 0;
        color: #333;
        li{
          line-height: 30px;
          padding: 0 20px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &:hover{
            background-color: #EDEDED;
          }
        }
      }
    }
  }
}
</style>

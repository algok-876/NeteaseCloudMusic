<template>
  <div class="comment-wrapper">
    <template v-if="comments.total">
      <Spin size="large" v-if="loading">
        <Icon type="ios-loading" size="18" class="load"></Icon>载入中...
      </Spin>
      <div class="comment-list" v-for="(type, index) in commentType" :key="index" v-show="!loading">
        <div class="title">
          <p>{{type.name}}评论</p>
        </div>
        <ul class="list">
          <li class="item" v-for="item in type.comments" :key="item.commentId">
            <div class="avatar">
              <Avatar :src="item.user.avatarUrl" size="37" />
            </div>
            <div class="info">
              <div class="comment">
                <span class="nickname">{{item.user.nickname}}</span>
                <span class="content">{{item.content}}</span>
              </div>
              <div class="reple" v-if="item.beReplied.length">
                <span class="reple-nickname">{{item.beReplied[0].user.nickname}}</span>
                <span class="reple-content">{{item.beReplied[0].content}}</span>
              </div>
              <div class="data">
                <div class="time">{{item.time | commentDateFormat}}</div>
                <div class="rep">
                  <span class="jubao">举报</span>
                  <span>
                    <Icon custom="iconfont icon-zan" />
                    <template v-if="type.name==='精彩'">({{item.likedCount}})</template>
                  </span>
                  <span>分享</span>
                  <span>回复</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 分页 -->
      <div class="page-wrapper" v-show="!loading">
        <Page :total="comments.total" @on-change="pageChange" :page-size="40" size="small" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      required: true,
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    pageChange (newpage) {
      this.$emit('page-change', newpage - 1);
    }
  },
  computed: {
    commentType () {
      if (this.comments.hotComments) {
        return [
          { name: '精彩', comments: this.comments.hotComments },
          { name: '最新', comments: this.comments.comments }
        ];
      } else {
        return [{ name: '最新', comments: this.comments.comments }];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.comment-wrapper {
  min-height: 400px;
  position: relative;
}
.comment-list {
  padding: 10px 25px;
  padding-top: 35px;
  .title {
    border-bottom: 1px solid #e1e1e2;
  }
  .list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    .item {
      padding: 20px 0;
      border-bottom: 1px solid #e1e1e2;
      display: flex;
      &:hover {
        .data .rep .jubao {
          display: inline-block;
        }
      }
      .info {
        margin-left: 15px;
        font-size: 13px;
        flex: 1;
        .nickname,
        .reple-nickname {
          display: inline-block;
          margin-right: 10px;
          color: rgb(12, 115, 194);
          &::after {
            content: "：";
          }
        }
        .reple {
          padding: 8px 5px;
          margin-top: 10px;
          background-color: rgb(241, 241, 244);
          .reple-nickname::before {
            content: "@";
          }
        }
      }
      .data {
        margin-top: 10px;
        display: flex;
        color: rgb(153, 153, 153);
        justify-content: space-between;
        .rep {
          .jubao {
            display: none;
          }
          span {
            cursor: pointer;
            display: inline-block;
            padding: 0 12px;
            border-right: 1px solid #e1e1e2;
            &:last-child {
              border: 0;
            }
            &:hover {
              color: rgb(136, 136, 136);
            }
          }
        }
      }
    }
  }
}
</style>

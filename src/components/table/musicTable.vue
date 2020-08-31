<template>
  <div class="table-wrap">
    <table class="music-table" cellspacing="0" ref="table">
    <thead>
      <tr v-if="theadItem[1].label">
        <td v-for="(item, index) in theadItem" :key="index">{{item.label}}</td>
      </tr>
    </thead>
    <tbody @dblclick="handleDblclick">
      <tr v-for="(row, index) in tbodyData" :key="index" :data-i="index" @click="activeTr = index" :class="{active: activeTr === index}">
        <td v-for="(field, fieldorder) in tableField" :key="fieldorder" :data-i="index">
          <slot :name="field" v-bind:rowData="row">
            {{row[field]}}
          </slot>
        </td>
      </tr>
    </tbody>
      <div class="line-wrap" v-if="line">
        <div class="col-line" ref="colline"></div>
      </div>
    </table>
    <div class="msk" v-if="line"></div>
  </div>
</template>

<script>
export default {
  props: {
    theadItem: {
      type: Array,
      required: true,
      default: () => []
    },
    tbodyData: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      activeTr: '',
      line: false
    };
  },
  mounted () {
    console.dir(this.$refs.table.children[0]);
    // 第一行的列td
    console.dir(this.$refs.table.rows[0].cells);
    console.dir(this.$refs.table);
    this.dropTabletTd(this.$refs.table);
  },
  methods: {
    handleDblclick (e) {
      const index = Number(e.target.getAttribute('data-i') || e.target.parentElement.getAttribute('data-i'));
      this.$emit('on-dblclickSong', index);
    },
    droping (e, _this) {
      this.line = true;
    },
    dropTabletTd (ref) {
      var
        i;
      var self;
      var table = ref;
      var header = table.rows[0];
      // var tableX = header.clientWidth;
      var length = header.cells.length;

      for (i = 0; i < length; i++) {
        header.cells[i].onmousedown = function () {
          self = this;
          if (event.offsetX > self.offsetWidth - 10) {
            self.mouseDown = true;
            self.oldX = event.x;
            self.oldWidth = self.offsetWidth;
          }
        };
        header.cells[i].onmousemove = function () {
          if (event.offsetX > this.offsetWidth - 10) {
            this.style.cursor = 'col-resize';
          } else {
            this.style.cursor = 'default';
          }
          if (self === undefined) {
            self = this;
          }
          if (self.mouseDown != null && self.mouseDown === true) {
            self.style.cursor = 'default';
            if (self.oldWidth + (event.x - self.oldX) > 0) {
              self.width = self.oldWidth + (event.x - self.oldX);
            }
            self.style.width = self.width;
            // table.style.width = tableX + (event.x - self.oldX) + 'px';
            self.style.cursor = 'col-resize';
          }
        };
        table.onmouseup = function () {
          if (self === undefined) {
            self = this;
          }
          self.mouseDown = false;
          self.style.cursor = 'default';
          // tableX = header.clientWidth;
        };
      }
    }
  },
  computed: {
    tableField () {
      const field = [];
      this.theadItem.forEach(value => {
        field.push(value.field);
      });
      return field;
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/sass/components/musicTable.scss';
</style>

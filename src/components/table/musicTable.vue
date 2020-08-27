<template>
  <table class="music-table" cellspacing="0">
    <thead>
      <tr v-if="theadItem[1].label">
        <td v-for="(item, index) in theadItem" :key="index">{{item.label}}</td>
      </tr>
    </thead>
    <tbody @dblclick="handleDblclick">
      <tr v-for="(row, index) in tbodyData" :key="index" :data-i="index">
        <td v-for="(field, fieldorder) in tableField" :key="fieldorder" :data-i="index">
          <slot :name="field" v-bind:rowData="row">
            {{row[field]}}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
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
  methods: {
    handleDblclick (e) {
      const index = Number(e.target.getAttribute('data-i') || e.target.parentElement.getAttribute('data-i'));
      this.$emit('on-dblclickSong', index);
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

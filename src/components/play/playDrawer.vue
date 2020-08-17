<template>
  <Drawer
    title="Basic Drawer"
    :closable="true"
    v-model="visible"
    @on-close="$emit('on-close')"
    width="550"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </Drawer>
</template>

<script>
export default {
  props: ['visible']
};
</script>

<style>

</style>

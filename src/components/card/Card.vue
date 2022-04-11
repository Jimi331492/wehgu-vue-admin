<!--
 * @Author: 龙际妙
 * @Date: 2022-04-09 22:17:43
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\components\card\Card.vue
 * @LastEditTime: 2022-04-09 22:23:53
 * @LastEditors: Please set LastEditors
-->

<template>
  <div class="mm-card" :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
    <div class="mm-card__header" v-if="$slots.header || header">
      <slot name="header">{{ header }}</slot>
    </div>
    <div class="mm-card__body" :style="bodyStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mm-card',
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String,
    },
  },
}
</script>

<style scoped lang="less"></style>

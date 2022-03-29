<!--
 * @Author: 龙际妙
 * @Date: 2022-03-17 16:10:30
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\components\form\Form.vue
 * @LastEditTime: 2022-03-17 16:40:59
 * @LastEditors: Please set LastEditors
-->

<template>
  <el-form class="dynamic-form" :model="value" :label-width="formConfig['label-width']" :size="formConfig.size" :label-position="formConfig['label-position']">
    <form-item
      v-for="item in formItemConfigList"
      :key="childId + item.key"
      :itemConfig="item"
      @myinput="handleInput"
      @myselect="handleSelect"
      @myradio="handleRadio"
      @deleteItem="handleDelteItem"
      @addItem="handleAddItem"
    >
    </form-item>
  </el-form>
</template>

<script>
import Item from './Item.vue'
export default {
  name: 'DynamicForm',
  components: {
    'form-item': Item,
  },
  props: {
    formConfig: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      require: false,
    },
  },
  data(props) {
    console.log('props', props)
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="less"></style>

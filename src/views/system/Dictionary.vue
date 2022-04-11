<!--
 * @Author: 龙际妙
 * @Date: 2022-04-10 06:57:57
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\system\Dictionary.vue
 * @LastEditTime: 2022-04-11 08:29:17
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>字典管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-autocomplete
            v-model="query.key"
            :fetch-suggestions="querySearchAsync"
            clearable
            @clear="queryPage"
            class="inline-input"
            placeholder="请输入键名"
            @select="queryPage"
            size="small"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage" size="small"></el-button>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" size="small" @click="showAddDialog">添加</el-button>
        </el-col>
        <el-col :span="13" style="display: flex; justify-content: flex-end; align-self: flex-end">
          <el-button type="danger" @click="confirmBatchDeleteBox" :disabled="this.deleteId === null || this.deleteId.length < 1" size="small"
            >批量删除</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="list" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="key" label="键名"></el-table-column>
        <el-table-column prop="value" label="值"></el-table-column>
        <el-table-column prop="remark" label="说明"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :currentPage="query.page"
        :page-size="query.limit"
        :page-sizes="[5, 10, 20, 40]"
        :disabled="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 弹窗 -->
    <el-dialog :title="titles" v-model="dialogVisible" width="50%" @close="dialogClosed">
      <!-- 内容主体 -->
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="键名" prop="key">
          <el-autocomplete
            v-model="form.key"
            :fetch-suggestions="querySearchAsync"
            clearable
            class="inline-input"
            placeholder="请输入键名"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item label="值" prop="valueList" v-show="titles === '新增'">
          <el-select v-model="form.valueList" multiple filterable allow-create default-first-option :reserve-keyword="false" placeholder="请输入值">
            <el-option v-for="item in filterList" :key="item.id" :label="item.value" :value="item.value" disabled />
          </el-select>
        </el-form-item>

        <el-form-item label="值" prop="value" v-show="titles === '编辑'">
          <el-input v-model="form.value" placeholder="请输入值" />
        </el-form-item>

        <el-form-item label="说明" prop="remark">
          <el-input style="width: 300px" type="textarea" v-model="form.remark" placeholder="请输入说明" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { queryDictionary, saveDictionary, deleteDictionary } from '../../api/system'
export default {
  data() {
    return {
      query: { key: '', limit: 10, page: 1 },
      list: [],
      allList: [],
      total: 0,
      titles: '',
      dialogVisible: false,
      form: {
        id: null,
        key: null,
        valueList: [],
        value: null,
        remark: null,
      },
      deleteId: [],
    }
  },
  created() {
    this.queryPage()
    this.getAllKey()
  },
  computed: {
    filterList() {
      if (this.list === null || this.list.length < 1) return []
      if (this.form.key === null) return []

      const filter = this.list.filter((item) => {
        return item.key === this.form.key
      })

      return filter
    },
  },
  mounted() {},
  methods: {
    async queryPage() {
      // 分页查询
      const { data: res } = await queryDictionary(this.query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.list = res.data.records
      this.total = res.data.total
    },
    async getAllKey() {
      const query = {
        limit: '',
        page: '',
      }
      // 分页查询
      const { data: res } = await queryDictionary(query)
      if (res.code !== 200) this.$message.error(res.message)
      this.allList = res.data.records
    },
    handleSizeChange(e) {
      // 分页控件
      this.query.limit = e
      this.queryPage()
    },
    handleCurrentChange(e) {
      this.query.page = e
      this.queryPage()
    },
    //增改
    showAddDialog() {
      this.titles = '新增'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '编辑'
      this.$nextTick(() => {
        this.form = { ...row }
      })
      this.dialogVisible = true
    },
    //表单
    querySearchAsync(queryString, cb) {
      console.log('queryString', queryString)

      let keyList = this.allList.map((item) => {
        item.value = item.key
        return JSON.stringify({ key: item.key, value: item.value })
      })

      keyList = Array.from(new Set([...keyList]))
      console.log('kye', keyList)
      keyList = keyList.map((item) => {
        return JSON.parse(item)
      })
      let result = keyList.filter((item) => {
        if (item.key.indexOf(queryString) > -1) {
          console.log(1)
          return true
        }
      })

      cb(result)
    },

    handleSelect(e) {
      console.log('e', e)
    },
    // 弹窗关闭重置
    dialogClosed() {
      this.$refs['formRef'].resetFields()
    },
    async save() {
      console.log('thisform', this.form)
      const { data: res } = await saveDictionary(this.form)
      if (res.code !== 200) this.message.error(res.message)
      this.queryPage()
      this.dialogVisible = false
    },
    //删除
    async confirmDeleteBox(id) {
      // 弹窗提示用户是否要删除
      const Result = await this.$confirm('此操作将永久删除该数据!!!是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await deleteDictionary([id])
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPage()
      this.$message.success('删除成功！')
    },
    //批量选择
    handleSelectionChange(e) {
      console.log('e', e)
      this.deleteId = e.map((item) => {
        return item.id
      })
    },

    //批量选择删除
    async confirmBatchDeleteBox() {
      // 弹窗提示用户是否要删除
      const Result = await this.$confirm('此操作将永久删除所选中数据!!!是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await deleteDictionary(this.deleteId)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPage()
      this.$message.success('删除成功！')
    },
  },
  //
}
</script>
<style scoped lang="less"></style>

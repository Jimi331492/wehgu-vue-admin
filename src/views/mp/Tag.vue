<!--
 * @Author: 龙际妙
 * @Date: 2022-04-07 18:51:22
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\mp\Tag.vue
 * @LastEditTime: 2022-04-07 22:02:06
 * @LastEditors: Please set LastEditors
-->

<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>标签管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入标题" v-model="query.title" clearable @clear="queryPage">
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="标签名称"></el-table-column>
        <el-table-column prop="color" label="字体颜色"></el-table-column>
        <el-table-column prop="backgroundColor" label="背景颜色"></el-table-column>
        <el-table-column prop="remark" label="说明"></el-table-column>
        <el-table-column prop="postNum" label="帖子数量"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.tagUuid)"></el-button>
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
        <el-form-item label="标签名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="字体颜色" prop="color">
          <el-input v-model="form.color" placeholder="请输入字体颜色" />
        </el-form-item>
        <el-form-item label="背景颜色" prop="backgroundColor">
          <el-input v-model="form.backgroundColor" placeholder="请输入背景颜色" />
        </el-form-item>
        <el-form-item label="标签说明" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入说明" />
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
import { queryTag, saveTag, deleteTag } from '../../api/mp'
export default {
  data() {
    return {
      query: { title: '', limit: 5, page: 1 },
      list: [],
      total: 0,
      titles: '',
      dialogVisible: false,
      form: {
        title: '',
        color: null,
        backgroundColor: null,
        remark: null,
      },
    }
  },
  created() {
    this.queryPage()
  },
  mounted() {},
  methods: {
    async queryPage() {
      // 分页查询
      const { data: res } = await queryTag(this.query)
      if (res.code !== 200) this.message.error(res.message)
      console.log('res', res)
      this.list = res.data.records
      this.total = res.data.total
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
      this.titles = '新增标签'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '编辑标签'
      this.$nextTick(() => {
        this.form = { ...row }
      })
      this.dialogVisible = true
    },
    // 弹窗关闭重置
    dialogClosed() {
      this.$refs['formRef'].resetFields()
    },
    async save() {
      const { data: res } = await saveTag(this.form)
      if (res.code !== 200) this.message.error(res.message)
      this.queryPage()
      this.dialogVisible = false
    },
    //删除
    async confirmDeleteBox(UID) {
      // 弹窗提示用户是否要删除
      const Result = await this.$confirm('此操作将永久删除该数据!!!是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await deleteTag(UID)
      if (res.code !== 200) return this.$message.error(res.message)

      this.queryPage()
      this.$message.success('删除成功！')
    },
  },
}
</script>
<style scoped lang="less"></style>

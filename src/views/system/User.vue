<!--
 * @Author: 龙际妙
 * @Date: 2021-10-24 22:51:08
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\system\User.vue
 * @LastEditTime: 2022-03-19 03:15:48
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户名" v-model="query.name" clearable @clear="queryCustomerPage">
            <template #append>
              <el-button icon="el-icon-search" @click="queryCustomerPage"></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 微信用户列表区域 -->
      <el-table :data="customerList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="telephone" label="电话"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" @change="lockCustomer(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="已绑定微信">
          <template v-slot="scope">
            <el-tag v-if="scope.row.unionId !== null" type="success">已绑定</el-tag>
            <el-tag v-else type="info">未绑定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已实名认证">
          <template v-slot="scope">
            <el-tag v-if="scope.row.userUuid !== null" type="success">已认证</el-tag>
            <el-tag v-else type="danger">未认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色"
          ><template v-slot="scope">
            <el-tag closable @close="removeRoleById()">{{ scope.row.roleName }}</el-tag>
          </template></el-table-column
        >

        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑用户" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.userDetailUuid)"></el-button>
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

    <!-- 这是添加用户的对话框 -->
    <el-dialog :title="titles" @open="dialogOpen" v-model="dialogVisible" width="50%" @close="dialogClosed">
      <!-- 内容主体 -->
      <el-form ref="formRef" :model="form" label-width="70px">
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="选择角色" prop="roleUuid">
          <el-select v-model="form.roleUuid" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.roleUuid" :label="item.roleName" :value="item.roleUuid" />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCustomer">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { queryCustomer, saveCustomer, deleteCustomer } from '../../api/user'
import { queryRole } from '../../api/role'
export default {
  data() {
    return {
      query: { limit: 5, page: 1, nickname: '' },
      total: 0,
      customerList: [],
      roleList: [],
      dialogVisible: false,
      titles: '',
      form: {
        nickname: '',
        avatar: '',
        roleUuid: '',
      },
    }
  },
  created() {
    this.queryCustomerPage()
  },
  mounted() {},
  methods: {
    //查
    async queryCustomerPage() {
      const { data: res } = await queryCustomer(this.query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.customerList = res.data.records
      this.total = res.data.total
    },
    async queryRoleAll() {
      const { data: res } = await queryRole({ limit: '', page: '' })
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.roleList = res.data.records
    },
    handleSizeChange(e) {
      this.query.limit = e
      this.queryCustomerPage()
    },
    handleCurrentChange(e) {
      this.query.page = e
      this.queryCustomerPage()
    },

    //增改
    showAddDialog() {
      this.titles = '新增用户'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '编辑用户'
      console.log('row', row)
      this.$nextTick(() => {
        this.form = { ...row }
      })

      this.dialogVisible = true
    },
    dialogOpen() {
      this.queryRoleAll()
    },
    async saveCustomer() {
      const { data: res } = await saveCustomer(this.form)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.queryCustomerPage()
      this.dialogVisible = false
    },
    dialogClosed() {
      this.$refs['formRef'].resetFields()
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

      const { data: res } = await deleteCustomer(UID)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryCustomerPage()
      this.$message.success('删除成功！')
    },
  },
}
</script>

<style scoped lang="less"></style>

<style lang="less" scoped></style>

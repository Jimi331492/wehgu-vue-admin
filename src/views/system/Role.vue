<!--
 * @Author: 龙际妙
 * @Date: 2021-10-24 22:51:19
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\system\Role.vue
 * @LastEditTime: 2022-03-26 21:24:55
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入角色名" v-model="query.roleName" clearable @clear="queryRolePage">
            <template #append>
              <el-button icon="el-icon-search" @click="queryRolePage"></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 微信用户列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>

        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.roleUuid)"></el-button>
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

    <!-- 添加角色的弹窗 -->
    <el-dialog :title="titles" v-model="dialogVisible" width="50%" @close="dialogClosed">
      <!-- 内容主体 -->
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="隐藏" prop="roleUuid" v-show="false">
          <el-input v-model="form.roleUuid" placeholder="roleUuid" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色备注" prop="description">
          <el-input v-model="form.description" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { queryRole, saveRole, deleteRole } from '../../api/role'
export default {
  data() {
    return {
      query: { limit: 5, page: 1, roleName: '' },
      roleList: [],
      total: 0,
      titles: '',
      dialogVisible: false,
      form: {
        roleUuid: '',
        roleName: '',
        description: '',
      },
    }
  },
  created() {
    this.queryRolePage()
  },
  mounted() {},
  methods: {
    // 角色分页查询
    async queryRolePage() {
      const { data: res } = await queryRole(this.query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.roleList = res.data.records
      this.total = res.data.total
    },
    // 分页控件
    handleSizeChange(e) {
      this.query.limit = e
      this.queryRolePage()
    },
    handleCurrentChange(e) {
      this.query.page = e
      this.queryRolePage()
    },
    //增改
    showAddDialog() {
      this.titles = '新增角色'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '新增角色'
      console.log('row', row)
      this.$nextTick(() => {
        this.form = { ...row }
      })

      this.dialogVisible = true
    },
    // 弹窗关闭重置
    dialogClosed() {
      this.$refs['formRef'].resetFields()
    },
    async saveRole() {
      const { data: res } = await saveRole(this.form)
      if (res.code !== 200) this.$message.error(res.message)

      this.queryRolePage()
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

      const { data: res } = await deleteRole(UID)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryRolePage()
      this.$message.success('删除成功！')
    },
  },
}
</script>

<style lang="less" scoped>
.el-dialog {
  .el-input {
    width: 300px;
  }
}

.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-top: 1px solid #eee;
}
</style>
>

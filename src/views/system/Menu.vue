<!--
 * @Author: 龙际妙
 * @Date: 2021-10-24 22:51:29
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\system\Menu.vue
 * @LastEditTime: 2022-03-19 03:50:05
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入权限名" v-model="query.title" size="mini" clearable @clear="queryPermPage">
            <template #prepend>
              <el-select
                v-model="roleUID"
                placeholder="选择角色"
                size="small"
                clearable
                @change="getRolePermsTreeByUID"
                @clear="queryPermPage"
                style="width: 110px"
              >
                <el-option v-for="item in roleList" :key="item.roleUuid" :label="item.roleName" :value="item.roleUuid" />
              </el-select>
            </template>
            <template #append>
              <el-button icon="el-icon-search" @click="queryPermPage"></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="2">
          <el-button type="primary" @click="showAddDialog" size="mini">新增权限</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" @click="showAuthDialog" size="mini">批量授权</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="permList" border stripe default-expand-all row-key="permId" :tree-props="{ children: 'children' }" :indent="8">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="权限名称" sortable></el-table-column>
        <el-table-column prop="url" label="路径"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template v-slot="scope">
            <el-tag v-if="scope.row.parentId === 0">一级菜单</el-tag>
            <el-tag type="danger" v-else-if="scope.row.type === 1">按钮</el-tag>
            <el-tag type="success" v-else>二级菜单</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="权限标识" prop="parms">
          <template v-slot="scope">
            <div v-if="scope.row.auth">{{ scope.row.auth }}</div>
          </template>
        </el-table-column>

        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.parentId === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="danger" v-else-if="scope.row.type === 1">三级</el-tag>
            <el-tag type="success" v-else>二级</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.permUuid)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- <el-pagination
        :currentPage="query.page"
        :page-size="query.limit"
        :page-sizes="[5, 10, 20, 40]"
        :disabled="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="permTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      /> -->
    </el-card>

    <!-- 弹窗区域   新增或修改权限表单区域 -->
    <el-dialog :title="titles" v-model="dialogVisible" @close="dialogClosed" width="60%">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="5rem">
        <!-- 权限类型 -->
        <el-form-item label="权限类型:" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="0">菜单</el-radio>
            <el-radio label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单父级权限 -->
        <el-form-item label="父级菜单:" prop="parentId" v-show="form.type === '0'">
          <el-cascader v-model="form.parentId" :options="permList" :props="menuProps" @change="handleChange" />
        </el-form-item>

        <!-- 按钮父级权限 -->
        <el-form-item label="父级菜单:" prop="parentId" v-show="form.type === '1'">
          <el-cascader
            v-model="form.parentId"
            :options="permList"
            :props="btnProps"
            placeholder="请选择父级权限"
            show-all-levels
            @change="parentChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- 权限名 -->
        <el-form-item label="权限名称:" prop="title">
          <el-input v-model="form.title" placeholder="请输入权限名称" />
        </el-form-item>
        <!-- 权限标识 -->
        <el-form-item label="权限标识" prop="auth">
          <el-input v-model="form.auth" placeholder="请输入权限标识" />
        </el-form-item>
        <!-- 权限URI -->
        <el-form-item label="权限URI" prop="url">
          <el-input v-model="form.url" placeholder="请输入权限URI" />
        </el-form-item>

        <!-- 菜单图标 -->
        <el-form-item label="菜单图标:" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择菜单图标">
            <el-option v-for="(item, index) in iconList" :key="index" :label="item" :value="item">
              <span style="float: left">
                {{ item }}
              </span>
              <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
                <i :class="item"></i>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePerm()">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 授权弹窗 -->
    <!-- 弹窗区域   新增或修改权限表单区域 -->
    <el-dialog v-model="permDialogVisible" @close="permDialogClosed" width="60%">
      <!-- 内容主体 -->
      <el-tree
        :data="completePermTree"
        :props="treeProps"
        show-checkbox
        node-key="permId"
        default-expand-all
        :default-checked-keys="defKeys"
        check-strictly
        ref="treeRef"
      />
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="authorizeRole">确 定</el-button>
        </span>
      </template>
      <template #title>
        <el-row>
          <el-col :span="2">正在为</el-col>
          <el-col :span="9">
            <el-select v-model="authorizeForm.roleUID" placeholder="选择角色" size="small" clearable @change="computeDefKey" style="margin-bottom: 50px">
              <el-option v-for="item in roleList" :key="item.roleUuid" :label="item.roleName" :value="item.roleUuid" />
            </el-select>
          </el-col>
          <el-col :span="8">批量授权</el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { queryPermTree, savePerm, deletePerm, authorize } from '../../api/perm'
import { queryRole, getPermsTree, getRoleDefKeys } from '../../api/role'

export default {
  data() {
    return {
      roleUID: '',
      //权限列表
      query: { limit: '', page: '', title: '' },
      permTotal: 0,
      permList: [],
      //角色列表
      roleList: [],
      completePermTree: [],
      roleTotal: 0,
      dialogVisible: false,
      permDialogVisible: false,
      titles: '',
      menuProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'permId',
        children: 'children',
        label: 'title',
        emitPath: false,
      },
      btnProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'permId',
        children: 'children',
        label: 'title',
        emitPath: false,
      },
      iconList: ['el-icon-user', 'el-icon-platform-eleme', 'el-icon-s-tools', 'el-icon-delete', 'el-icon-menu'],
      form: {
        title: '',
        auth: '',
        url: '',
        parentId: null,
        type: null,
      },
      authorizeForm: {
        roleUID: '',
        permUIDList: [],
      },
      treeProps: {
        label: 'title',
        children: 'children',
      },
      defKeys: [],
    }
  },
  created() {
    this.queryPermPage()
    this.getRoleList()
  },

  methods: {
    // 权限分页查询
    async queryPermPage() {
      const { data: res } = await queryPermTree(this.query)
      if (res.code !== 200) this.$message.error(res.message)

      this.permList = res.data.records
      this.permTotal = res.data.total
    },
    // 权限分页查询
    async getRoleList() {
      const query = {
        limit: '',
        page: '',
      }
      const { data: res } = await queryRole(query)
      if (res.code !== 200) this.$message.error(res.message)

      this.roleList = res.data.records
      this.roleTotal = res.data.total
    },
    // 根据角色UID获取权限列表
    async getRolePermsTreeByUID(UID) {
      if (!UID) return

      const { data: res } = await getPermsTree(UID)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.permList = res.data
    },

    //增改
    showAddDialog() {
      this.titles = '新增权限'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '编辑权限'
      this.$nextTick(() => {
        this.form = { ...row }
      })
      this.dialogVisible = true
    },
    // 新增权限
    async savePerm() {
      const { data: res } = await savePerm(this.form)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.queryPermPage()
      this.dialogVisible = false
    },

    //弹窗关闭通过Refs.reset表单
    dialogClosed() {
      this.$refs['formRef'].resetFields()
    },
    //弹窗关闭通过Refs.reset表单
    permDialogClosed() {
      this.$refs.treeRef.setCheckedKeys([])
      this.authorizeForm = {
        roleUID: '',
        permUIDList: [],
      }
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

      const { data: res } = await deletePerm(UID)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPermPage()
      this.$message.success('删除成功！')
    },

    // 授权
    async authorizeRole() {
      this.authorizeForm.permUIDList = this.$refs.treeRef.getCheckedKeys()
      const { data: res } = await authorize(this.authorizeForm)
      if (res.code !== 200) return this.$message.error(res.message)

      this.$message.success('操作成功！')
      this.permDialogVisible = false
    },
    // 弹出授权弹窗
    async showAuthDialog() {
      const query = {
        limit: '',
        page: '',
      }
      const { data: res } = await queryPermTree(query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.completePermTree = res.data.records
      this.permDialogVisible = true
    },

    async computeDefKey(UID) {
      // 根据角色UID获取权限列表
      if (!UID) return this.$refs.treeRef.setCheckedKeys([])

      const { data: res } = await getRoleDefKeys(UID)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.defKeys = res.data
      this.$refs.treeRef.setCheckedKeys(res.data)
    },
  },
}
</script>

<style scoped lang="less">
.el-table {
  width: 100%;
  :deep(.el-input, .el-select) {
    width: 100%;
  }
  :deep(.el-input__prefix) {
    padding-left: 40px;
  }
}
</style>
>

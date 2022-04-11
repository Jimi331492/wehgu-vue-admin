<!--
 * @Author: 龙际妙
 * @Date: 2022-04-07 18:51:49
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\mp\Post.vue
 * @LastEditTime: 2022-04-11 08:32:58
 * @LastEditors: Please set LastEditors
  <template v-slot="scope">
            <div class="avatar-box">
              <div class="avatar">
                <el-avatar :size="50" :src="scope.row.avatar" />
              </div>
              <div class="nickname-box">
                <span class="nickname">{{ scope.row.nickname }}</span>
                <span class="add-time">{{ scope.row.addTime }}</span>
              </div>
            </div>
          </template>
-->

<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>帖子管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="10">
          <span>发布时间 </span>
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            size="small"
          />
        </el-col>
        <el-col :span="7">
          <span>发布账号</span>
          <el-input placeholder="请选择" v-model="query.title" clearable @clear="queryPage" size="small">
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="7">
          <span>审核状态</span>
          <el-input placeholder="请选择" v-model="query.title" clearable @clear="queryPage" size="small">
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="10">
          <span>发布内容</span>
          <el-input placeholder="请选择" v-model="query.title" clearable @clear="queryPage" size="small">
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage" size="small"></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col :span="7">
          <span>所属标签</span>
          <el-input placeholder="请选择" v-model="query.title" clearable @clear="queryPage" size="small">
            <template #append>
              <el-button icon="el-icon-search" @click="queryPage"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4" style="display: flex; justify-content: flex-end; align-self: flex-end">
          <el-button type="danger" @click="confirmBatchDeleteBox" :disabled="this.batchList === null || this.batchList.length < 1" size="small"
            >批量删除</el-button
          >
        </el-col>
        <el-col :span="3" style="display: flex; justify-content: flex-end; align-self: flex-end">
          <el-dropdown size="small" :disabled="this.batchList === null || this.batchList.length < 1" @command="handleSelectAuditStatus">
            <el-button size="small" :disabled="this.batchList === null || this.batchList.length < 1" type="success">
              批量审核<el-icon><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in auditStatusList" :key="item.id" :command="item.value">
                  {{ item.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="list" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="telephone" label="发布人" align="center" width="100px"></el-table-column>
        <el-table-column prop="content" label="内容" width="400" align="center"></el-table-column>
        <el-table-column prop="tag" label="标签" width="80" align="center"></el-table-column>
        <el-table-column prop="pictureNum" label="图片数量" width="55" align="center"></el-table-column>
        <el-table-column prop="star" label="点赞数量" width="55" align="center"></el-table-column>
        <el-table-column prop="addTime" label="发布时间" width="150" align="center"></el-table-column>
        <el-table-column prop="auditStatus" label="状态" width="55" align="center"></el-table-column>
        <el-table-column label="操作" width="250px" align="center">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="预览" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-view" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.tagUuid)"></el-button>
            </el-tooltip>
            <!-- 审核按钮 -->
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
        <el-form-item label="内容" prop="content">
          <el-input style="width: 300px" type="textarea" v-model="form.content" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入备注" />
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

    <!-- 预览弹窗 -->
    <el-dialog :title="titles" v-model="previewDialogVisible" width="50%" @close="previewDialogClosed">
      <div>
        <div>
          <el-avatar :src="previewItem.avatar" />
        </div>
      </div>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { queryPost, savePost, deletePost, batchSavePost } from '../../api/mp'
import { queryDictionary } from '../../api/system'
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

export default {
  components: {
    'arrow-down': ArrowDown,
  },
  setup() {
    const value2 = ref('')
    // 发布时间
    const shortcuts = ref([
      {
        text: '过去7天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          return [start, end]
        },
      },
      {
        text: '过去30天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          return [start, end]
        },
      },
      {
        text: '过去90天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          return [start, end]
        },
      },
    ])

    return { shortcuts, value2 }
  },
  data() {
    return {
      query: { content: '', limit: 10, page: 1 },
      list: [],
      total: 0,
      titles: '',
      dialogVisible: false,
      previewDialogVisible: false,
      form: {
        content: '',
        tag: '',
      },
      auditStatusList: [], //审核状态列表
      previewItem: {
        nickname: '',
        avatar: '',
        gender: '',
        content: '',
        addTime: '',
        tag: '',
        star: null,
        comment: [],
      },
      batchList: [],
    }
  },
  created() {
    this.queryPage()
    this.getBatchKey()
  },
  mounted() {},
  methods: {
    async queryPage() {
      // 分页查询
      const { data: res } = await queryPost(this.query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.list = res.data.records
      this.total = res.data.total
    },
    async getBatchKey() {
      // 分页查询
      const query = {
        limit: '',
        page: '',
        key: '审核状态',
      }
      const { data: res } = await queryDictionary(query)
      if (res.code !== 200) this.$message.error(res.message)
      console.log('res', res)
      this.auditStatusList = res.data.records
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
      this.titles = '新增帖子'
      this.dialogVisible = true
    },
    showEditDialog(row) {
      this.titles = '编辑帖子'
      this.$nextTick(() => {
        this.form = { ...row }
      })
      this.dialogVisible = true
    },
    showPreviewDialog(row) {
      this.titles = '预览'
      this.$nextTick(() => {
        this.previewItem = { ...row }
      })
      this.previewDialogVisible = true
    },

    //批量选择
    handleSelectionChange(e) {
      this.batchList = e.map((item) => {
        return item.postUuid
      })
    },
    // 弹窗关闭重置
    dialogClosed() {
      this.$refs['formRef'].resetFields()
    },
    // 弹窗关闭重置
    previewDialogClosed() {
      this.previewItem = {
        nickname: '',
        avatar: '',
        gender: '',
        content: '',
        addTime: '',
        tag: '',
        star: null,
        comment: [],
      }
    },
    async save() {
      const { data: res } = await savePost(this.form)
      if (res.code !== 200) this.$message.error(res.message)
      this.queryPage()
      this.dialogVisible = false
    },
    //删除
    async confirmDeleteBox(UID) {
      // 弹窗提示用户是否要删除
      const Result = await this.confirm('此操作将永久删除该数据!!!是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await deletePost([UID])
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPage()
      this.$message.success('删除成功！')
    },
    //批量审核
    async handleSelectAuditStatus(e) {
      // 弹窗提示用户是否要删除
      const Result = await this.$confirm(`确认将所选内容设置为${e}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消操作')
      }

      this.batchSave(e)
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
      const { data: res } = await deletePost(this.batchList)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPage()
      this.$message.success('删除成功！')
    },

    //批量选择删除
    async batchSave(auditStatus) {
      const form = {
        postUIDList: this.batchList,
        auditStatus: auditStatus,
      }
      const { data: res } = await batchSavePost(form)
      if (res.code !== 200) this.$message.error(res.message)
      this.queryPage()
      this.$message.success('操作成功！')
    },
  },
}
</script>
<style scoped lang="less">
.el-row {
  width: 100%;
  margin-bottom: 10px;
  .el-col {
    display: inline-flex;
    align-items: center;

    span {
      width: 82px;
      margin: 0 5px;
    }
  }
}
</style>

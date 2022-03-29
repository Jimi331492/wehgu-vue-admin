<!--
 * @Author: 龙际妙
 * @Date: 2022-03-11 21:55:51
 * @Description: 
 * @FilePath: \wehgu-vue-admin\src\views\index\carousel.vue
 * @LastEditTime: 2022-03-28 11:35:38
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="container">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入" v-model="query.name" clearable @clear="queryPage">
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
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" align="center"></el-table-column>
        <el-table-column prop="weight" label="权重" align="center"></el-table-column>
        <el-table-column prop="link" label="链接地址" align="center"></el-table-column>
        <el-table-column prop="status" label="展示状态" align="center">
          <template v-slot="scope">
            <el-switch v-model="scope.row.status" size="large" @change="statusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="缩略图" width="300px" align="center">
          <template v-slot="scope">
            <div class="img-box">
              <el-image
                v-if="scope.row.uri"
                :src="scope.row.uri"
                :hide-on-click-modal="true"
                :preview-src-list="[scope.row.uri]"
                :initial-index="4"
                fit="cover"
              >
              </el-image>

              <img v-else src="../../assets/404.png" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400px" align="center">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="confirmDeleteBox(scope.row.carouselUuid)"></el-button>
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

    <!-- 添加的弹窗 -->
    <el-dialog :title="titles" v-model="dialogVisible" width="50%" @close="dialogClosed">
      <!-- 内容主体 -->
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" type="number" placeholder="请输入权重" />
        </el-form-item>
        <!-- 图片上传区 -->
        <el-form-item label="上传图片">
          <el-upload ref="upload" with-credentials :multiple="false" drag action="#" list-type="image" :http-request="uploadImg" :auto-upload="false">
            <template #default>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将图片拖到此处，或<em>点击</em></div>
            </template>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/png文件</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="链接路径" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接路径" />
        </el-form-item>
        <!-- <el-form-item label="轮播时间" prop="startTime">
          <el-date-picker
            :modelValue="timeRange"
            @update:modelValue="event"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始"
            end-placeholder="结束"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="timeSelectChange"
          />
        </el-form-item>
        <el-form-item label="轮播时间" prop="endTime" v-show="false"> </el-form-item> -->
        <!-- <el-form-item label="运营位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入运营位置" />
        </el-form-item> -->
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
  {{ (timeRange, text) }}
</template>

<script>
import { queryCarousel, saveCarousel, deleteCarousel } from '../../api/carousel'
import { uploadPicture, savePicturePath } from '../../api/common'
import { ref, nextTick, reactive, h } from 'vue'
import { ElMessage, ElMessageBox, ElDatePicker } from 'element-plus'
export default {
  setup() {
    const pathSaveForm = reactive({
      pathSequenceList: [],
      entityUID: '',
      entityName: '',
    })

    // 自定义upload
    const uploadImg = async (params) => {
      const _file = params.file
      const isLt200M = _file.size / 1024 / 1024 < 200

      // size>200M报错
      if (!isLt200M) {
        this.$message.error('文件体积超过200M!上传失败!')
      }

      let formData = new FormData()
      formData.append('picture', _file)

      // 上传图片
      formData.append('pictype', 'carousel')
      const { data: res } = await uploadPicture(formData)
      if (res.code !== 200) return this.$message.error(res.message)
      console.log('上传图片成功')
      const obj = new Object()
      obj.path = res.data
      obj.sequence = 1
      // 准备路径保存的参数
      pathSaveForm.pathSequenceList.push(obj)
      pathSaveForm.entityName = 'carousel'

      // 路径保存
      const { data: req } = await savePicturePath(pathSaveForm)
      if (req.code !== 200) return this.$message.error(req.message)
      console.log('图片路径保存成功')
      queryPage()
      dialogVisible.value = false
    }
    const dialogVisible = ref(false)

    const text = ref('sss')
    const form = reactive({
      carouselUuid: '',
      title: '', //标题
      weight: null, //权重 越大顺序越靠前
      status: false, //当前展示状态 0不展示 1展示
      startTime: '', //计划开始展示时间
      endTime: '', //计划结束展示时间
      link: '', //轮播图点击跳转路径
      location: '', //运营位 将来可能不止有一个轮播图
    })
    //时间change
    const timeSelectChange = (e) => {
      console.log('timeChange', e)
      nextTick(() => {
        form.startTime = e[0]
        form.endTime = e[1]
      })
    }
    const timeRange = ref([new Date(), new Date()])

    const open = (e) => {
      ElMessageBox({
        title: '设置展示时间',
        message: h('div', null, [
          h(ElDatePicker, {
            modelValue: 'timeRange',
            'onUpdate:modelValue': ($event) => {
              timeRange.value = $event
            },
            type: 'datetimerange',
            'range-separator': '-',
            'start-placeholder': '开始',
            'end-placeholder': '结束',
            format: 'YYYY-MM-DD HH:mm:ss',
            'value-format': 'YYYY-MM-DD HH:mm:ss',
            'default-value': new Date(),
          }),
          h('input', {
            domProps: {
              value: text.value,
            },
            onInput: ($event) => {
              text.value = $event.target.value
              console.log('$event', $event)
              console.log('text', text.value)
            },
          }),
          h('p', { key: 'text.value' }, 'value: ' + text.value),
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'date-time-box', //不起作用
        customStyle: 'margin-bottom:200px',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            // console.log('timeRange', timeRange.value)
            form.startTime = new Date(timeRange.value[0])
            form.endTime = new Date(timeRange.value[1])
            form.carouselUuid = e.carouselUuid
            setTimeout(() => {
              done()
            })
          } else {
            e.status = !e.status
            done()
          }
        },
      })
        .then(async (action) => {
          if (action === 'confirm') {
            form.status = e.status
            const sumbit = {
              status: form.status,
              startTime: form.startTime,
              endTime: form.endTime,
              carouselUuid: form.carouselUuid,
            }
            const { data: res } = await saveCarousel(sumbit)
            form.value = reactive({
              carouselUuid: '',
              title: '', //标题
              weight: null, //权重 越大顺序越靠前
              status: false, //当前展示状态 0不展示 1展示
              startTime: '', //计划开始展示时间
              endTime: '', //计划结束展示时间
              link: '', //轮播图点击跳转路径
              location: '', //运营位 将来可能不止有一个轮播图
            })
            if (res.code !== 200) {
              return ElMessage({
                type: 'error',
                message: res.message,
              })
            }
            queryPage()
          }
        })
        .catch((e) => {
          console.log('e', e)
        })
    }
    const list = ref([])
    const total = ref(null)
    const query = reactive({ limit: 5, page: 1 })
    // 分页查询
    const queryPage = async () => {
      const { data: res } = await queryCarousel(query)
      if (res.code !== 200) {
        return ElMessage({
          type: 'error',
          message: res.message,
        })
      }
      console.log('res', res)
      list.value = res.data.records
      total.value = res.data.total
    }

    return {
      query,
      queryPage,
      list,
      total,
      dialogVisible,
      open,
      timeRange,
      form,
      text,
      pathSaveForm,
      timeSelectChange,
      uploadImg,
    }
  },
  data() {
    return {
      titles: '',
    }
  },
  created() {
    this.queryPage()
  },
  mounted() {},
  methods: {
    // 分页控件
    handleSizeChange(e) {
      this.query.limit = e
      this.queryPage()
    },
    handleCurrentChange(e) {
      this.query.page = e
      this.queryPage()
    },
    //增改
    showAddDialog() {
      this.titles = '新增轮播图'

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
      })
    },
    showEditDialog(row) {
      this.titles = '编辑'
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
      console.log('form', this.form)

      const { data: res } = await saveCarousel(this.form)
      if (res.code !== 200) return this.$message.error(res.message)
      this.pathSaveForm.entityUID = res.data
      this.$refs.upload.submit()
      this.$refs.upload.clearFiles()
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

      const { data: res } = await deleteCarousel(UID)
      if (res.code !== 200) return this.$message.error(res.message)
      this.queryPage()
      this.$message.success('删除成功！')
    },

    async statusChange(e) {
      const form = {
        carouselUuid: e.carouselUuid,
        status: e.status,
      }
      console.log('form', form)
      // 弹窗提示用户是否要删除
      if (e.uri === null || e.uri === '') {
        e.status = !e.status
        return this.$message.error('图片资源已丢失')
      }
      if (e.status) {
        this.open(e)
      } else {
        const { data: res } = await saveCarousel(form)
        if (res.code !== 200) return this.$message.error(res.message)

        this.queryPage()
      }
    },
    event($event) {
      console.log('event', $event)
      this.timeRange = $event
    },
  },
}
</script>

<style scoped lang="less">
.img-box {
  height: 100px;
  display: flex;
  justify-content: center;
}
</style>

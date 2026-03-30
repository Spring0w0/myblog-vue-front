<template>
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-6">标签管理</h1>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <el-input
            v-model="searchName"
            placeholder="搜索标签名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="success" @click="openCreateDialog">新增标签</el-button>
      </div>

      <el-table
        :data="tagList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="name" label="标签名称" min-width="150" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="px-4 py-3 border-t border-gray-200 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑标签' : '新增标签'"
      width="420px"
      destroy-on-close
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="formData.name" placeholder="请输入标签名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="isEditing" label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEditing ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminTagApi } from '@/api/adminTagApi'

const tagList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchName = ref('')

const dialogVisible = ref(false)
const isEditing = ref(false)
const submitLoading = ref(false)
const editingId = ref(null)

const formData = reactive({
  name: '',
  status: 1
})

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

const loadTags = async () => {
  loading.value = true
  try {
    const result = await adminTagApi.getTags(currentPage.value, pageSize.value, searchName.value)
    if (result.success && result.data) {
      tagList.value = result.data.list || []
      total.value = result.data.total || 0
    } else {
      ElMessage.error(result.message || '加载标签失败')
    }
  } catch (error) {
    ElMessage.error('加载标签失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadTags()
}

const handlePageChange = () => {
  loadTags()
}

const handleSizeChange = () => {
  currentPage.value = 1
  loadTags()
}

const resetForm = () => {
  formData.name = ''
  formData.status = 1
  editingId.value = null
  isEditing.value = false
}

const openCreateDialog = () => {
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  resetForm()
  isEditing.value = true
  editingId.value = row.id
  formData.name = row.name
  formData.status = row.status
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formData.name.trim()) {
    ElMessage.warning('标签名称不能为空')
    return
  }

  submitLoading.value = true
  try {
    let result
    if (isEditing.value) {
      result = await adminTagApi.updateTag(editingId.value, formData.name, formData.status)
    } else {
      result = await adminTagApi.createTag(formData.name)
    }

    if (result.success) {
      ElMessage.success(isEditing.value ? '修改成功' : '创建成功')
      dialogVisible.value = false
      loadTags()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除标签「${row.name}」吗？删除后不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const result = await adminTagApi.deleteTag(row.id)
      if (result.success) {
        ElMessage.success('删除成功')
        if (tagList.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        loadTags()
      } else {
        ElMessage.error(result.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  loadTags()
})
</script>

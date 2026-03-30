<template>
  <div class="p-5">
    <h1 class="text-2xl font-bold mb-6">文章管理</h1>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <el-input
            v-model="searchTitle"
            placeholder="搜索文章标题"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-select
            v-model="searchStatus"
            placeholder="文章状态"
            clearable
            style="width: 120px"
            @change="handleSearch"
          >
            <el-option label="已发布" :value="1" />
            <el-option label="草稿" :value="0" />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
        <el-button type="success" @click="goToNewArticle">新增文章</el-button>
      </div>

      <el-table
        :data="articleList"
        v-loading="loading"
        style="width: 100%"
        stripe
      >
        <el-table-column label="封面" width="100" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              style="width: 60px; height: 40px; border-radius: 4px"
              preview-teleported
            />
            <span v-else class="text-gray-400 text-xs">无封面</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="分类" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.category">{{ row.category.name }}</span>
            <span v-else class="text-gray-400">未分类</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="150">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tag"
              :key="tag.id"
              size="small"
              class="mr-1 mb-1"
            >
              {{ tag.name }}
            </el-tag>
            <span v-if="!row.tag || row.tag.length === 0" class="text-gray-400 text-xs">无标签</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
              {{ row.status === 1 ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读量" width="80" align="center" />
        <el-table-column label="创建时间" width="170" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goToEditArticle(row.id)">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminArticleApi } from '@/api/adminArticleApi'

const router = useRouter()

const articleList = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchTitle = ref('')
const searchStatus = ref(null)

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

const loadArticles = async () => {
  loading.value = true
  try {
    const result = await adminArticleApi.getArticles(
      currentPage.value,
      pageSize.value,
      searchTitle.value,
      searchStatus.value
    )
    if (result.success && result.data) {
      articleList.value = result.data.list || []
      total.value = result.data.total || 0
    } else {
      ElMessage.error(result.message || '加载文章失败')
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadArticles()
}

const handlePageChange = () => {
  loadArticles()
}

const handleSizeChange = () => {
  currentPage.value = 1
  loadArticles()
}

const goToNewArticle = () => {
  router.push('/admin/articles/new')
}

const goToEditArticle = (id) => {
  router.push(`/admin/articles/edit/${id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除文章「${row.title}」吗？删除后不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const result = await adminArticleApi.deleteArticle(row.id)
      if (result.success) {
        ElMessage.success('删除成功')
        if (articleList.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        loadArticles()
      } else {
        ElMessage.error(result.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  loadArticles()
})
</script>

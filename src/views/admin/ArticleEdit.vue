<template>
  <div class="p-5" v-loading="pageLoading">
    <el-page-header @back="goBack" :content="isEdit ? '编辑文章' : '新增文章'" title="返回" class="mb-6" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <el-form :model="articleForm" label-width="80px">
            <el-form-item label="文章标题" required>
              <el-input
                v-model="articleForm.title"
                placeholder="请输入文章标题"
                size="large"
                clearable
              />
            </el-form-item>
          </el-form>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">文章内容</h3>
          <MdEditor
            v-model="articleForm.content"
            :toolbars="toolbars"
            :preview="false"
            language="zh-CN"
            @on-upload-img="handleEditorUploadImg"
          />
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <el-form :model="articleForm" label-width="80px">
            <el-form-item label="文章摘要">
              <el-input
                v-model="articleForm.summary"
                type="textarea"
                :rows="4"
                maxlength="500"
                show-word-limit
                placeholder="请输入文章摘要（限500字）"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">文章配置</h3>
          <el-form :model="articleForm" label-width="80px">
            <el-form-item label="文章封面">
              <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action=""
                :http-request="handleUpload"
                list-type="picture-card"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="1"
                :on-exceed="handleExceed"
              >
                <el-icon v-if="fileList.length === 0"><Plus /></el-icon>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </el-form-item>

            <el-form-item label="文章分类">
              <el-select
                v-model="articleForm.categoryId"
                placeholder="请选择分类"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="category in categoryOptions"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="文章标签">
              <el-select
                v-model="articleForm.tagIds"
                placeholder="请选择标签"
                multiple
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="tag in tagOptions"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">发布操作</h3>
          <div class="flex gap-3">
            <el-button
              type="primary"
              size="large"
              class="flex-1"
              :loading="submitLoading"
              @click="handlePublish"
            >
              发布文章
            </el-button>
            <el-button
              type="success"
              size="large"
              plain
              :loading="submitLoading"
              @click="handleDraft"
            >
              存为草稿
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { adminArticleApi } from '@/api/adminArticleApi'
import { adminCategoryApi } from '@/api/adminCategoryApi'
import { adminTagApi } from '@/api/adminTagApi'
import uploadApi from '@/api/uploadApi'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const pageLoading = ref(false)
const submitLoading = ref(false)

const articleForm = reactive({
  title: '',
  content: '',
  summary: '',
  cover: '',
  categoryId: null,
  tagIds: [],
  status: 0
})

const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const categoryOptions = ref([])
const tagOptions = ref([])

const toolbars = [
  'bold', 'underline', 'italic', 'strikeThrough',
  '-',
  'title', 'sub', 'sup', 'quote', 'unorderedList', 'orderedList', 'task',
  '-',
  'codeRow', 'code', 'link', 'image', 'table',
  '-',
  'revoke', 'next',
  '=',
  'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview'
]

const loadOptions = async () => {
  const [categoryResult, tagResult] = await Promise.all([
    adminCategoryApi.getAllCategories(),
    adminTagApi.getAllTags()
  ])

  if (categoryResult.success && categoryResult.data) {
    categoryOptions.value = categoryResult.data
  }
  if (tagResult.success && tagResult.data) {
    tagOptions.value = tagResult.data
  }
}

const loadArticle = async (id) => {
  pageLoading.value = true
  try {
    const result = await adminArticleApi.getArticleById(id)
    if (result.success && result.data) {
      const data = result.data
      articleForm.title = data.title || ''
      articleForm.content = data.content || ''
      articleForm.summary = data.summary || ''
      articleForm.cover = data.cover || ''
      articleForm.categoryId = data.categoryId || null
      articleForm.tagIds = data.tagIds || []
      articleForm.status = data.status ?? 0

      if (data.cover) {
        fileList.value = [{ name: '封面', url: data.cover }]
      }
    } else {
      ElMessage.error(result.message || '加载文章失败')
      goBack()
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
    goBack()
  } finally {
    pageLoading.value = false
  }
}

const goBack = () => {
  router.push('/admin/articles')
}

const handlePreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const handleUpload = async ({ file }) => {
  try {
    const result = await uploadApi.uploadImage(file, 'cover')
    if (result && result.success && result.data) {
      articleForm.cover = result.data.url
      ElMessage.success('封面上传成功')
    } else {
      ElMessage.error(result.message || '封面上传失败')
      fileList.value = []
    }
  } catch (error) {
    ElMessage.error('封面上传失败')
    fileList.value = []
  }
}

const handleRemove = () => {
  articleForm.cover = ''
}

const handleExceed = () => {
  ElMessage.warning('只能上传一张封面图片')
}

const handleEditorUploadImg = async (files, callback) => {
  const urls = []
  for (const file of files) {
    try {
      const result = await uploadApi.uploadImage(file, 'content')
      if (result && result.success && result.data) {
        urls.push(result.data)
      } else {
        ElMessage.error(result.message || '图片上传失败')
      }
    } catch (error) {
      ElMessage.error('图片上传失败')
    }
  }
  callback(urls)
}

const validateForm = () => {
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return false
  }
  if (!articleForm.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return false
  }
  return true
}

const submitArticle = async (status) => {
  if (!validateForm()) return

  submitLoading.value = true
  try {
    const payload = {
      title: articleForm.title,
      cover: articleForm.cover,
      summary: articleForm.summary,
      content: articleForm.content,
      status,
      tagIds: articleForm.tagIds,
      categoryId: articleForm.categoryId
    }

    let result
    if (isEdit.value) {
      payload.id = Number(route.params.id)
      result = await adminArticleApi.updateArticle(payload)
    } else {
      result = await adminArticleApi.createArticle(payload)
    }

    if (result.success) {
      ElMessage.success(status === 1 ? '文章发布成功' : '草稿保存成功')
      setTimeout(() => {
        router.push('/admin/articles')
      }, 800)
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handlePublish = () => {
  submitArticle(1)
}

const handleDraft = () => {
  submitArticle(0)
}

onMounted(async () => {
  await loadOptions()
  if (isEdit.value) {
    await loadArticle(route.params.id)
  }
})
</script>

<style scoped>
.upload-demo :deep(.el-upload-list__item) {
  transition: all 0.3s;
}

.md-editor {
  height: 500px;
}
</style>

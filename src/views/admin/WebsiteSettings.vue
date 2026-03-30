<template>
  <div class="space-y-6">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="shadow-sm hover:shadow-md transition-shadow h-full">
          <template #header>
            <div class="flex items-center">
              <span class="text-lg font-semibold">站主个人信息</span>
            </div>
          </template>
          
          <div class="flex flex-col items-center">
            <div 
              class="relative group cursor-pointer"
              @click="handleAvatarClick"
            >
              <el-avatar :size="100" :src="adminInfo.avatar" />
              <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="text-white text-center">
                  <el-icon :size="20"><Edit /></el-icon>
                  <div class="text-xs mt-1">更换头像</div>
                </div>
              </div>
              <input 
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarChange"
              />
            </div>
            
            <div class="mt-4 flex items-center gap-2">
              <span class="text-gray-600">昵称:</span>
              <div v-if="!isEditingNickname" class="flex items-center gap-2">
                <span class="text-base font-medium">{{ adminInfo.nickname }}</span>
                <el-button 
                  link 
                  @click="isEditingNickname = true"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
              <div v-else class="flex items-center gap-2">
                <el-input 
                  v-model="tempNickname"
                  size="small"
                  style="width: 140px"
                  @keyup.enter="saveNickname"
                />
                <el-button 
                  type="primary" 
                  size="small"
                  @click="saveNickname"
                >
                  确定
                </el-button>
                <el-button 
                  size="small"
                  @click="cancelNickname"
                >
                  取消
                </el-button>
              </div>
            </div>
            
            <div class="mt-6 w-full">
              <el-button 
                type="primary" 
                @click="updateProfile"
                :loading="profileLoading"
                class="w-full"
              >
                更新个人资料
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="shadow-sm hover:shadow-md transition-shadow h-full">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-semibold">首页轮播语录 (共6条)</span>
            </div>
          </template>
          
          <div class="space-y-3">
            <div 
              v-for="(quote, index) in quotes" 
              :key="index"
              class="flex items-center gap-2"
            >
              <span class="text-gray-500 font-medium w-6">{{ index + 1 }}.</span>
              <el-input 
                v-model="quote.content"
                placeholder="请输入语录..."
                size="small"
                @input="handleQuoteChange"
              />
              <el-button 
                link
                @click="clearQuote(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            
            <div class="flex justify-end gap-2 mt-4">
              <el-button 
                type="primary"
                @click="saveAllQuotes"
                :loading="quotesLoading"
              >
                保存全部语录
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="shadow-sm hover:shadow-md transition-shadow h-full">
          <template #header>
            <div class="flex items-center">
              <span class="text-lg font-semibold">站点公告</span>
            </div>
          </template>
          
          <div class="space-y-4">
            <el-input
              v-model="announcement.content"
              type="textarea"
              :rows="3"
              placeholder="请输入公告内容..."
              @input="handleAnnouncementChange"
            />
            
            <div class="flex justify-end">
              <el-button 
                type="primary"
                @click="publishAnnouncement"
                :loading="announcementLoading"
              >
                发布
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="shadow-sm hover:shadow-md transition-shadow">
      <template #header>
        <div class="flex items-center">
          <span class="text-lg font-semibold">网站全局配置管理</span>
        </div>
      </template>
      
      <el-table 
        :data="configList" 
        style="width: 100%"
        v-loading="configLoading"
      >
        <el-table-column 
          prop="description" 
          label="配置项说明" 
          min-width="150"
        />
        <el-table-column 
          prop="config_key" 
          label="配置键" 
          min-width="150"
        >
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.config_key }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column 
          label="配置内容" 
          min-width="250"
        >
          <template #default="{ row }">
            <div v-if="row.isEditing">
              <div class="space-y-2">
                <el-input
                  v-model="row.tempKey"
                  placeholder="配置键"
                  size="small"
                  disabled
                />
                <el-input
                  v-if="row.field_type === 'short'"
                  v-model="row.tempValue"
                  placeholder="配置值"
                  size="small"
                />
                <el-input
                  v-else
                  v-model="row.tempValue"
                  type="textarea"
                  :rows="3"
                  placeholder="配置值"
                  size="small"
                />
              </div>
            </div>
            <div v-else class="text-gray-600">
              {{ row.config_value }}
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          label="操作" 
          width="120" 
          align="center"
        >
          <template #default="{ row }">
            <el-button 
              v-if="row.isEditing"
              type="primary" 
              link
              @click="saveConfig(row)"
            >
              保存
            </el-button>
            <el-button 
              v-else
              link
              @click="editConfig(row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="mt-6 flex justify-end gap-3">
        <el-button 
          type="primary" 
          @click="saveAllConfigs"
          :loading="saveAllLoading"
        >
          一键保存所有配置
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Delete } from '@element-plus/icons-vue'
import settingApi from '@/api/settingApi'
import uploadApi from '@/api/uploadApi'

const adminInfo = reactive({
  avatar: '',
  nickname: ''
})

const tempNickname = ref('')
const isEditingNickname = ref(false)
const profileLoading = ref(false)
const avatarInputRef = ref(null)
const avatarUploading = ref(false)

const quotes = ref([])

const quotesLoading = ref(false)
const originalQuotes = ref([])

const announcement = reactive({
  id: null,
  content: ''
})

const announcementLoading = ref(false)
const originalAnnouncement = ref('')

const homeQuotesId = ref(null)

const configList = ref([])
const configLoading = ref(false)
const saveAllLoading = ref(false)

let isDirty = false

const loadAdminInfo = async () => {
  try {
    const result = await settingApi.getUserProfile()
    if (result.success && result.data) {
      adminInfo.avatar = result.data.avatar
      adminInfo.nickname = result.data.nickname
    }
  } catch (error) {
    ElMessage.error('加载个人信息失败')
  }
}

const loadConfigs = async () => {
  configLoading.value = true
  try {
    const result = await settingApi.getAllSettings()
    if (result.success && result.data) {
      const allConfigs = result.data
      
      const homeQuotesConfig = allConfigs.find(item => item.configKey === 'home_quotes')
      if (homeQuotesConfig && Array.isArray(homeQuotesConfig.configValue)) {
        const quoteContents = homeQuotesConfig.configValue
        quotes.value = quoteContents.map((content, index) => ({
          id: index + 1,
          content: content || ''
        }))
        originalQuotes.value = JSON.parse(JSON.stringify(quotes.value))
        homeQuotesId.value = homeQuotesConfig.id
      }
      
      const siteAnnouncementConfig = allConfigs.find(item => item.configKey === 'site_announcement')
      if (siteAnnouncementConfig) {
        const rawValue = siteAnnouncementConfig.configValue
        announcement.id = siteAnnouncementConfig.id
        announcement.content = (Array.isArray(rawValue) ? rawValue[0] : rawValue) || ''
        originalAnnouncement.value = announcement.content
      }
      
      const otherConfigs = allConfigs.filter(item => 
        item.configKey !== 'home_quotes' && item.configKey !== 'site_announcement'
      )
      
      configList.value = otherConfigs.map(item => {
        const rawValue = item.configValue
        const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
        return {
          id: item.id,
          config_key: item.configKey,
          config_value: value,
          description: item.description,
          field_type: value && value.length > 50 ? 'long' : 'short',
          isEditing: false,
          tempValue: value,
          tempKey: item.configKey
        }
      })
    }
  } catch (error) {
    ElMessage.error('加载配置失败')
  } finally {
    configLoading.value = false
  }
}

const handleAvatarClick = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return
  }
  
  avatarUploading.value = true
  
  try {
    const result = await uploadApi.uploadImage(file, 'avatar')
    if (result.success && result.data && result.data.url) {
      adminInfo.avatar = result.data.url
      isDirty = true
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(result.message || '头像上传失败')
    }
  } catch (error) {
    ElMessage.error('头像上传失败')
  } finally {
    avatarUploading.value = false
  }
}

const saveNickname = () => {
  if (!tempNickname.value.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  
  adminInfo.nickname = tempNickname.value
  isEditingNickname.value = false
  isDirty = true
  ElMessage.success('昵称已更新')
}

const cancelNickname = () => {
  tempNickname.value = adminInfo.nickname
  isEditingNickname.value = false
}

const updateProfile = async () => {
  profileLoading.value = true
  try {
    const result = await settingApi.updateUserProfile({
      nickname: adminInfo.nickname,
      avatar: adminInfo.avatar
    })
    if (result.success) {
      ElMessage.success('个人资料更新成功')
      isDirty = false
    } else {
      ElMessage.error(result.message || '更新失败')
    }
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    profileLoading.value = false
  }
}

const handleQuoteChange = () => {
  isDirty = JSON.stringify(quotes.value) !== JSON.stringify(originalQuotes.value)
}

const clearQuote = (index) => {
  quotes.value[index].content = ''
  isDirty = true
}

const saveAllQuotes = async () => {
  quotesLoading.value = true
  try {
    const result = await settingApi.batchUpdateSettings([{
      id: homeQuotesId.value,
      configKey: 'home_quotes',
      configValue: quotes.value.map(q => q.content).filter(c => c.trim())
    }])
    
    if (result.success) {
      originalQuotes.value = JSON.parse(JSON.stringify(quotes.value))
      ElMessage.success('所有语录保存成功')
      isDirty = false
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    quotesLoading.value = false
  }
}

const handleAnnouncementChange = () => {
  isDirty = announcement.content !== originalAnnouncement.value
}

const publishAnnouncement = async () => {
  if (!announcement.content.trim()) {
    ElMessage.warning('公告内容不能为空')
    return
  }
  
  announcementLoading.value = true
  try {
    const result = await settingApi.batchUpdateSettings([{
      id: announcement.id,
      configKey: 'site_announcement',
      configValue: announcement.content
    }])
    
    if (result.success) {
      originalAnnouncement.value = announcement.content
      ElMessage.success('公告发布成功')
      isDirty = false
    } else {
      ElMessage.error(result.message || '发布公告失败')
    }
  } catch (error) {
    ElMessage.error('发布公告失败')
  } finally {
    announcementLoading.value = false
  }
}

const editConfig = (row) => {
  row.tempValue = row.config_value
  row.tempKey = row.config_key
  row.isEditing = true
}

const saveConfig = (row) => {
  if (!row.tempValue.trim()) {
    ElMessage.warning('配置内容不能为空')
    return
  }
  
  row.config_value = row.tempValue
  row.isEditing = false
  isDirty = true
  ElMessage.success('配置已更新')
}

const saveAllConfigs = async () => {
  saveAllLoading.value = true
  try {
    const configs = configList.value.map(item => ({
      id: item.id,
      configKey: item.config_key,
      configValue: item.config_value
    }))
    
    const result = await settingApi.batchUpdateSettings(configs)
    
    if (result.success) {
      ElMessage.success('所有配置保存成功')
      isDirty = false
    } else {
      ElMessage.error(result.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saveAllLoading.value = false
  }
}

const handleBeforeUnload = (event) => {
  if (isDirty) {
    event.preventDefault()
    event.returnValue = ''
  }
}

onMounted(() => {
  loadAdminInfo()
  loadConfigs()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>

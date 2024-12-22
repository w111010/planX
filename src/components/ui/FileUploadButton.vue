<template>
  <div class="relative inline-flex">
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      @change="handleFileChange"
      :accept="accept"
    />
    <button
      type="button"
      class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
      @click="showUploadModal = true"
    >
      <ArrowUpTrayIcon class="h-4 w-4" />
      <span>快速上传</span>
    </button>

    <!-- 遮罩层和弹窗容器 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showUploadModal" class="fixed inset-0 bg-gray-500/75 z-40 rounded-lg">
        <!-- 弹窗内容 -->
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 sm:items-center">
            <Transition
              enter-active-class="ease-out duration-300"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-200"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div 
                v-if="showUploadModal"
                class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg"
              >
                <!-- 弹窗头部 -->
                <div class="px-6 py-4 border-b flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900">
                    选择上传方式
                  </h3>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-500"
                    @click="handleClose"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </div>
                
                <!-- 弹窗内容 -->
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-2 gap-4">
                    <!-- 文件上传 -->
                    <button
                      type="button"
                      class="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                      @click="triggerFileInput"
                    >
                      <DocumentArrowUpIcon class="h-8 w-8 text-gray-400" />
                      <div class="text-sm font-medium text-gray-900">上传文件</div>
                      <div class="text-xs text-gray-500">支持常见文档格式</div>
                    </button>

                    <!-- 链接上传 -->
                    <button
                      type="button"
                      class="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                      @click="showLinkInput = true"
                    >
                      <LinkIcon class="h-8 w-8 text-gray-400" />
                      <div class="text-sm font-medium text-gray-900">添加链接</div>
                      <div class="text-xs text-gray-500">输入文档链接地址</div>
                    </button>
                  </div>

                  <!-- 链接输入框 -->
                  <div v-if="showLinkInput" class="space-y-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">
                        链接名称
                      </label>
                      <Input
                        v-model="linkName"
                        type="text"
                        placeholder="输入链接名称"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">
                        链接地址
                      </label>
                      <Input
                        v-model="linkUrl"
                        type="url"
                        placeholder="输入链接地址"
                      />
                    </div>
                    <div class="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        @click="showLinkInput = false"
                      >
                        取消
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        :disabled="!isValidLink"
                        @click="handleLinkSubmit"
                      >
                        确定
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ArrowUpTrayIcon, 
  DocumentArrowUpIcon,
  LinkIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import Button from './Button.vue'
import Input from './Input.vue'

const props = defineProps<{
  accept?: string
}>()

const emit = defineEmits<{
  'upload:file': [File]
  'upload:link': [{ name: string, url: string }]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const showUploadModal = ref(false)
const showLinkInput = ref(false)
const linkName = ref('')
const linkUrl = ref('')

const isValidLink = computed(() => {
  return linkName.value.trim() !== '' && 
    linkUrl.value.trim() !== '' &&
    /^https?:\/\/.+/.test(linkUrl.value)
})

const triggerFileInput = () => {
  showUploadModal.value = false
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    emit('upload:file', input.files[0])
    input.value = '' // 重置input，允许上传相同文件
  }
}

const handleLinkSubmit = () => {
  if (!isValidLink.value) return
  
  emit('upload:link', {
    name: linkName.value.trim(),
    url: linkUrl.value.trim()
  })
  
  // 重置状态
  linkName.value = ''
  linkUrl.value = ''
  showLinkInput.value = false
  showUploadModal.value = false
}

const handleClose = () => {
  showUploadModal.value = false
  showLinkInput.value = false
  linkName.value = ''
  linkUrl.value = ''
}
</script>

<style scoped>
/* 移除之前的动画样式，因为现在使用 Transition 组件了 */
</style> 
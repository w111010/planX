<!-- 文件上传弹窗 -->
<template>
  <BaseModal
    v-model="isOpen"
    max-width="max-w-2xl"
    @after-leave="$emit('close')"
  >
    <div class="flex flex-col max-h-[calc(100vh-2rem)]">
      <!-- 弹窗头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">上传文件</h3>
      </div>

      <!-- 弹窗内容 -->
      <div class="px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <div class="flex items-center gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              文件名称
            </label>
            <Input
              v-model="fileName"
              type="text"
              placeholder="输入文件名称"
              class="w-48"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              文件链接
            </label>
            <Input
              v-model="fileUrl"
              type="text"
              placeholder="输入文件链接"
            />
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="px-6 py-4 border-t flex justify-end gap-3 bg-white rounded-b-lg">
        <Button
          variant="outline"
          size="sm"
          @click="handleClose"
        >
          取消
        </Button>
        <Button
          variant="primary"
          size="sm"
          :disabled="!isValid"
          @click="handleSave"
        >
          确定
        </Button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '../../ui/Button.vue'
import Input from '../../ui/Input.vue'
import BaseModal from '../../ui/BaseModal.vue'

const emit = defineEmits<{
  close: []
  save: [{ name: string, url: string }]
}>()

const isOpen = ref(true)
const fileName = ref('')
const fileUrl = ref('')

const isValid = computed(() => {
  return fileName.value.trim() !== '' && fileUrl.value.trim() !== ''
})

const handleClose = () => {
  isOpen.value = false
}

const handleSave = () => {
  if (!isValid.value) return
  emit('save', {
    name: fileName.value.trim(),
    url: fileUrl.value.trim()
  })
  handleClose()
}
</script>
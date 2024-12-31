<!-- 添加链接弹窗 -->
<template>
  <BaseModal
    v-model="isOpen"
    max-width="max-w-2xl"
    @after-leave="$emit('close')"
  >
    <div class="flex flex-col max-h-[calc(100vh-2rem)]">
      <!-- 弹窗头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">添加链接</h3>
      </div>

      <!-- 弹窗内容 -->
      <div class="px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <div class="flex items-center gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              链接名称
            </label>
            <Input
              v-model="linkName"
              type="text"
              placeholder="输入链接名称"
              class="w-48"
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              链接地址
            </label>
            <Input
              v-model="linkUrl"
              type="text"
              placeholder="输入链接地址"
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
const linkName = ref('')
const linkUrl = ref('')

const isValid = computed(() => {
  return linkName.value.trim() !== '' && linkUrl.value.trim() !== ''
})

const handleClose = () => {
  isOpen.value = false
}

const handleSave = () => {
  if (!isValid.value) return
  emit('save', {
    name: linkName.value.trim(),
    url: linkUrl.value.trim()
  })
  handleClose()
}
</script>
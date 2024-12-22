<template>
  <BaseModal 
    v-model="isOpen"
    :is-nested="isNested"
    max-width="max-w-2xl"
    class="overflow-hidden"
    @after-leave="$emit('close')"
  >
    <div class="flex flex-col max-h-[calc(100vh-2rem)]">
      <div class="px-6 py-4 border-b flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 truncate">{{ title }}</h3>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-500"
          @click="handleClose"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
      
      <div class="px-6 py-4 overflow-y-auto flex-1 min-w-[560px]">
        <div class="space-y-4">
          <slot></slot>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t flex justify-end bg-white rounded-b-lg">
        <template v-if="actions">
          <Button
            v-for="action in actions"
            :key="action.label"
            :variant="action.variant || 'primary'"
            size="sm"
            class="mr-2"
            @click="action.onClick"
          >
            {{ action.label }}
          </Button>
        </template>
        <Button
          variant="primary"
          size="sm"
          @click="handleClose"
        >
          关闭
        </Button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import Button from './Button.vue'
import BaseModal from './BaseModal.vue'

defineProps<{
  title: string
  isNested?: boolean
  actions?: Array<{
    label: string
    variant?: 'primary' | 'outline'
    onClick: () => void
  }>
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = ref(true)

const handleClose = () => {
  isOpen.value = false
}
</script>
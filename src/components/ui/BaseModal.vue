<!-- 基础模态框组件 -->
<template>
  <Transition
    appear
    enter-active-class="ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    @after-leave="afterLeave"
  >
    <div v-if="modelValue" class="relative" :style="{ zIndex }">
      <div class="fixed inset-0">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/40 transition-opacity"
          @click="handleClose"
        ></div>
        <!-- Modal Content -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <div class="flex min-h-full items-center justify-center p-4">
            <Transition
              appear
              enter-active-class="ease-out duration-200"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-90"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-90"
            >
              <div
                v-if="modelValue"
                class="relative transform bg-white rounded-lg shadow-xl w-full transition-all"
                :class="[maxWidth || 'max-w-5xl']"
              >
                <slot></slot>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { modalManager } from '../../utils/modalManager'

// 确保组件卸载时重置状态
onUnmounted(() => {
  if (props.modelValue) {
    modalManager.close()
  }
})

const props = defineProps<{
  modelValue: boolean
  maxWidth?: string
  isNested?: boolean
}>()

const zIndex = ref(modalManager.open(props.isNested))

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'after-leave': []
}>()

const handleClose = () => {
  emit('update:modelValue', false)
}

const afterLeave = () => {
  modalManager.close()
  emit('after-leave')
}

// Watch modelValue changes
watch(() => props.modelValue, (val) => {
  if (val) {
    zIndex.value = modalManager.open(props.isNested)
  }
})

// Handle ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  if (props.modelValue) {
    zIndex.value = modalManager.open(props.isNested)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  modalManager.close()
})
</script>
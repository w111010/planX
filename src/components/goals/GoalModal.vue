<!-- 目标编辑弹窗 -->
<template>
  <BaseModal 
    v-model="isOpen"
    max-width="max-w-5xl"
    @after-leave="$emit('close')"
  >
    <div class="flex flex-col max-h-[calc(100vh-2rem)]">
      <!-- 弹窗头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">
          {{ goal ? '编辑目标' : '新建目标' }}
        </h3>
      </div>
      <!-- 弹窗内容 -->
      <div class="px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <!-- 目标名称 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            目标名称
          </label>
          <Input
            v-model="formData.title"
            type="text"
            placeholder="输入目标名称"
          />
        </div>

        <!-- 维度选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            所属维度
          </label>
          <div class="flex flex-wrap gap-4">
            <button
              v-for="dim in DIMENSION_LIST"
              :key="dim.id"
              type="button"
              class="flex-1 min-w-[160px] flex flex-col items-center gap-2 p-4 rounded-lg transition-colors"
              :class="[
                formData.dimension === dim.name
                  ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-600 ring-opacity-60'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              ]"
              @click="selectDimension(dim.name)"
            >
              <component :is="dim.icon" class="h-8 w-8" />
              <span class="text-sm text-center">{{ dim.name }}</span>
            </button>
          </div>
        </div>

        <!-- 着力点选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            着力点{{ !formData.dimension ? ' (请先选择维度)' : '' }}
          </label>
          <Select
            v-model="formData.focusPoint"
            :options="availableFocusPoints"
            placeholder="选择着力点"
            :disabled="!formData.dimension"
          />
        </div>

        <!-- 单位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            单位
          </label>
          <Input
            v-model="formData.unit"
            type="text"
            placeholder="如：个、万元、%等"
          />
        </div>

        <!-- 上期值 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            上期值
          </label>
          <Input
            v-model.number="formData.previousValue"
            type="number"
            placeholder="输入上期值（可选）"
          />
        </div>

        <!-- 目标值设置 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">保底值</label>
            <Input
              v-model.number="formData.baseValue"
              type="number"
              placeholder="输入保底值"
              :suffix="formData.unit"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">冲刺值</label>
            <Input
              v-model.number="formData.stretchValue"
              type="number"
              placeholder="输入冲刺值"
              :suffix="formData.unit"
            />
          </div>
        </div>

        <!-- 备注说明 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">备注说明</label>
          <textarea
            v-model.trim="formData.note"
            rows="2"
            class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-all duration-200 sm:text-sm/6"
            placeholder="添加备注..."
          ></textarea>
        </div>

      </div>

      <!-- 弹窗底部 -->
      <div class="px-6 py-4 border-t flex justify-end items-center gap-3">
        <span v-if="saved" class="text-green-600 flex items-center gap-1">
          <CheckCircleIcon class="h-5 w-5" />
          <span class="text-sm">已保存</span>
        </span>
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
import { ref, computed, onMounted } from 'vue'
import Button from '../ui/Button.vue'
import Select from '../ui/Select.vue'
import Input from '../ui/Input.vue'
import BaseModal from '../ui/BaseModal.vue'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import type { Goal } from '../../types/goal'
import { FOCUS_POINTS, DIMENSION_LIST } from '../../constants/dimensions'

const props = defineProps<{
  goal?: Goal | null
  dimensions: string[]
}>()

const emit = defineEmits<{
  close: []
  save: [Goal]
}>()

const isOpen = ref(true)

const handleClose = () => {
  isOpen.value = false
}

const formData = ref({
  title: props.goal?.title ?? '',
  dimension: props.goal?.dimension ?? '',
  focusPoint: props.goal?.focusPoint ?? '',
  unit: props.goal?.unit ?? '',
  previousValue: props.goal?.previousValue ?? null,
  baseValue: props.goal?.baseValue ?? null,
  stretchValue: props.goal?.stretchValue ?? null,
  note: props.goal?.note ?? ''
})

const saved = ref(false)

const selectDimension = (dimension: string) => {
  formData.value.dimension = dimension
  formData.value.focusPoint = '' // Reset focus point when dimension changes
}

const availableFocusPoints = computed(() => {
  if (!formData.value.dimension) return []
  return FOCUS_POINTS[formData.value.dimension as keyof typeof FOCUS_POINTS].map(point => ({
    value: point.id,
    label: point.name
  }))
})

const isValid = computed(() => {
  return formData.value.title.trim() !== '' &&
    formData.value.dimension !== '' &&
    formData.value.focusPoint !== '' &&
    formData.value.unit.trim() !== ''
})

const handleSave = () => {
  if (!isValid.value) return
  
  saved.value = true
  
  emit('save', {
    id: props.goal?.id ?? 0,
    title: formData.value.title,
    dimension: formData.value.dimension,
    focusPoint: formData.value.focusPoint,
    unit: formData.value.unit,
    previousValue: formData.value.previousValue || undefined,
    baseValue: formData.value.baseValue,
    stretchValue: formData.value.stretchValue,
    note: formData.value.note
  })
}
</script>
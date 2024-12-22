<template>
  <BaseModal
    :model-value="isOpen"
    @update:model-value="$emit('update:isOpen', $event)"
    :is-nested="isNested"
    max-width="max-w-5xl"
    @after-leave="$emit('close')"
  >
    <div class="flex flex-col max-h-[calc(100vh-2rem)]">
      <!-- 弹窗头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">
          {{ task ? '编辑任务' : '新建任务' }}
        </h3>
      </div>

      <!-- 弹窗内容 -->
      <div class="px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <!-- 基本信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              任务名称
            </label>
            <Input
              v-model="formData.title"
              type="text"
              placeholder="输入任务名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              责任人
            </label>
            <Input
              v-model="formData.owner"
              type="text"
              placeholder="输入责任人姓名"
            />
          </div>
        </div>

        <!-- 时间区间 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              开始月份
            </label>
            <Select
              v-model="formData.startMonth"
              :options="availableMonths"
              placeholder="选择开始月份"
              position="bottom"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              完成月份
            </label>
            <div>
              <Select
                v-model="formData.endMonth"
                :options="availableMonths"
                placeholder="选择完成月份"
                position="bottom"
              />
              <div v-if="!isMonthOrderValid" class="mt-1 text-sm text-red-600">
                结束月份不能早于开始月份
              </div>
            </div>
          </div>
        </div>

        <!-- 任务描述 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-all duration-200 sm:text-sm/6"
            placeholder="输入任务描述..."
          ></textarea>
        </div>

        <!-- 分类信息 -->
        <div class="space-y-4">
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
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="px-6 py-4 border-t">
        <div class="flex justify-end gap-2">
          <Button
            variant="outline"
            @click="$emit('close')"
          >
            取消
          </Button>
          <Button
            variant="primary"
            :disabled="!isValid"
            @click="handleSubmit"
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '../ui/BaseModal.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Select from '../ui/Select.vue'
import { DIMENSION_LIST } from '../../constants/dimensions'
import type { Task } from '../../types/task'

const props = defineProps<{
  isOpen: boolean
  isNested?: boolean
  task?: Task
  currentQuarter: string
}>()

const emit = defineEmits<{
  close: []
  'update:isOpen': [boolean]
  submit: [Task]
}>()

// 表单数据
const formData = ref({
  title: props.task?.title || '',
  owner: props.task?.owner || '',
  startMonth: props.task?.startDate || '',
  endMonth: props.task?.endDate || '',
  description: props.task?.description || '',
  dimension: props.task?.dimension || '',
})

// 可选月份
const availableMonths = computed(() => {
  const months = {
    'Q1': ['1月', '2月', '3月'],
    'Q2': ['4月', '5月', '6月'],
    'Q3': ['7月', '8月', '9月'],
    'Q4': ['10月', '11月', '12月']
  }[props.currentQuarter] || []
  
  return months.map(month => ({
    value: month,
    label: month
  }))
})

// 月份顺序验证
const isMonthOrderValid = computed(() => {
  if (!formData.value.startMonth || !formData.value.endMonth) return true
  const months = availableMonths.value.map(m => m.value)
  const startIdx = months.indexOf(formData.value.startMonth)
  const endIdx = months.indexOf(formData.value.endMonth)
  return startIdx <= endIdx
})

// 表单验证
const isValid = computed(() => {
  return formData.value.title &&
    formData.value.owner &&
    formData.value.startMonth &&
    formData.value.endMonth &&
    formData.value.dimension &&
    isMonthOrderValid.value
})

// 选择维度
function selectDimension(dimension: string) {
  formData.value.dimension = dimension
}

// 提交表单
function handleSubmit() {
  emit('submit', {
    id: props.task?.id || Date.now(),
    ...formData.value
  } as Task)
  emit('close')
}
</script>

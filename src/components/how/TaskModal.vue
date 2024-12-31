<!-- 任务编辑弹窗 -->
<template>
  <BaseModal
    v-model="isOpen"
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
            <label class="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
              <span>开始季度</span>
              <span class="text-xs text-gray-500">年度计划按季度规划</span>
            </label>
            <Select
              v-model="formData.startDate"
              :options="quarterOptions"
              placeholder="选择开始季度"
              position="bottom"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              完成季度
            </label>
            <Select
              v-model="formData.endDate"
              :options="quarterOptions"
              placeholder="选择完成季度"
              position="bottom"
            />
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

          <!-- 分类选择 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                着力点{{ !formData.dimension ? ' (请先选择维度)' : '' }}
              </label>
              <Select
                v-model="formData.focusPoint"
                :options="availableFocusPoints"
                placeholder="选择着力点"
                :disabled="!formData.dimension"
                position="top"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                业务流程
              </label>
              <Select
                v-model="formData.businessFlow"
                :options="businessFlowOptions"
                placeholder="选择业务流程"
                :disabled="!formData.dimension"
                position="top"
              />
            </div>
          </div>
          
          <!-- 关联目标 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              关联目标
            </label>
            <Select
              v-model="formData.relatedGoals"
              :options="goalOptions"
              placeholder="选择关联目标"
              multiple
              position="top"
            />
          </div>
        </div>

        <!-- 关键结果（仅在编辑模式下显示） -->
        <div v-if="props.task" class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">
            关键结果
          </label>
          
          <!-- 文本描述 -->
          <textarea
            v-model="formData.keyResults.description"
            rows="2"
            class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-all duration-200 sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="描述关键结果..."
          ></textarea>

          <!-- 指标列表 -->
          <div v-if="formData.keyResults.metrics?.length" class="space-y-2">
            <div 
              v-for="(metric, index) in formData.keyResults.metrics" 
              :key="index"
              class="flex items-center gap-2"
            >
              <Input
                v-model="metric.name"
                type="text"
                placeholder="指标名称"
                class="flex-1 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <Input
                v-model.number="metric.target"
                type="number"
                placeholder="目标值"
                class="w-32 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <Input
                v-model="metric.unit"
                type="text"
                placeholder="单位"
                class="w-24 disabled:bg-gray-50 disabled:text-gray-500"
              />
              <button
                type="button"
                class="text-gray-400 hover:text-red-600"
                @click="removeMetric(index)"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            @click="addMetric"
          >
            <PlusIcon class="h-4 w-4 mr-1" />
            添加指标
          </Button>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="px-6 py-4 border-t flex justify-end gap-3">
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
import { PlusIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Select from '../ui/Select.vue'
import BaseModal from '../ui/BaseModal.vue'
import type { Task } from '../../types/task'
import { FOCUS_POINTS, DIMENSION_LIST, DIMENSIONS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'

// 季度选项
const quarterOptions = computed(() => [
  { value: '2024-03-31', label: '第一季度 (Q1)' },
  { value: '2024-06-30', label: '第二季度 (Q2)' },
  { value: '2024-09-30', label: '第三季度 (Q3)' },
  { value: '2024-12-31', label: '第四季度 (Q4)' }
])

const props = defineProps<{
  task?: Task | null
  isNested?: boolean
}>()

const emit = defineEmits<{
  close: []
  save: [Task]
}>()

const isOpen = ref(true)

const formData = ref({
  title: props.task?.title ?? '',
  owner: props.task?.owner ?? '',
  startDate: props.task?.startDate ?? '',
  endDate: props.task?.endDate ?? '',
  description: props.task?.description ?? '',
  dimension: props.task?.dimension ?? '',
  focusPoint: props.task?.focusPoint ?? '',
  businessFlow: props.task?.businessFlow ?? '',
  relatedGoals: props.task?.relatedGoals ?? [],
  keyResults: {
    description: props.task?.keyResults.description ?? '',
    files: props.task?.keyResults.files ?? [],
    links: props.task?.keyResults.links ?? [],
    metrics: props.task?.keyResults.metrics ?? []
  }
})

const handleClose = () => {
  isOpen.value = false
}

const selectDimension = (dimension: string) => {
  formData.value.dimension = dimension
  formData.value.focusPoint = ''
}

const availableFocusPoints = computed(() => {
  if (!formData.value.dimension) return []
  return FOCUS_POINTS[formData.value.dimension as keyof typeof FOCUS_POINTS].map(point => ({
    value: point.id,
    label: point.name
  }))
})

// 获取业务流程选项
const businessFlowOptions = computed(() => {
  if (!formData.value.dimension) return []
  const flows = BUSINESS_FLOWS[formData.value.dimension]
  return flows?.map(flow => ({
    value: flow.id,
    label: `${flow.name} - ${flow.description}`
  })) || []
})

// 模拟目标选项
const goalOptions = [
  { value: 1, label: '目标1' },
  { value: 2, label: '目标2' },
  { value: 3, label: '目标3' }
]

const addMetric = () => {
  if (!formData.value.keyResults.metrics) {
    formData.value.keyResults.metrics = []
  }
  formData.value.keyResults.metrics.push({
    name: '',
    target: 0,
    unit: ''
  })
}

const removeMetric = (index: number) => {
  formData.value.keyResults.metrics?.splice(index, 1)
}

const isValid = computed(() => {
  return formData.value.title.trim() !== '' &&
    formData.value.owner.trim() !== '' &&
    formData.value.startDate !== '' &&
    formData.value.endDate !== '' &&
    formData.value.dimension !== '' &&
    formData.value.focusPoint !== '' &&
    formData.value.businessFlow.trim() !== ''
})

const handleSave = () => {
  if (!isValid.value) return
  
  emit('save', {
    id: props.task?.id ?? 0,
    ...formData.value
  })
}
</script>
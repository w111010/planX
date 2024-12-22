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
          <template v-if="planLevel === 'year'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                开始季度
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
          </template>
          <template v-else>
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
              <Select
                v-model="formData.endMonth"
                :options="availableMonths"
                placeholder="选择完成月份"
                position="bottom"
              />
            </div>
          </template>
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

        <!-- 关键结果 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-900">关键结果</h4>
            <Button
              variant="outline"
              size="sm"
              @click="addKeyResult"
            >
              添加关键结果
            </Button>
          </div>

          <div 
            v-for="(kr, index) in formData.keyResults" 
            :key="index"
            class="bg-gray-50 rounded-lg p-4 space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 mr-4">
                <Input
                  v-model="kr.name"
                  placeholder="关键结果名称"
                />
              </div>
              <Select
                v-model="kr.type"
                :options="keyResultTypeOptions"
                placeholder="选择类型"
              />
              <button
                type="button"
                class="ml-2 text-gray-400 hover:text-red-600"
                @click="removeKeyResult(index)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- 指标编辑 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-700">数据指标</div>
                <Button
                  variant="text"
                  size="sm"
                  @click="addMetric(kr)"
                >
                  添加指标
                </Button>
              </div>
              
              <div 
                v-for="(metric, mIndex) in kr.metrics" 
                :key="mIndex"
                class="flex items-center gap-2"
              >
                <Input
                  v-model="metric.name"
                  placeholder="指标名称"
                  class="flex-1"
                />
                <Input
                  v-model.number="metric.target"
                  type="number"
                  placeholder="目标值"
                  class="w-24"
                />
                <Input
                  v-model="metric.unit"
                  placeholder="单位"
                  class="w-20"
                />
                <button
                  type="button"
                  class="text-gray-400 hover:text-red-600"
                  @click="removeMetric(kr, mIndex)"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- 附件编辑 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-700">相关附件</div>
                <Button
                  variant="text"
                  size="sm"
                  @click="addAttachment(kr)"
                >
                  添加附件
                </Button>
              </div>
              
              <div 
                v-for="(attachment, aIndex) in kr.attachments" 
                :key="aIndex"
                class="flex items-center gap-2"
              >
                <Select
                  v-model="attachment.type"
                  :options="attachmentTypeOptions"
                  class="w-24"
                />
                <Input
                  v-model="attachment.name"
                  placeholder="名称"
                  class="flex-1"
                />
                <Input
                  v-model="attachment.url"
                  :placeholder="attachment.type === 'file' ? '文件路径' : '链接地址'"
                  class="flex-1"
                />
                <button
                  type="button"
                  class="text-gray-400 hover:text-red-600"
                  @click="removeAttachment(kr, aIndex)"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
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
import { ref, computed, watch } from 'vue'
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/vue/20/solid'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Select from '../ui/Select.vue'
import BaseModal from '../ui/BaseModal.vue'
import type { Task, KeyResult, Metric, Attachment } from '../../types/task'
import { FOCUS_POINTS, DIMENSION_LIST, DIMENSIONS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'

import { MONTH_MAPPING } from '../../constants/months'

// 获取当前季度的月份范围
const getQuarterMonths = (quarter: string) => {
  return MONTH_MAPPING[quarter as keyof typeof MONTH_MAPPING] || MONTH_MAPPING.Q1
}

const props = defineProps<{
  task?: Task | null
  isNested?: boolean
  currentQuarter?: string
  planLevel?: 'year' | 'quarter' | 'month'
}>()

// 季度选项
const quarterOptions = [
  { value: 'Q1', label: '第1季度' },
  { value: 'Q2', label: '第2季度' },
  { value: 'Q3', label: '第3季度' },
  { value: 'Q4', label: '第4季度' }
]

// 可选月份
const availableMonths = computed(() => {
  if (props.planLevel === 'year') return []
  const quarter = props.currentQuarter || 'Q1'
  const quarterMonths = getQuarterMonths(quarter)
  return Object.entries(quarterMonths).map(([label, value]) => ({
    value,
    label
  }))
})

// 监听季度变化，重置月份如果不在当前季度范围内
watch(() => props.currentQuarter, (newQuarter) => {
  if (!newQuarter) return
  
  const quarterMonths = getQuarterMonths(newQuarter)
  const monthValues = Object.values(quarterMonths)
  
  // Reset start month if not in range
  if (formData.value.startMonth && !monthValues.includes(formData.value.startMonth)) {
    formData.value.startMonth = null
  }
  
  // Reset end month if not in range
  if (formData.value.endMonth && !monthValues.includes(formData.value.endMonth)) {
    formData.value.endMonth = null
  }
})

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
  startMonth: props.task?.startMonth ?? null,
  endMonth: props.task?.endMonth ?? null,
  description: props.task?.description ?? '',
  dimension: props.task?.dimension ?? '',
  focusPoint: props.task?.focusPoint ?? '',
  businessFlow: props.task?.businessFlow ?? '',
  keyResults: props.task ? [...props.task.keyResults] : []
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

const keyResultTypeOptions = [
  { value: '流程', label: '流程' },
  { value: '技能', label: '技能' },
  { value: '工具', label: '工具' },
  { value: '机制', label: '机制' },
  { value: '事件', label: '事件' }
]

const attachmentTypeOptions = [
  { value: 'file', label: '文件' },
  { value: 'link', label: '链接' }
]

const addKeyResult = () => {
  formData.value.keyResults.push({
    name: '',
    type: '流程' as const,
    attachments: [],
    metrics: []
  })
}

const removeKeyResult = (index: number) => {
  if (confirm('确定要删除这个关键结果吗？')) {
    formData.value.keyResults.splice(index, 1)
  }
}

const addMetric = (kr: KeyResult) => {
  kr.metrics.push({
    name: '',
    target: 0,
    unit: ''
  })
}

const removeMetric = (kr: KeyResult, index: number) => {
  if (confirm('确定要删除这个指标吗？')) {
    kr.metrics.splice(index, 1)
  }
}

const addAttachment = (kr: KeyResult) => {
  kr.attachments.push({
    type: 'file' as const,
    name: '',
    url: ''
  })
}

const removeAttachment = (kr: KeyResult, index: number) => {
  if (confirm('确定要删除这个附件吗？')) {
    kr.attachments.splice(index, 1)
  }
}

// 月份顺序验证
const isMonthOrderValid = computed(() => {
  if (!formData.value.startMonth || !formData.value.endMonth) return true
  return formData.value.startMonth <= formData.value.endMonth
})

const isValid = computed(() => {
  const hasBasicInfo = formData.value.title.trim() !== '' &&
    formData.value.owner.trim() !== '' &&
    ((props.planLevel === 'year' && formData.value.startDate && formData.value.endDate) ||
     (props.planLevel !== 'year' && formData.value.startMonth !== null && formData.value.endMonth !== null)) &&
    formData.value.dimension !== '' &&
    formData.value.focusPoint !== '' &&
    formData.value.businessFlow.trim() !== '' &&
    (props.planLevel === 'year' ? true : isMonthOrderValid.value)

  // 检查关键结果的有效性
  const hasValidKeyResults = formData.value.keyResults.length > 0 && 
    formData.value.keyResults.every(kr => {
      const hasBasicKrInfo = kr.name.trim() !== '' && kr.type !== ''
      
      // 检查指标的有效性（至少需要一个有效指标）
      const hasValidMetrics = kr.metrics.length > 0 && kr.metrics.every(metric => 
        metric.name.trim() !== '' && 
        metric.unit.trim() !== '' && 
        metric.target !== null
      )
      
      // 检查附件的有效性（附件可以为空）
      const hasValidAttachments = kr.attachments.every(attachment =>
        attachment.name.trim() !== '' &&
        attachment.url.trim() !== '' &&
        attachment.type !== ''
      )

      return hasBasicKrInfo && hasValidMetrics && hasValidAttachments
    })

  return hasBasicInfo && hasValidKeyResults
})

const handleSave = () => {
  if (!isValid.value) return
  
  // 深拷贝数据，避免引用问题
  const savedData: Task = {
    id: props.task?.id ?? 0,
    title: formData.value.title,
    owner: formData.value.owner,
    startDate: props.planLevel === 'year' ? formData.value.startDate : '',
    endDate: props.planLevel === 'year' ? formData.value.endDate : '',
    startMonth: props.planLevel !== 'year' ? formData.value.startMonth : null,
    endMonth: props.planLevel !== 'year' ? formData.value.endMonth : null,
    description: formData.value.description,
    dimension: formData.value.dimension,
    focusPoint: formData.value.focusPoint,
    businessFlow: formData.value.businessFlow,
    keyResults: formData.value.keyResults.map(kr => ({
      name: kr.name,
      type: kr.type,
      metrics: kr.metrics.map(m => ({
        name: m.name,
        target: m.target,
        unit: m.unit
      })),
      attachments: kr.attachments.map(a => ({
        type: a.type,
        name: a.name,
        url: a.url
      }))
    }))
  }
  
  emit('save', savedData)
}
</script>

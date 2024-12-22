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
import { TrashIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { DIMENSION_LIST, FOCUS_POINTS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'
import { MONTH_MAPPING } from '../../constants/months'
import type { Task, KeyResult, Metric, Attachment } from '../../types/task'

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
  startMonth: props.task?.startMonth || null,
  endMonth: props.task?.endMonth || null,
  description: props.task?.description || '',
  dimension: props.task?.dimension || '',
  focusPoint: props.task?.focusPoint || '',
  businessFlow: props.task?.businessFlow || '',
  keyResults: props.task?.keyResults || []
})

// 可选月份
const availableMonths = computed(() => {
  const quarterMonths = MONTH_MAPPING[props.currentQuarter as keyof typeof MONTH_MAPPING] || {}
  return Object.entries(quarterMonths).map(([label, value]) => ({
    value,
    label
  }))
})

// 月份顺序验证
const isMonthOrderValid = computed(() => {
  if (!formData.value.startMonth || !formData.value.endMonth) return true
  return formData.value.startMonth <= formData.value.endMonth
})

// 表单验证
const isValid = computed(() => {
  return formData.value.title &&
    formData.value.owner &&
    formData.value.startMonth &&
    formData.value.endMonth &&
    formData.value.dimension &&
    formData.value.focusPoint &&
    formData.value.businessFlow &&
    isMonthOrderValid.value &&
    formData.value.keyResults.every(kr => 
      kr.name && 
      kr.type && 
      kr.metrics.every(m => m.name && m.target && m.unit) &&
      kr.attachments.every(a => a.type && a.name && a.url)
    )
})

// 选择维度
function selectDimension(dimension: string) {
  formData.value.dimension = dimension
  formData.value.focusPoint = ''
  formData.value.businessFlow = ''
}

// 着力点选项
const availableFocusPoints = computed(() => {
  if (!formData.value.dimension) return []
  return FOCUS_POINTS[formData.value.dimension].map(fp => ({
    value: fp.id,
    label: fp.name
  }))
})

// 业务流程选项
const businessFlowOptions = computed(() => {
  if (!formData.value.dimension) return []
  return BUSINESS_FLOWS[formData.value.dimension].map(bf => ({
    value: bf.id,
    label: bf.name
  }))
})

// 关键结果类型选项
const keyResultTypeOptions = [
  { value: 'process', label: '流程' },
  { value: 'skill', label: '技能' },
  { value: 'tool', label: '工具' },
  { value: 'mechanism', label: '机制' },
  { value: 'event', label: '事件' }
]

// 附件类型选项
const attachmentTypeOptions = [
  { value: 'file', label: '文件' },
  { value: 'link', label: '链接' }
]

// 关键结果操作
function addKeyResult() {
  formData.value.keyResults.push({
    name: '',
    type: '',
    metrics: [],
    attachments: []
  })
}

function removeKeyResult(index: number) {
  formData.value.keyResults.splice(index, 1)
}

function addMetric(kr: KeyResult) {
  kr.metrics.push({
    name: '',
    target: 0,
    unit: ''
  })
}

function removeMetric(kr: KeyResult, index: number) {
  kr.metrics.splice(index, 1)
}

function addAttachment(kr: KeyResult) {
  kr.attachments.push({
    type: 'file',
    name: '',
    url: ''
  })
}

function removeAttachment(kr: KeyResult, index: number) {
  kr.attachments.splice(index, 1)
}

// 提交表单
function handleSubmit() {
  const task: Task = {
    id: props.task?.id || Date.now(),
    title: formData.value.title,
    owner: formData.value.owner,
    startDate: '', // Deprecated: Keep for backward compatibility
    endDate: '',   // Deprecated: Keep for backward compatibility
    startMonth: formData.value.startMonth,
    endMonth: formData.value.endMonth,
    description: formData.value.description,
    dimension: formData.value.dimension,
    focusPoint: formData.value.focusPoint,
    businessFlow: formData.value.businessFlow,
    keyResults: formData.value.keyResults
  }
  
  emit('submit', task)
  emit('close')
}
</script>

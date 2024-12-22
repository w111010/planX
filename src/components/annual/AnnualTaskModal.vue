<template>
  <BaseModal
    :show="true"
    :title="task ? '编辑任务' : '新建任务'"
    max-width="max-w-5xl"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 基本信息 -->
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">任务名称</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label for="owner" class="block text-sm font-medium text-gray-700">负责人</label>
          <input
            id="owner"
            v-model="formData.owner"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <!-- 季度选择 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="startQuarter" class="block text-sm font-medium text-gray-700">开始季度</label>
            <select
              id="startQuarter"
              v-model="formData.startDate"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Q1">第1季度</option>
              <option value="Q2">第2季度</option>
              <option value="Q3">第3季度</option>
              <option value="Q4">第4季度</option>
            </select>
          </div>

          <div>
            <label for="endQuarter" class="block text-sm font-medium text-gray-700">结束季度</label>
            <select
              id="endQuarter"
              v-model="formData.endDate"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Q1">第1季度</option>
              <option value="Q2">第2季度</option>
              <option value="Q3">第3季度</option>
              <option value="Q4">第4季度</option>
            </select>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">任务描述</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
      </div>

      <!-- 分类信息 -->
      <div class="space-y-4">
        <div>
          <label for="dimension" class="block text-sm font-medium text-gray-700">维度</label>
          <select
            id="dimension"
            v-model="formData.dimension"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @change="handleDimensionChange"
          >
            <option v-for="dim in dimensions" :key="dim" :value="dim">{{ dim }}</option>
          </select>
        </div>

        <div>
          <label for="focusPoint" class="block text-sm font-medium text-gray-700">着力点</label>
          <select
            id="focusPoint"
            v-model="formData.focusPoint"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option v-for="point in focusPoints" :key="point.id" :value="point.id">
              {{ point.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="businessFlow" class="block text-sm font-medium text-gray-700">业务流程</label>
          <select
            id="businessFlow"
            v-model="formData.businessFlow"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option v-for="flow in businessFlows" :key="flow.id" :value="flow.id">
              {{ flow.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- 关键结果 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">关键结果</h3>
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="addKeyResult"
          >
            <PlusIcon class="h-5 w-5 mr-1" />
            添加关键结果
          </button>
        </div>

        <div v-for="(kr, index) in formData.keyResults" :key="index" class="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-medium text-gray-900">关键结果 #{{ index + 1 }}</h4>
            <button
              type="button"
              class="text-red-600 hover:text-red-500"
              @click="removeKeyResult(index)"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label :for="'kr-name-' + index" class="block text-sm font-medium text-gray-700">名称</label>
              <input
                :id="'kr-name-' + index"
                v-model="kr.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label :for="'kr-type-' + index" class="block text-sm font-medium text-gray-700">类型</label>
              <select
                :id="'kr-type-' + index"
                v-model="kr.type"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="流程">流程</option>
                <option value="技能">技能</option>
                <option value="工具">工具</option>
                <option value="机制">机制</option>
                <option value="事件">事件</option>
              </select>
            </div>

            <!-- 指标 -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h5 class="text-sm font-medium text-gray-700">指标</h5>
                <button
                  type="button"
                  class="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  @click="addMetric(kr)"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  添加指标
                </button>
              </div>

              <div v-for="(metric, mIndex) in kr.metrics" :key="mIndex" class="flex items-center gap-2">
                <input
                  v-model="metric.name"
                  type="text"
                  placeholder="指标名称"
                  class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  v-model.number="metric.target"
                  type="number"
                  placeholder="目标值"
                  class="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  v-model="metric.unit"
                  type="text"
                  placeholder="单位"
                  class="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  class="text-red-600 hover:text-red-500"
                  @click="removeMetric(kr, mIndex)"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="$emit('close')"
        >
          取消
        </button>
        <button
          type="submit"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          保存
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import BaseModal from '../ui/BaseModal.vue'
import type { Task, KeyResult, Metric } from '../../types/task'
import { DIMENSIONS, FOCUS_POINTS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'

const props = defineProps<{
  task?: Task
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', task: Task): void
}>()

// 季度选项
const quarters = [
  { value: 'Q1', label: '第1季度' },
  { value: 'Q2', label: '第2季度' },
  { value: 'Q3', label: '第3季度' },
  { value: 'Q4', label: '第4季度' }
]

// 表单数据
const formData = ref<Task>({
  id: props.task?.id ?? 0,
  title: props.task?.title ?? '',
  owner: props.task?.owner ?? '',
  startDate: props.task?.startDate ?? 'Q1',
  endDate: props.task?.endDate ?? 'Q1',
  description: props.task?.description ?? '',
  dimension: props.task?.dimension ?? Object.values(DIMENSIONS)[0],
  focusPoint: props.task?.focusPoint ?? '',
  businessFlow: props.task?.businessFlow ?? '',
  keyResults: props.task?.keyResults ?? []
})

// 维度相关数据
const dimensions = Object.values(DIMENSIONS)

const focusPoints = computed(() => {
  return FOCUS_POINTS[formData.value.dimension as keyof typeof FOCUS_POINTS] || []
})

const businessFlows = computed(() => {
  return BUSINESS_FLOWS[formData.value.dimension] || []
})

// 处理维度变化
const handleDimensionChange = () => {
  formData.value.focusPoint = ''
  formData.value.businessFlow = ''
}

// 关键结果操作
const addKeyResult = () => {
  formData.value.keyResults.push({
    name: '',
    type: '流程',
    metrics: [],
    attachments: []
  })
}

const removeKeyResult = (index: number) => {
  formData.value.keyResults.splice(index, 1)
}

// 指标操作
const addMetric = (kr: KeyResult) => {
  kr.metrics.push({
    name: '',
    target: 0,
    unit: ''
  })
}

const removeMetric = (kr: KeyResult, index: number) => {
  kr.metrics.splice(index, 1)
}

// 提交表单
const handleSubmit = () => {
  emit('save', { ...formData.value })
}
</script>

<!-- 任务卡片组件 -->
<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
    <!-- 卡片头部 -->
    <div 
      class="px-6 py-4 flex items-start justify-between"
      :class="{ 'border-b border-gray-100': !isCompact || showDetails }"
    >
      <div class="space-y-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>负责人：{{ owner }}</span>
          <span>{{ formatQuarter(startDate) }} - {{ formatQuarter(endDate) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span 
            v-for="tag in [dimension, focusPoint, businessFlow]" 
            :key="tag"
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
            :class="[
              tag === dimension ? 'bg-gray-50 text-gray-600' :
              tag === focusPoint ? 'bg-indigo-50 text-indigo-600' :
              'bg-green-50 text-green-600'
            ]"
          >
            {{ 
              tag === dimension ? dimension :
              tag === focusPoint ? getFocusPointName(dimension, tag) :
              getBusinessFlowName(dimension, tag)
            }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="isCompact"
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="showDetails = !showDetails"
        >
          <component 
            :is="showDetails ? ChevronUpIcon : ChevronDownIcon"
            class="h-4 w-4"
          />
        </button>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click="$emit('edit', { id, title, owner, startDate, endDate, description, dimension, focusPoint, businessFlow, keyResults })"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="text-gray-400 hover:text-red-600"
          @click="$emit('delete', id)"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div v-if="!isCompact || showDetails" class="px-6 py-4 space-y-4">
      <!-- 描述 -->
      <div v-if="description" class="text-sm text-gray-600">
        {{ description }}
      </div>

      <!-- 关键结果区域 -->
      <div class="space-y-3">
        <h4 class="font-medium text-gray-900">关键结果</h4>
        
        <!-- 文本描述 -->
        <div v-if="keyResults.description" class="text-sm text-gray-600">
          {{ keyResults.description }}
        </div>

        <!-- 文件列表 -->
        <div v-if="keyResults.files?.length" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">附件</div>
          <ul class="space-y-1">
            <li 
              v-for="file in keyResults.files" 
              :key="file.url"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-600">{{ file.name }}</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-600"
                  @click="openFile(file.url)"
                >
                  <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="text-gray-400 hover:text-red-600"
                  @click="removeFile(file)"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- 链接列表 -->
        <div v-if="keyResults.links?.length" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">链接</div>
          <ul class="space-y-1">
            <li 
              v-for="link in keyResults.links" 
              :key="link.url"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-600">{{ link.name }}</span>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="text-gray-400 hover:text-gray-600"
                  @click="openLink(link.url)"
                >
                  <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="text-gray-400 hover:text-red-600"
                  @click="removeLink(link)"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- 指标列表 -->
        <div v-if="keyResults.metrics?.length" class="space-y-2">
          <div class="text-sm font-medium text-gray-700">数据指标</div>
          <ul class="space-y-1">
            <li 
              v-for="metric in keyResults.metrics" 
              :key="metric.name"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-600">{{ metric.name }}</span>
              <span class="text-gray-900 font-medium">
                {{ metric.target }}{{ metric.unit }}
              </span>
            </li>
          </ul>
        </div>

        <!-- 添加按钮组 -->
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="showFileUpload"
          >
            <PaperClipIcon class="h-4 w-4 mr-1" />
            上传文件
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="showAddLink"
          >
            <LinkIcon class="h-4 w-4 mr-1" />
            添加链接
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="showAddMetric"
          >
            <ChartBarIcon class="h-4 w-4 mr-1" />
            添加指标
          </Button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 弹窗组件 -->
  <FileUploadModal
    v-if="showFileUploadModal"
    @close="showFileUploadModal = false"
    @save="handleFileUpload"
  />
  
  <AddLinkModal
    v-if="showAddLinkModal"
    @close="showAddLinkModal = false"
    @save="handleAddLink"
  />
  
  <AddMetricModal
    v-if="showAddMetricModal"
    @close="showAddMetricModal = false"
    @save="handleAddMetric"
  />
</template>

<script setup lang="ts">
import { 
  PencilIcon, 
  TrashIcon,
  PaperClipIcon,
  LinkIcon,
  ChartBarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  XMarkIcon
} from '@heroicons/vue/20/solid'
import Button from '../ui/Button.vue'
import FileUploadModal from './modals/FileUploadModal.vue'
import AddLinkModal from './modals/AddLinkModal.vue'
import AddMetricModal from './modals/AddMetricModal.vue'
import type { Task } from '../../types/task'
import { FOCUS_POINTS, DIMENSIONS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'
import { ref } from 'vue'

const getFocusPointName = (dimension: string, focusPointId: string) => {
  const points = FOCUS_POINTS[dimension as keyof typeof FOCUS_POINTS]
  return points?.find(p => p.id === focusPointId)?.name || focusPointId
}

const getBusinessFlowName = (dimension: string, flowId: string) => {
  const flows = BUSINESS_FLOWS[dimension]
  return flows?.find(f => f.id === flowId)?.name || flowId
}

const formatQuarter = (date: string) => {
  const quarterMap = {
    '03-31': 'Q1',
    '06-30': 'Q2',
    '09-30': 'Q3',
    '12-31': 'Q4'
  }
  const datePart = date.split('-').slice(1).join('-')
  return quarterMap[datePart] || 'Q4'
}

const props = defineProps<Task & {
  id: number
  isCompact?: boolean
}>()

const showDetails = ref(false)
const showFileUploadModal = ref(false)
const showAddLinkModal = ref(false)
const showAddMetricModal = ref(false)

const emit = defineEmits<{
  edit: [Task]
  delete: [number]
  save: [number, Partial<Task>]
}>()

const openFile = (url: string) => {
  window.open(url, '_blank')
}

const removeFile = (file: { name: string, url: string }) => {
  if (props.keyResults.files) {
    const index = props.keyResults.files.findIndex(f => f.url === file.url)
    if (index !== -1) {
      props.keyResults.files.splice(index, 1)
      emit('save', props.id, { keyResults: props.keyResults })
    }
  }
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const removeLink = (link: { name: string, url: string }) => {
  if (props.keyResults.links) {
    const index = props.keyResults.links.findIndex(l => l.url === link.url)
    if (index !== -1) {
      props.keyResults.links.splice(index, 1)
      emit('save', props.id, { keyResults: props.keyResults })
    }
  }
}

const showFileUpload = () => {
  showFileUploadModal.value = true
}

const showAddLink = () => {
  showAddLinkModal.value = true
}

const showAddMetric = () => {
  showAddMetricModal.value = true
}

const handleFileUpload = (file: { name: string, url: string }) => {
  if (!props.keyResults.files) {
    props.keyResults.files = []
  }
  props.keyResults.files.push(file)
  showFileUploadModal.value = false
  emit('save', props.id, { keyResults: props.keyResults })
}

const handleAddLink = (link: { name: string, url: string }) => {
  if (!props.keyResults.links) {
    props.keyResults.links = []
  }
  props.keyResults.links.push(link)
  showAddLinkModal.value = false
  emit('save', props.id, { keyResults: props.keyResults })
}

const handleAddMetric = (metric: { name: string, target: number, unit: string }) => {
  if (!props.keyResults.metrics) {
    props.keyResults.metrics = []
  }
  props.keyResults.metrics.push(metric)
  showAddMetricModal.value = false
  emit('save', props.id, { keyResults: props.keyResults })
}
</script>
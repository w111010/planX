<!-- 任务卡片组件 -->
<template>
  <div 
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
  >
    <!-- 卡片头部 -->
    <div 
      class="px-6 py-4 flex-none"
      :class="{ 'border-b border-gray-100': !isCompact || showDetails }"
    >
      <div class="space-y-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span>负责人：{{ owner }}</span>
          <span v-if="planLevel === 'year'">{{ formatQuarter(startDate) }} - {{ formatQuarter(endDate) }}</span>
          <span v-else-if="planLevel === 'quarter'">{{ formatMonth(startMonth) }} - {{ formatMonth(endMonth) }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span 
            v-for="tag in [dimension, getFocusPointName(dimension, focusPoint), getBusinessFlowName(dimension, businessFlow)]" 
            :key="tag"
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
            :class="[
              tag === dimension ? 'bg-gray-50 text-gray-600' :
              tag === getFocusPointName(dimension, focusPoint) ? 'bg-indigo-50 text-indigo-600' :
              'bg-green-50 text-green-600'
            ]"
          >
            {{ tag }}
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
          @click="$emit('edit', {
            id,
            title,
            owner,
            startDate: '',  // Deprecated
            endDate: '',    // Deprecated
            startMonth,
            endMonth,
            description,
            dimension,
            focusPoint,
            businessFlow,
            keyResults
          })"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="text-gray-400 hover:text-red-600"
          @click="$emit('delete')"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div 
      v-if="!isCompact || showDetails" 
      class="px-6 py-4 space-y-4 flex-1"
    >
      <!-- 描述 -->
      <div v-if="description" class="text-sm text-gray-600">
        {{ description }}
      </div>

      <!-- 关键结果区域 -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900">关键结果</h4>
        
        <div 
          v-for="(kr, index) in keyResults" 
          :key="index"
          class="bg-gray-50 rounded-lg p-4 space-y-3"
        >
          <!-- 关键结果标题和类型 -->
          <div class="flex items-center justify-between">
            <div class="font-medium text-gray-900">{{ kr.name }}</div>
            <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
              {{ kr.type }}
            </span>
          </div>
          
          <!-- 指标列表 -->
          <div v-if="kr.metrics?.length" class="space-y-2">
            <div class="text-xs font-medium text-gray-500">数据指标</div>
            <div class="grid grid-cols-2 gap-2">
              <div 
                v-for="metric in kr.metrics" 
                :key="metric.name"
                class="bg-white rounded p-2 text-sm"
              >
                <div class="text-gray-500">{{ metric.name }}</div>
                <div class="font-medium text-gray-900">
                  {{ metric.target }}{{ metric.unit }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 附件列表 -->
          <div v-if="kr.attachments?.length || true" class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="text-xs font-medium text-gray-500">相关附件</div>
              <FileUploadButton
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                @upload:file="(file) => handleFileUpload(kr, file)"
                @upload:link="(link) => handleLinkAdd(kr, link)"
              />
            </div>
            <div class="space-y-1">
              <a
                v-for="(attachment, idx) in kr.attachments"
                :key="idx"
                :href="attachment.url"
                target="_blank"
                class="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                <DocumentIcon v-if="attachment.type === 'file'" class="h-4 w-4" />
                <LinkIcon v-else class="h-4 w-4" />
                {{ attachment.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
  LinkIcon
} from '@heroicons/vue/20/solid'
import type { Task, KeyResult } from '../../types/task'
import { formatMonth } from '../../utils/date'
import { FOCUS_POINTS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'
import FileUploadButton from '../ui/FileUploadButton.vue'

const props = defineProps<Task & {
  isCompact?: boolean,
  planLevel?: 'year' | 'quarter' | 'month'
}>()

// Format quarter (Q1-Q4)
function formatQuarter(quarter: string) {
  if (!quarter) return ''
  return quarter.replace(/Q(\d)/, '第$1季度')
}

const emit = defineEmits<{
  edit: [Task]
  delete: []
  'update:attachments': [KeyResult, File]
}>()

const showDetails = ref(false)

// Removed formatQuarter function as we now use month-based display directly

function getFocusPointName(dimension: string, focusPointId: string) {
  const points = FOCUS_POINTS[dimension as keyof typeof FOCUS_POINTS]
  return points?.find(p => p.id === focusPointId)?.name || focusPointId
}

function getBusinessFlowName(dimension: string, flowId: string) {
  const flows = BUSINESS_FLOWS[dimension]
  return flows?.find(f => f.id === flowId)?.name || flowId
}

// 处理文件上传
const handleFileUpload = (kr: KeyResult, file: File) => {
  emit('update:attachments', kr, file)
  
  const fileUrl = URL.createObjectURL(file)
  kr.attachments.push({
    type: 'file',
    name: file.name,
    url: fileUrl
  })
}

// 处理链接添加
const handleLinkAdd = (kr: KeyResult, link: { name: string, url: string }) => {
  kr.attachments.push({
    type: 'link',
    name: link.name,
    url: link.url
  })
}
</script>

<style scoped>
.bg-white {
  transform: translateY(0);
  transition: all 0.3s ease;
  break-inside: avoid;
  page-break-inside: avoid;
}

.bg-white:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
}
</style>

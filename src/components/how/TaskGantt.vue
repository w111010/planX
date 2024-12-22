<template>
  <div ref="ganttContainer" class="overflow-x-auto select-none">
    <div class="min-w-full relative">
      <!-- 表头 -->
      <div class="flex border-b">
        <div class="w-64 flex-shrink-0 p-4 border-r bg-gray-50">
          任务名称
        </div>
        <div class="flex-1 flex px-2">
          <div
            v-for="quarter in ['Q1', 'Q2', 'Q3', 'Q4']"
            :key="quarter"
            class="flex-1 py-4 text-center text-sm font-medium text-gray-700 border-l"
          >
            {{ quarter }}
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="divide-y">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex hover:bg-gray-50"
        >
          <!-- 任务信息 -->
          <div class="w-64 flex-shrink-0 p-4 border-r">
            <div class="flex items-center justify-between">
              <div class="font-medium text-gray-900">{{ task.title }}</div>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600"
                @click="showTaskDetails(task)"
              >
                <InformationCircleIcon class="h-5 w-5" />
              </button>
            </div>
            <div class="text-sm text-gray-500">{{ task.owner }}</div>
          </div>

          <!-- 时间条 -->
          <div class="flex-1 p-2 relative">
            <div
              class="absolute h-6 bg-indigo-100 rounded-full group cursor-move transition-all duration-150 ease-in-out"
              :style="getTaskBarComputedStyle(task)"
              @mousedown.stop="startDrag(task, $event, 'move')"
            >
              <!-- 左侧调整手柄 -->
              <div
                class="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-indigo-200 rounded-l-full transition-all duration-200"
                @mousedown.stop="startDrag(task, $event, 'resize-start')"
              ></div>
              
              <!-- 右侧调整手柄 -->
              <div
                class="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-indigo-200 rounded-r-full transition-all duration-200"
                @mousedown.stop="startDrag(task, $event, 'resize-end')"
              ></div>
              
              <div 
                class="absolute inset-0 flex items-center justify-center text-xs font-medium text-indigo-600 transition-opacity duration-200 pointer-events-none"
              >
                {{ task.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 编辑任务弹窗 -->
      <TaskModal
        v-if="showEditModal"
        :is-nested="true"
        :task="editingTask"
        @close="showEditModal = false"
        @save="handleTaskSave"
      />
      
      <!-- 任务详情弹窗 -->
      <Modal
        v-if="selectedTask"
        :title="selectedTask.title"
        :is-nested="showEditModal"
        :actions="[
          {
            label: '编辑',
            variant: 'outline',
            onClick: () => handleEdit(selectedTask!)
          }
        ]"
        @close="selectedTask = null"
      >
        <div v-if="selectedTask" class="space-y-6">
          <!-- 基本信息卡片 -->
          <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">基本信息</h4>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <div class="text-sm font-medium text-gray-500">责任人</div>
                <div class="mt-1 text-sm text-gray-900">{{ selectedTask.owner }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">时间区间</div>
                <div class="mt-1 text-sm text-gray-900">
                  {{ formatQuarter(selectedTask.startDate) }} - {{ formatQuarter(selectedTask.endDate) }}
                </div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">维度</div>
                <div class="mt-1 text-sm text-gray-900">{{ selectedTask.dimension }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">着力点</div>
                <div class="mt-1 text-sm text-gray-900">
                  {{ getFocusPointName(selectedTask.dimension, selectedTask.focusPoint) }}
                </div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">业务流程</div>
                <div class="mt-1 text-sm text-gray-900">
                  {{ getBusinessFlowName(selectedTask.dimension, selectedTask.businessFlow) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 任务描述卡片 -->
          <div v-if="selectedTask.description" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium text-gray-900">任务描述</h4>
            </div>
            <div class="text-sm text-gray-600 whitespace-pre-wrap">
              {{ selectedTask.description }}
            </div>
          </div>

          <!-- 关键结果卡片 -->
          <div v-if="selectedTask.keyResults?.length" class="space-y-4">
            <div 
              v-for="(kr, index) in selectedTask.keyResults" 
              :key="index"
              class="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <!-- 关键结果标题和类型 -->
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ kr.name }}</h4>
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
                    class="bg-gray-50 rounded p-2 text-sm"
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
      </Modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { InformationCircleIcon, DocumentIcon, LinkIcon } from '@heroicons/vue/20/solid'
import Modal from '../ui/Modal.vue'
import TaskModal from './TaskModal.vue'
import type { Task } from '../../types/task'
import { FOCUS_POINTS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'
import FileUploadButton from '../ui/FileUploadButton.vue'
import type { KeyResult } from '../../types/task'

/** 
 * =============== props & emits =============== 
 */
const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  'task-update': (taskId: number, updates: Partial<Task>) => void
  'edit': (task: Task) => void
}>()

/** 
 * =============== UI 交互相关 =============== 
 */
const selectedTask = ref<Task | null>(null)
const showEditModal = ref(false)
const editingTask = ref<Task | null>(null)

const showTaskDetails = (task: Task) => {
  selectedTask.value = task
}

const handleEdit = (task: Task) => {
  selectedTask.value = null
  editingTask.value = task
  showEditModal.value = true
}

const handleTaskSave = (task: Task) => {
  emit('task-update', task.id, task)
  showEditModal.value = false
  editingTask.value = null
}

const getFocusPointName = (dimension: string, focusPointId: string) => {
  const points = FOCUS_POINTS[dimension as keyof typeof FOCUS_POINTS]
  return points?.find(p => p.id === focusPointId)?.name || focusPointId
}

const getBusinessFlowName = (dimension: string, flowId: string) => {
  const flows = BUSINESS_FLOWS[dimension]
  return flows?.find(f => f.id === flowId)?.name || flowId
}

/** 
 * =============== 甘特图布局相关 =============== 
 */
const ganttContainer = ref<HTMLElement | null>(null)

// 每个季度的宽度
const quarterWidth = ref(0)

// 在挂载和窗口尺寸变化时，实时计算季度宽度
onMounted(() => {
  updateQuarterWidth()
  window.addEventListener('resize', updateQuarterWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQuarterWidth)
})

const updateQuarterWidth = () => {
  if (!ganttContainer.value) return
  // 减去左侧固定任务栏宽度
  const containerWidth = ganttContainer.value.clientWidth - 256 
  // 按 4 个季度分
  quarterWidth.value = containerWidth / 4
}

// 获取季度索引
function getQuarterIndex(date: string) {
  const month = parseInt(date.split('-')[1], 10)
  if (month <= 3) return 0
  else if (month <= 6) return 1
  else if (month <= 9) return 2
  else return 3
}

// 根据季度索引得到日期字符串（假设固定为 2024）
function getQuarterDate(quarter: number) {
  const year = 2024
  const quarterMap = ['03-31', '06-30', '09-30', '12-31']
  return `${year}-${quarterMap[quarter]}`
}

// 格式化季度显示
function formatQuarter(date: string) {
  const quarterMap: Record<string, string> = {
    '03-31': 'Q1',
    '06-30': 'Q2',
    '09-30': 'Q3',
    '12-31': 'Q4'
  }
  const datePart = date.split('-').slice(1).join('-')
  return quarterMap[datePart] || 'QX'
}

/** 
 * =============== 计算任务条样式 =============== 
 */
function getTaskBarStyle(task: Task) {
  // 根据 startDate / endDate 计算 left / width
  const startQ = getQuarterIndex(task.startDate)
  const endQ = getQuarterIndex(task.endDate)
  const left = startQ * quarterWidth.value
  // +1 因为如果 startQ=0, endQ=0, 也要占一个季度宽度
  const width = (endQ - startQ + 1) * quarterWidth.value

  return {
    position: 'absolute',
    left: `${left}px`,
    width: `${width}px`,
    top: '50%',
    transform: 'translateY(-50%)',
    willChange: 'left, width'
  }
}

/** 
 * =============== 拖拽状态与逻辑 =============== 
 */
const dragState = reactive({
  isDragging: false,
  dragType: null as 'move' | 'resize-start' | 'resize-end' | null,
  taskId: null as number | null,
  originalLeft: 0,
  originalWidth: 0,
  startX: 0,
  originalStartDate: '',
  originalEndDate: ''
})

// 用于存储拖拽中的"实时"样式
const draggedStyle = ref<{ [key: string]: string }>({})

// 如果处于拖拽状态并且当前任务ID匹配，则使用 draggedStyle，否则使用默认计算样式
function getTaskBarComputedStyle(task: Task) {
  if (dragState.isDragging && dragState.taskId === task.id) {
    return draggedStyle.value
  }
  return getTaskBarStyle(task)
}

/** 
 * =============== 拖拽事件 =============== 
 */
function startDrag(task: Task, e: MouseEvent, dragType: 'move' | 'resize-start' | 'resize-end') {
  e.preventDefault()
  dragState.isDragging = true
  dragState.dragType = dragType
  dragState.taskId = task.id
  dragState.startX = e.clientX
  dragState.originalStartDate = task.startDate
  dragState.originalEndDate = task.endDate

  // 计算当前任务条的初始位置和大小
  const style = getTaskBarStyle(task)
  dragState.originalLeft = parseFloat(style.left)
  dragState.originalWidth = parseFloat(style.width)

  // 拖拽中的初始样式：去掉过渡，使拖动更跟手
  draggedStyle.value = {
    ...style,
    position: 'absolute',
    zIndex: '999',
    pointerEvents: 'none',
    transition: 'none'  // 拖动过程不启用动画
  }

  // 全局监听鼠标移动和抬起
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

function handleDrag(e: MouseEvent) {
  if (!dragState.isDragging || dragState.taskId === null) return

  const deltaX = e.clientX - dragState.startX

  // 先基于 "原始值" 计算新的 left / width
  let newLeft = dragState.originalLeft
  let newWidth = dragState.originalWidth

  switch (dragState.dragType) {
    case 'move':
      // 只移动 => 只更新 left，width 保持不变
      newLeft = dragState.originalLeft + deltaX
      break

    case 'resize-start':
      // 从左边调 => left 跟随鼠标变化，width 相应减小/增大
      newLeft = dragState.originalLeft + deltaX
      newWidth = dragState.originalWidth - deltaX
      // 保证最小宽度为一个季度
      if (newWidth < quarterWidth.value) {
        newWidth = quarterWidth.value
        newLeft = dragState.originalLeft + (dragState.originalWidth - newWidth)
      }
      break

    case 'resize-end':
      // 从右边调 => width 跟随鼠标变化
      newWidth = dragState.originalWidth + deltaX
      if (newWidth < quarterWidth.value) {
        newWidth = quarterWidth.value
      }
      break
  }

  // ========== 越界检查：防止拖出甘特图可视范围 ==========
  // 左边界
  if (newLeft < 0) {
    // 如果是移动，保持宽度，直接把left修回0
    if (dragState.dragType === 'move') {
      newLeft = 0
    } else {
      // resize-start时也不应让条子往左跑出
      const diff = 0 - newLeft
      newLeft = 0
      newWidth -= diff
    }
  }
  // 右边界 = 总宽度 - 本条宽度（移动模式）
  //        or  总宽度（resize模式下可把条子顶到最右）
  const ganttMaxWidth = quarterWidth.value * 4
  if (dragState.dragType === 'move') {
    // 对于移动模式，用 "ganttMaxWidth - newWidth" 做限制
    if (newLeft + newWidth > ganttMaxWidth) {
      newLeft = ganttMaxWidth - newWidth
    }
  } else if (dragState.dragType === 'resize-end') {
    // 调整右侧，若右侧超出 ganttMaxWidth，则截断
    if (newLeft + newWidth > ganttMaxWidth) {
      newWidth = ganttMaxWidth - newLeft
    }
  } else if (dragState.dragType === 'resize-start') {
    // 调整左侧，若右侧超出 ganttMaxWidth，也截断
    if (newLeft + newWidth > ganttMaxWidth) {
      const diff = (newLeft + newWidth) - ganttMaxWidth
      newLeft -= diff
      newWidth = ganttMaxWidth - newLeft
    }
  }

  // 实时更新 draggedStyle
  draggedStyle.value = {
    ...draggedStyle.value,
    left: `${newLeft}px`,
    width: `${newWidth}px`
  }
}

function stopDrag() {
  if (!dragState.isDragging || dragState.taskId === null) {
    cleanupDrag()
    return
  }

  // 松手后，根据最终 left / width 计算新的季度起止
  const finalLeft = parseFloat(draggedStyle.value.left)
  const finalWidth = parseFloat(draggedStyle.value.width)

  // "网格吸附"到最近的季度：四舍五入
  const newStartQuarter = Math.round(finalLeft / quarterWidth.value)
  const newEndQuarter   = Math.round((finalLeft + finalWidth) / quarterWidth.value) - 1

  // clamp 避免越界
  const clampedStartQ = Math.max(0, Math.min(3, newStartQuarter))
  const clampedEndQ   = Math.max(clampedStartQ, Math.min(3, newEndQuarter))

  const newStartDate = getQuarterDate(clampedStartQ)
  const newEndDate   = getQuarterDate(clampedEndQ)

  // 发出更新事件，外部可更新任务数据
  emit('task-update', dragState.taskId, {
    startDate: newStartDate,
    endDate: newEndDate
  })

  // 在这里你也可以加一个"物理弹性/缓动效果"，但通常是CSS过渡即可
  draggedStyle.value.transition = 'left 0.2s, width 0.2s'

  cleanupDrag()
}

function cleanupDrag() {
  dragState.isDragging = false
  dragState.dragType = null
  dragState.taskId = null
  dragState.originalLeft = 0
  dragState.originalWidth = 0
  dragState.startX = 0
  dragState.originalStartDate = ''
  dragState.originalEndDate = ''

  // 清除拖拽时的style
  draggedStyle.value = {}

  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 处理文件上传
const handleFileUpload = (kr: KeyResult, file: File) => {
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
/* 让甘特条有点小过渡，可以在拖拽结束后看到平滑回弹 */
.absolute {
  transition: left 0.2s, width 0.2s;
}
</style>

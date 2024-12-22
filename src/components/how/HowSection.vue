<!-- 如何干模块组件 -->
<template>
  <section class="space-y-6 mt-12">
    <div class="mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">如何干（路径与流程）</h2>
        <p class="mt-2 text-gray-500 text-sm">
          在此制定任务与里程碑，明确责任人、时间节点、关键结果和分类信息（维度、着力点、业务流），确保策略可落地执行。
        </p>
      </div>
      
      <!-- 工具栏 -->
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <!-- 搜索框 -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              placeholder="搜索任务..."
            />
            <MagnifyingGlassIcon 
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            />
          </div>
        </div>
        
        <!-- 维度筛选 -->
        <Select
          v-model="selectedDimension"
          :options="dimensionOptions"
          placeholder="全部维度"
          class="w-40"
        />
        
        <!-- 新增任务按钮 -->
        <Button
          variant="primary"
          size="sm"
          @click="showNewTaskModal = true"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          新增任务
        </Button>
      </div>
      
      <!-- 视图切换工具栏 -->
      <div class="mt-4 flex items-center gap-4">
        <!-- 列表视图类型切换 -->
        <div v-if="currentView === 'list'" class="flex items-center bg-white rounded-lg shadow-sm p-1">
          <button
            v-for="view in listViewOptions"
            :key="view.id"
            class="flex items-center px-3 py-1.5 rounded text-sm transition-colors"
            :class="[
              currentListView === view.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="currentListView = view.id"
          >
            <component :is="view.icon" class="h-4 w-4 mr-1.5" />
            {{ view.name }}
          </button>
        </div>
        
        <div class="flex-1"></div>
        
        <!-- 视图模式切换 -->
        <div class="flex items-center">
          <!-- 视图切换 -->
          <div class="flex items-center bg-white rounded-lg shadow-sm p-1">
            <button
              v-for="view in viewOptions"
              :key="view.id"
              class="flex items-center px-3 py-1.5 rounded text-sm transition-colors"
              :class="[
                currentView === view.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
              @click="currentView = view.id"
            >
              <component :is="view.icon" class="h-4 w-4 mr-1.5" />
              {{ view.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务列表视图 -->
    <div v-if="currentView === 'list'" class="space-y-4">
      <div v-if="filteredTasks.length === 0" class="text-center py-12">
        <ListBulletIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">暂无任务</h3>
        <p class="mt-1 text-sm text-gray-500">点击"新增任务"开始添加</p>
      </div>
      <div 
        v-else
        class="columns-1 md:columns-2 lg:columns-3 gap-4"
        :class="{ 'lg:columns-4': currentListView === 'compact' }"
      >
        <div 
          v-for="task in filteredTasks"
          :key="task.id"
          class="break-inside-avoid mb-4"
        >
          <TaskCard
            v-bind="task"
            :is-compact="currentListView === 'compact'"
            @edit="handleTaskEdit"
            @delete="handleTaskDelete"
            @update:attachments="handleFileUpload"
          />
        </div>
      </div>
    </div>

    <!-- 甘特图视图 -->
    <div v-else-if="currentView === 'gantt'" class="bg-white rounded-lg shadow-sm p-6">
      <div v-if="filteredTasks.length === 0" class="text-center py-12">
        <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold text-gray-900">暂无任务</h3>
        <p class="mt-1 text-sm text-gray-500">点击"新增任务"开始添加</p>
      </div>
      <TaskGantt
        v-else
        :tasks="filteredTasks"
        @task-update="handleTaskUpdate"
      />
    </div>

    <!-- 新建/编辑任务弹窗 -->
    <TaskModal
      v-if="showNewTaskModal"
      :task="editingTask"
      :current-quarter="currentQuarter"
      @close="closeTaskModal"
      @save="handleModalSave"
    />

    <!-- 编辑任务弹窗 -->
    <TaskModal
      v-if="showEditModal"
      :task="editingTask"
      :current-quarter="currentQuarter"
      @close="showEditModal = false"
      @save="handleTaskSave"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartBarIcon,
  ChartBarSquareIcon
} from '@heroicons/vue/24/outline'
import Button from '../ui/Button.vue'
import Select from '../ui/Select.vue'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import TaskGantt from './TaskGantt.vue'
import { DIMENSIONS } from '../../constants/dimensions'
import { SAMPLE_TASKS } from '../../constants/sampleTasks'

// 视图选项
const viewOptions = [
  { id: 'list', name: '列表视图', icon: ListBulletIcon },
  { id: 'gantt', name: '甘特图', icon: ChartBarSquareIcon }
]

const currentView = ref('list')
const currentListView = ref('detailed')
const currentQuarter = inject('currentQuarter', ref('Q1'))

// 列表视图选项
const listViewOptions = [
  { id: 'detailed', name: '详细列表', icon: ListBulletIcon },
  { id: 'compact', name: '简洁列表', icon: Squares2X2Icon }
]

// 任务数据
const tasks = ref<Task[]>(SAMPLE_TASKS)

// 搜索和筛选
const searchQuery = ref('')
const selectedDimension = ref('')

const dimensionOptions = computed(() => [
  { value: '', label: '全部维度' },
  ...Object.values(DIMENSIONS).map(dim => ({
    value: dim,
    label: dim
  }))
])

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDimension = !selectedDimension.value || task.dimension === selectedDimension.value
    return matchesSearch && matchesDimension
  })
})

// 新建/编辑任务
const showNewTaskModal = ref(false)
const editingTask = ref<Task | null>(null)

const closeTaskModal = () => {
  showNewTaskModal.value = false
  editingTask.value = null
}

const handleModalSave = (taskData: Task) => {
  if (editingTask.value) {
    // 更新现有任务
    const index = tasks.value.findIndex(t => t.id === editingTask.value?.id)
    if (index !== -1) {
      tasks.value[index] = { ...taskData, id: editingTask.value.id }
    }
  } else {
    // 添加新任务
    const newId = Math.max(0, ...tasks.value.map(t => t.id)) + 1
    tasks.value.push({ ...taskData, id: newId })
  }
  closeTaskModal()
}

const handleTaskEdit = (task: Task) => {
  editingTask.value = task
  showEditModal.value = true
}

const handleTaskDelete = (taskId: number) => {
  if (confirm('确定要删除这个任务吗？')) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }
}

const showEditModal = ref(false)

const handleTaskSave = (task: Task) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value[index] = task
  } else {
    tasks.value.push({
      ...task,
      id: Math.max(0, ...tasks.value.map(t => t.id)) + 1
    })
  }
  showEditModal.value = false
  editingTask.value = null
}

const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
  const index = tasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) {
    tasks.value[index] = {
      ...tasks.value[index],
      ...updates
    }
  }
}

// 处理文件上传
const handleFileUpload = async (kr: KeyResult, file: File) => {
  try {
    // 这里应该调用你的文件上传API
    // const formData = new FormData()
    // formData.append('file', file)
    // const response = await uploadFile(formData)
    // const fileUrl = response.data.url
    
    // 模拟上传成功
    const fileUrl = URL.createObjectURL(file)
    
    // 更新任务数据
    kr.attachments.push({
      type: 'file',
      name: file.name,
      url: fileUrl
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    // 这里可以添加错误提示
  }
}
</script>

<style scoped>
/* 修改瀑布流动画效果 */
.break-inside-avoid {
  opacity: 0;
  animation: cardFadeIn 0.3s ease-out forwards;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 错开每个卡片的动画延迟 */
.break-inside-avoid:nth-child(1) { animation-delay: 0.1s; }
.break-inside-avoid:nth-child(2) { animation-delay: 0.2s; }
.break-inside-avoid:nth-child(3) { animation-delay: 0.3s; }
.break-inside-avoid:nth-child(4) { animation-delay: 0.4s; }
.break-inside-avoid:nth-child(5) { animation-delay: 0.5s; }
.break-inside-avoid:nth-child(n+6) { animation-delay: 0.6s; }
</style>

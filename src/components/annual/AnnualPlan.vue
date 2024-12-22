<template>
  <div class="space-y-12">
    <!-- 干什么 (Goals) Section -->
    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-6">干什么</h2>
      <div class="space-y-6">
        <div class="flex justify-end">
          <Button @click="showGoalModal = true">
            添加目标
          </Button>
        </div>
        <div class="grid grid-cols-1 gap-6">
          <AnnualTaskCard
            v-for="task in tasks"
            :key="task.id"
            v-bind="task"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
      </div>
    </section>

    <!-- 为什么干 (Value) Section -->
    <section>
      <h2 class="text-3xl font-bold text-gray-900 mb-6">为什么干</h2>
      <div class="grid grid-cols-3 gap-6">
        <div v-for="(value, index) in values" :key="index" class="space-y-4">
          <h3 class="text-xl font-semibold text-gray-900">{{ value.title }}</h3>
          <textarea
            v-model="value.content"
            rows="4"
            class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            :placeholder="value.placeholder"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- 如何干 (Implementation) Section -->
    <HowSection :plan-level="'year'" class="mt-12" />

    <!-- Modals -->
    <AnnualTaskModal
      v-if="showTaskModal"
      :task="editingTask"
      @close="closeTaskModal"
      @save="saveTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue'
import AnnualTaskCard from './AnnualTaskCard.vue'
import AnnualTaskModal from './AnnualTaskModal.vue'
import HowSection from '../how/HowSection.vue'
import type { Task } from '../../types/task'

// View mode state
const viewMode = ref<'list' | 'gantt'>('list')

// Modal states
const showTaskModal = ref(false)
const showGoalModal = ref(false)
const editingTask = ref<Task | null>(null)

// Tasks data
const tasks = ref<Task[]>([])

// Values data
const values = ref([
  {
    title: '客户价值',
    content: '',
    placeholder: '描述对客户的价值...'
  },
  {
    title: '团队价值',
    content: '',
    placeholder: '描述对团队的价值...'
  },
  {
    title: '公司价值',
    content: '',
    placeholder: '描述对公司的价值...'
  }
])

// Task operations
const editTask = (task: Task) => {
  editingTask.value = task
  showTaskModal.value = true
}

const deleteTask = (taskId: number) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
}

const saveTask = (task: Task) => {
  if (editingTask.value) {
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = task
    }
  } else {
    tasks.value.push({
      ...task,
      id: Date.now()
    })
  }
  closeTaskModal()
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
}
</script>

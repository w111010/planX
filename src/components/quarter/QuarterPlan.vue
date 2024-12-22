<template>
  <div class="space-y-8">
    <!-- 季度选择 -->
    <div class="flex justify-center">
      <Card class="p-2">
        <Button
          v-for="quarter in quarters"
          :key="quarter.id"
          :variant="currentQuarter === quarter.id ? 'primary' : 'ghost'"
          size="md"
          @click="currentQuarter = quarter.id"
        >{{ quarter.name }}</Button>
      </Card>
    </div>

    <!-- 季度目标 -->
    <section class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">季度目标</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="goal in quarterGoals"
          :key="goal.id"
          class="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-900">{{ goal.title }}</h4>
            <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
              {{ goal.dimension }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="text-sm text-gray-500">目标值</div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded p-3">
                <div class="text-xs text-gray-500">保底值</div>
                <div class="mt-1 font-medium">{{ goal.baseValue }}{{ goal.unit }}</div>
              </div>
              <div class="bg-gray-50 rounded p-3">
                <div class="text-xs text-gray-500">冲刺值</div>
                <div class="mt-1 font-medium">{{ goal.stretchValue }}{{ goal.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关键任务 -->
    <section class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">关键任务</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="task in quarterTasks"
          :key="task.id"
          class="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-900">{{ task.title }}</h4>
            <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              {{ task.status }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            {{ task.description }}
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">负责人：{{ task.owner }}</span>
            <span class="text-gray-500">截止日期：{{ task.dueDate }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 里程碑 -->
    <section class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">里程碑</h3>
      <div class="relative">
        <div class="absolute top-0 bottom-0 left-6 w-px bg-gray-200"></div>
        <ul class="space-y-6">
          <li
            v-for="milestone in quarterMilestones"
            :key="milestone.id"
            class="relative pl-14"
          >
            <div 
              class="absolute left-4 top-1 h-4 w-4 rounded-full border-2 border-indigo-600"
              :class="milestone.completed ? 'bg-indigo-600' : 'bg-white'"
            ></div>
            <div class="bg-white rounded-lg shadow-sm p-4">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ milestone.title }}</h4>
                <span class="text-sm text-gray-500">{{ milestone.date }}</span>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ milestone.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'

// 季度选项
const quarters = [
  { id: 'Q1', name: '第一季度' },
  { id: 'Q2', name: '第二季度' },
  { id: 'Q3', name: '第三季度' },
  { id: 'Q4', name: '第四季度' },
]

const currentQuarter = ref('Q1')

// 示例数据
const quarterGoals = [
  {
    id: 1,
    title: '提升产品质量',
    dimension: '产品',
    baseValue: 95,
    stretchValue: 98,
    unit: '%'
  },
  // ... 更多目标
]

const quarterTasks = [
  {
    id: 1,
    title: '优化产品性能',
    description: '提升核心功能的响应速度',
    status: '进行中',
    owner: '张三',
    dueDate: '2024-03-31'
  },
  // ... 更多任务
]

const quarterMilestones = [
  {
    id: 1,
    title: '完成产品升级',
    description: '发布新版本，包含性能优化和新功能',
    date: '2024-03-15',
    completed: true
  },
  // ... 更多里程碑
]
</script> 
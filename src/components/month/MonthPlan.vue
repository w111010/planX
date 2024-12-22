<template>
  <div class="space-y-8">
    <!-- 月份选择 -->
    <div class="flex justify-center">
      <Card class="p-2">
        <Button
          v-for="month in months"
          :key="month.id"
          :variant="currentMonth === month.id ? 'primary' : 'ghost'"
          size="md"
          @click="currentMonth = month.id"
        >{{ month.name }}</Button>
      </Card>
    </div>

    <!-- 干什么（目标） -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">干什么</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showNewGoalModal = true"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          新增目标
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="goal in monthGoals"
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
            <div class="text-sm text-gray-500">目标进度</div>
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between">
                <div>
                  <span class="text-xs font-semibold inline-block text-indigo-600">
                    {{ goal.progress }}%
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-semibold inline-block text-gray-600">
                    {{ goal.target }}{{ goal.unit }}
                  </span>
                </div>
              </div>
              <div class="overflow-hidden h-2 text-xs flex rounded bg-indigo-50">
                <div
                  :style="{ width: `${goal.progress}%` }"
                  class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 为什么干（价值） -->
    <section class="space-y-4 mt-12">
      <h3 class="text-2xl font-bold text-gray-900">为什么干</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(value, index) in values" :key="index" class="space-y-4">
          <h4 class="text-xl font-semibold text-gray-900">{{ value.title }}</h4>
          <textarea
            v-model="value.content"
            rows="4"
            class="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            :placeholder="value.placeholder"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- 如何干（路径与流程） -->
    <section class="space-y-4 mt-12">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">如何干</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showNewTaskModal = true"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          新增计划
        </Button>
      </div>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                工作内容
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                负责人
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                开始周
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                结束周
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                周进度
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in monthTasks" :key="task.id">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
                <div class="text-sm text-gray-500">{{ task.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ task.owner }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                第{{ task.startWeek }}周
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                第{{ task.endWeek }}周
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div v-for="progress in task.weeklyProgress" :key="progress.week" class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">第{{ progress.week }}周:</span>
                    <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: progress.completion + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ progress.completion }}%</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  {{ task.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2">编辑</button>
                <button class="text-red-600 hover:text-red-900">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 周报告 -->
    <section class="space-y-4 mt-12">
      <h3 class="text-2xl font-bold text-gray-900">周报告</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="report in weekReports"
          :key="report.id"
          class="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-900">第{{ report.week }}周</h4>
            <span 
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
              :class="report.status === '已完成' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'"
            >
              {{ report.status }}
            </span>
          </div>
          <div class="text-sm text-gray-500">
            {{ report.summary }}
          </div>
          <div class="flex justify-end">
            <Button
              variant="text"
              size="sm"
              @click="viewWeekReport(report)"
            >
              查看详情
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import ValueSection from '../values/ValueSection.vue'

// 月份选项
const months = [
  { id: 1, name: '1月' },
  { id: 2, name: '2月' },
  { id: 3, name: '3月' },
  { id: 4, name: '4月' },
  { id: 5, name: '5月' },
  { id: 6, name: '6月' },
  { id: 7, name: '7月' },
  { id: 8, name: '8月' },
  { id: 9, name: '9月' },
  { id: 10, name: '10月' },
  { id: 11, name: '11月' },
  { id: 12, name: '12月' },
]

const currentMonth = ref(1)

// 示例数据
const monthGoals = [
  {
    id: 1,
    title: '提升客户满意度',
    dimension: '客户',
    progress: 75,
    target: 95,
    unit: '%'
  },
  {
    id: 2,
    title: '新产品上线',
    dimension: '产品',
    progress: 60,
    target: 100,
    unit: '%'
  }
]

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

const monthTasks = [
  {
    id: 1,
    title: '客户回访',
    description: '对重点客户进行回访',
    owner: '张三',
    startWeek: 1,
    endWeek: 2,
    weeklyProgress: [
      { week: 1, status: '进行中', completion: 50 },
      { week: 2, status: '未开始', completion: 0 }
    ],
    status: '进行中'
  },
  {
    id: 2,
    title: '产品测试',
    description: '新功能测试与bug修复',
    owner: '李四',
    startWeek: 2,
    endWeek: 3,
    weeklyProgress: [
      { week: 2, status: '未开始', completion: 0 },
      { week: 3, status: '未开始', completion: 0 }
    ],
    status: '待开始'
  }
]

const weekReports = [
  {
    id: 1,
    week: 1,
    status: '已完成',
    summary: '完成客户回访计划，收集反馈意见'
  },
  {
    id: 2,
    week: 2,
    status: '进行中',
    summary: '产品测试进行中，发现部分问题待修复'
  }
]

// 控制弹窗显示
const showNewGoalModal = ref(false)
const showNewTaskModal = ref(false)

const viewWeekReport = (report: any) => {
  // 实现查看周报告详情的逻辑
  console.log('查看周报告', report)
}
</script>             
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-900">年度目标表</h3>
      <Button @click="showNewGoalModal = true">
        添加目标
      </Button>
    </div>

    <!-- Goal Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">维度</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">着力点</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">年度目标(量化)</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">上年同期</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Q1目标</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Q2目标</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Q3目标</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Q4目标</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="goal in goals" :key="goal.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{{ goal.dimension }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.focusPoint }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.annualTarget }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.lastYearValue }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.q1Target }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.q2Target }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.q3Target }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ goal.q4Target }}</td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
              <button
                class="text-indigo-600 hover:text-indigo-900 mr-4"
                @click="handleEdit(goal)"
              >
                编辑
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="handleDelete(goal.id)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Goal Modal -->
    <BaseModal
      v-if="showNewGoalModal"
      v-model="showNewGoalModal"
      max-width="max-w-2xl"
    >
      <div class="space-y-4 p-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingGoal ? '编辑目标' : '新建目标' }}
        </h3>
        
        <div class="space-y-4">
          <!-- 维度 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">维度</label>
            <select
              v-model="formData.dimension"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option v-for="dim in DIMENSIONS" :key="dim" :value="dim">{{ dim }}</option>
            </select>
          </div>

          <!-- 着力点 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">着力点</label>
            <Input
              v-model="formData.focusPoint"
              type="text"
              placeholder="输入着力点"
            />
          </div>

          <!-- 年度目标(量化) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">年度目标(量化)</label>
            <Input
              v-model="formData.annualTarget"
              type="text"
              placeholder="输入年度目标"
            />
          </div>

          <!-- 上年同期 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">上年同期</label>
            <Input
              v-model="formData.lastYearValue"
              type="text"
              placeholder="输入上年同期数据"
            />
          </div>

          <!-- Q1-Q4目标 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Q1目标</label>
              <Input
                v-model="formData.q1Target"
                type="text"
                placeholder="输入Q1目标"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Q2目标</label>
              <Input
                v-model="formData.q2Target"
                type="text"
                placeholder="输入Q2目标"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Q3目标</label>
              <Input
                v-model="formData.q3Target"
                type="text"
                placeholder="输入Q3目标"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Q4目标</label>
              <Input
                v-model="formData.q4Target"
                type="text"
                placeholder="输入Q4目标"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            @click="showNewGoalModal = false"
          >
            取消
          </Button>
          <Button
            variant="primary"
            size="sm"
            @click="handleSave"
          >
            保存
          </Button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import BaseModal from '../ui/BaseModal.vue'
import { DIMENSIONS } from '../../constants/dimensions'

interface Goal {
  id: number
  dimension: string
  focusPoint: string
  annualTarget: string
  lastYearValue: string
  q1Target: string
  q2Target: string
  q3Target: string
  q4Target: string
}

const goals = ref<Goal[]>([])
const showNewGoalModal = ref(false)
const editingGoal = ref<Goal | null>(null)

const formData = ref<Omit<Goal, 'id'>>({
  dimension: DIMENSIONS[0],
  focusPoint: '',
  annualTarget: '',
  lastYearValue: '',
  q1Target: '',
  q2Target: '',
  q3Target: '',
  q4Target: ''
})

const handleEdit = (goal: Goal) => {
  editingGoal.value = goal
  formData.value = { ...goal }
  showNewGoalModal.value = true
}

const handleDelete = (id: number) => {
  if (confirm('确定要删除这个目标吗？')) {
    goals.value = goals.value.filter(g => g.id !== id)
  }
}

const handleSave = () => {
  if (editingGoal.value) {
    const index = goals.value.findIndex(g => g.id === editingGoal.value?.id)
    if (index !== -1) {
      goals.value[index] = {
        ...formData.value,
        id: editingGoal.value.id
      }
    }
  } else {
    const newId = Math.max(0, ...goals.value.map(g => g.id)) + 1
    goals.value.push({
      ...formData.value,
      id: newId
    })
  }
  showNewGoalModal.value = false
  editingGoal.value = null
  formData.value = {
    dimension: DIMENSIONS[0],
    focusPoint: '',
    annualTarget: '',
    lastYearValue: '',
    q1Target: '',
    q2Target: '',
    q3Target: '',
    q4Target: ''
  }
}
</script>

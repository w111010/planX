<!-- 目标模块组件 -->
<template>
  <div class="space-y-6">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-900">干什么（目标）</h2>
      
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <!-- 搜索框 -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              placeholder="搜索目标..."
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
        
        <!-- 新建目标按钮 -->
        <Button
          variant="primary"
          size="sm"
          @click="showNewGoalModal = true"
        >
          <PlusIcon class="h-5 w-5 mr-1" />
          新建目标
        </Button>
      </div>
    </div>

    <!-- 目标卡片网格 -->
    <div v-if="goals.length === 0" class="text-center">
      <svg class="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">暂无目标</h3>
      <p class="mt-1 text-sm text-gray-500">点击"新建目标"开始添加</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GoalCard
        v-for="goal in filteredGoals"
        :key="goal.id"
        v-bind="goal"
        @save="handleGoalSave(goal.id, $event)"
        @edit="handleGoalEdit(goal)"
        @delete="handleGoalDelete(goal.id)"
      />
    </div>
    <!-- 新建/编辑目标弹窗 -->
    <GoalModal
      v-if="showNewGoalModal"
      :goal="editingGoal"
      :dimensions="dimensions"
      @close="closeGoalModal"
      @save="handleModalSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/20/solid'
import Button from '../ui/Button.vue'
import GoalCard from './GoalCard.vue'
import GoalModal from './GoalModal.vue'
import Input from '../ui/Input.vue'
import Select from '../ui/Select.vue'
import type { Goal, GoalFormData } from '../../types/goal'
import { DIMENSIONS, PRESET_GOALS } from '../../constants/dimensions'
import { SAMPLE_GOALS } from '../../constants/sampleGoals'

// 目标数据
const goals = ref<Goal[]>(SAMPLE_GOALS)

// 搜索和筛选
const searchQuery = ref('')
const selectedDimension = ref('')

const dimensions = Object.values(DIMENSIONS)

const dimensionOptions = computed(() => 
  [
    { value: '', label: '全部维度' },
    ...dimensions.map(dim => ({
    value: dim,
    label: dim
  }))
  ]
)

const filteredGoals = computed(() => {
  return goals.value.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDimension = !selectedDimension.value || goal.dimension === selectedDimension.value
    return matchesSearch && matchesDimension
  })
})

// 新建/编辑目标
const showNewGoalModal = ref(false)
const editingGoal = ref<Goal | null>(null)

const closeGoalModal = () => {
  showNewGoalModal.value = false
  editingGoal.value = null
}

const handleModalSave = (goalData: Goal) => {
  if (editingGoal.value) {
    // 更新现有目标
    const index = goals.value.findIndex(g => g.id === editingGoal.value?.id)
    if (index !== -1) {
      goals.value[index] = {
        ...goalData,
        id: editingGoal.value.id,
        baseValue: goalData.baseValue,
        stretchValue: goalData.stretchValue,
        note: goalData.note
      }
    }
  } else {
    // 添加新目标
    const newId = Math.max(0, ...goals.value.map(g => g.id)) + 1
    const newGoal = {
      ...goalData,
      id: newId,
      baseValue: goalData.baseValue,
      stretchValue: goalData.stretchValue,
      note: goalData.note
    }
    goals.value.push(newGoal)
  }
  closeGoalModal()
}

const handleGoalEdit = (goal: Goal) => {
  editingGoal.value = goal
  showNewGoalModal.value = true
}

const handleGoalDelete = (goalId: number) => {
  if (confirm('确定要删除这个目标吗？')) {
    const index = goals.value.findIndex(g => g.id === goalId)
    if (index !== -1) {
      goals.value.splice(index, 1)
    }
  }
}

// 保存目标
const handleGoalSave = (goalId: number, data: Goal) => {
  const index = goals.value.findIndex(g => g.id === goalId)
  if (index !== -1) {
    goals.value[index] = {
      ...goals.value[index],
      ...data,
      id: goalId
    }
  }
}
</script>
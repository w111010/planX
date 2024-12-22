<!-- 计划系统主组件 -->
<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部区域 -->
    <div class="mb-8 space-y-6">
      <div class="relative flex items-center">
        <h1 class="text-4xl font-bold text-gray-900 relative">
          <button
            type="button"
            class="group inline-flex items-center gap-x-2 text-gray-900 hover:text-gray-600 transition-colors py-2 px-1"
            @click="toggleYearDropdown"
          >
            <span>{{ selectedYear }}年</span>
            <ChevronDownIcon
              :class="[
                showYearDropdown ? 'rotate-180 transform' : '',
                'h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-transform'
              ]"
              aria-hidden="true"
            />
          </button>
          <div class="absolute bottom-0 left-0 right-0 h-px bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </h1>
        <ul
          v-if="showYearDropdown"
          class="absolute left-0 top-full mt-2 w-40 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none backdrop-blur-sm"
        >
          <li
            v-for="year in years"
            :key="year"
            :class="[
              'relative cursor-pointer select-none px-6 py-2.5 text-base hover:bg-gray-50 transition-colors',
              selectedYear === year ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
            ]"
            @click="selectYear(year)"
          >
            {{ year }}
          </li>
        </ul>
      </div>

      <!-- 计划层级选择 -->
      <div class="flex justify-center">
        <Card class="p-2">
          <Button
            v-for="level in planLevels"
            :key="level.id"
            :variant="level.current ? 'primary' : 'ghost'"
            :disabled="!level.enabled"
            size="md"
            @click="selectLevel(level)"
          >{{ level.name }}</Button>
        </Card>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div v-if="selectedLevel" class="px-1">
      <!-- 年度计划 -->
      <template v-if="selectedLevel.id === 'year'">
        <GoalSection :plan-level="'year'" />
        <ValueSection ref="valueSection" :plan-level="'year'" />
        <HowSection :plan-level="'year'" />
      </template>

      <!-- 季度计划 -->
      <template v-else-if="selectedLevel.id === 'quarter'">
        <QuarterPlan :plan-level="'quarter'" />
      </template>

      <!-- 月度计划 -->
      <template v-else-if="selectedLevel.id === 'month'">
        <MonthPlan :plan-level="'month'" />
      </template>

      <!-- 其他模块 -->
      <section v-else
        v-for="module in otherModules"
        :key="module.id">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ module.title }}</h2>
        <textarea
          v-model="moduleData[module.id]"
          rows="4"
          class="block w-full bg-transparent border-b border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 transition-colors resize-none"
          :placeholder="module.description"
        ></textarea>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import Button from './ui/Button.vue'
import Card from './ui/Card.vue'
import GoalSection from './goals/GoalSection.vue'
import HowSection from './how/HowSection.vue'
import ValueSection from './values/ValueSection.vue'
import QuarterPlan from './quarter/QuarterPlan.vue'
import MonthPlan from './month/MonthPlan.vue'

// 年份选项
const years = [2024, 2025, 2026]
const selectedYear = ref(2024)
const showYearDropdown = ref(false)

const toggleYearDropdown = () => {
  showYearDropdown.value = !showYearDropdown.value
}

const selectYear = (year: number) => {
  selectedYear.value = year
  showYearDropdown.value = false
}

// 计划层级
interface PlanLevel {
  id: string
  name: string
  enabled: boolean
  current: boolean
}

const planLevels = ref<PlanLevel[]>([
  { id: 'year', name: '年计划', enabled: true, current: true },
  { id: 'quarter', name: '季度计划', enabled: true, current: false },
  { id: 'month', name: '月计划', enabled: true, current: false }
])

const selectedLevel = computed(() => planLevels.value.find(level => level.current))

// 价值模块引用
const valueSection = ref<InstanceType<typeof ValueSection>>()

// 其他模块定义
const otherModules = [
  { id: 'how', title: '如何干', description: '制定步骤...' },
  { id: 'resources', title: '所需资源', description: '列出资源...' },
  { id: 'risks', title: '风险预案', description: '风险应对...' },
]

// 模块数据
const moduleData = ref<Record<string, string>>({})

// 选择计划层级
const selectLevel = (level: PlanLevel) => {
  if (!level.enabled) return
  planLevels.value.forEach(l => l.current = l.id === level.id)
}
</script>

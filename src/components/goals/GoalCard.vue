<template>
  <div 
    class="group overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 relative"
  >
    <!-- 卡片标题区域 -->
    <div class="px-4 py-5 sm:px-6">
      <div class="flex justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <component
              :is="getDimensionIcon(dimension)"
              class="h-5 w-5 text-gray-500"
            />
            {{ title }}
          </h3>
          <div class="mt-1 flex items-center gap-2">
            <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500">
              {{ dimension }}
            </span>
            <span 
              v-if="focusPoint" 
              class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
            >
              {{ getFocusPointName(dimension, focusPoint) }}
            </span>
          </div>
          <div class="mt-1 text-sm text-gray-500">
            备注：{{ note || '-' }}
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 p-1"
            @click="showEditModal = true"
          >
            <PencilIcon class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="text-gray-400 hover:text-red-600 p-1"
            @click="$emit('delete')"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="bg-gray-50 px-4 py-5 sm:p-6">
      <!-- 上期值信息 -->
      <div v-if="previousValue !== undefined && previousValue !== null" class="mb-4">
        <div class="text-sm font-medium text-gray-500">上期同期</div>
        <div class="mt-1 text-lg font-medium text-gray-900">
          {{ previousValue }}{{ unit }}
        </div>
      </div>

      <!-- 目标值信息 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- 保底值 -->
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm font-medium text-gray-500">保底值</div>
          <div class="mt-1 text-xl font-semibold text-gray-900">
            {{ baseValue !== null && baseValue !== undefined ? `${baseValue}${unit}` : '-' }}
          </div>
        </div>
        
        <!-- 冲刺值 -->
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <div class="text-sm font-medium text-gray-500">冲刺值</div>
          <div class="mt-1 text-xl font-semibold text-gray-900">
            {{ stretchValue !== null && stretchValue !== undefined ? `${stretchValue}${unit}` : '-' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑模态框 -->
    <GoalModal
      v-if="showEditModal"
      :goal="{
        id,
        title,
        dimension,
        focusPoint,
        unit,
        previousValue,
        baseValue,
        stretchValue,
        note
      }"
      :dimensions="[dimension]"
      @close="showEditModal = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GoalModal from './GoalModal.vue'
import {
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/20/solid'
import { FOCUS_POINTS, DIMENSION_LIST } from '../../constants/dimensions'
import type { Component } from 'vue'

interface Props {
  id: number,
  title: string
  dimension: string
  focusPoint?: string
  unit: string
  previousValue?: number
  baseValue?: number | null
  stretchValue?: number | null
  note?: string
}

defineProps<Props>()

const showEditModal = ref(false)

const getFocusPointName = (dimension: string, focusPointId: string) => {
  const points = FOCUS_POINTS[dimension as keyof typeof FOCUS_POINTS]
  return points?.find(p => p.id === focusPointId)?.name || focusPointId
}

const getDimensionIcon = (dimensionName: string): Component => {
  return DIMENSION_LIST.find(d => d.name === dimensionName)?.icon
}

const emit = defineEmits<{
  save: [Goal],
  delete: []
}>()

const handleSave = (goal: Goal) => {
  showEditModal.value = false
  emit('save', goal)
}
</script>
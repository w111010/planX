<template>
  <Card class="task-card">
    <!-- 任务标题和操作按钮 -->
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="mt-1 text-sm text-gray-500">
          负责人：{{ owner }}
        </div>
        <div class="mt-1 text-sm text-gray-500">
          时间：{{ formatQuarter(startDate) }} - {{ formatQuarter(endDate) }}
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="text-gray-400 hover:text-gray-600"
          @click="$emit('edit', { id, title, owner, startDate, endDate, description, dimension, focusPoint, businessFlow, keyResults })"
        >
          <PencilIcon class="h-5 w-5" />
        </button>
        <button
          class="text-gray-400 hover:text-gray-600"
          @click="$emit('delete', id)"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- 任务描述 -->
    <div v-if="description" class="mt-4">
      <p class="text-sm text-gray-600">{{ description }}</p>
    </div>

    <!-- 分类信息 -->
    <div class="mt-4 flex flex-wrap gap-2">
      <Badge>{{ dimension }}</Badge>
      <Badge>{{ focusPoint }}</Badge>
      <Badge>{{ businessFlow }}</Badge>
    </div>

    <!-- 关键结果 -->
    <div v-if="keyResults?.length" class="mt-4 space-y-4">
      <h4 class="font-medium text-gray-900">关键结果</h4>
      <div class="space-y-3">
        <div
          v-for="(kr, index) in keyResults"
          :key="index"
          class="rounded-lg bg-gray-50 p-3"
        >
          <div class="flex items-start justify-between">
            <div>
              <h5 class="font-medium text-gray-900">{{ kr.name }}</h5>
              <span class="mt-1 text-sm text-gray-500">类型：{{ kr.type }}</span>
            </div>
          </div>

          <!-- 指标 -->
          <div v-if="kr.metrics?.length" class="mt-3">
            <h6 class="text-sm font-medium text-gray-700">指标</h6>
            <div class="mt-2 space-y-2">
              <div
                v-for="(metric, mIndex) in kr.metrics"
                :key="mIndex"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-600">{{ metric.name }}</span>
                <span class="font-medium text-gray-900">
                  {{ metric.target }}{{ metric.unit }}
                </span>
              </div>
            </div>
          </div>

          <!-- 附件 -->
          <div v-if="kr.attachments?.length" class="mt-3">
            <h6 class="text-sm font-medium text-gray-700">附件</h6>
            <div class="mt-2 flex flex-wrap gap-2">
              <a
                v-for="(attachment, aIndex) in kr.attachments"
                :key="aIndex"
                :href="attachment.url"
                target="_blank"
                class="inline-flex items-center rounded-md bg-white px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              >
                <component
                  :is="attachment.type === 'file' ? DocumentIcon : LinkIcon"
                  class="mr-1 h-4 w-4"
                />
                {{ attachment.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { PencilIcon, TrashIcon, DocumentIcon, LinkIcon } from '@heroicons/vue/24/outline'
import Card from '../../components/ui/Card.vue'
import Badge from '../../components/ui/Badge.vue'
import type { Task } from '../../types/task'

const props = defineProps<Task>()

const formatQuarter = (quarter: string) => {
  if (!quarter) return ''
  return quarter.replace('Q', '第') + '季度'
}

defineEmits<{
  (e: 'edit', task: Task): void
  (e: 'delete', id: number): void
}>()
</script>

<style scoped>
.task-card {
  @apply relative overflow-hidden;
}
</style>

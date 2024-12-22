<template>
  <div class="quarter-plan space-y-6">
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

    <!-- 干什么（目标） -->
    <GoalSection :period="currentQuarter" class="space-y-6" />

    <!-- 为什么干（价值） -->
    <ValueSection :period="currentQuarter" class="mt-12 space-y-6" />

    <!-- 如何干（路径与流程） -->
    <HowSection :period="currentQuarter" class="mt-12 space-y-6" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import GoalSection from '../goals/GoalSection.vue'
import ValueSection from '../values/ValueSection.vue'
import HowSection from '../how/HowSection.vue'

// 季度选项
const quarters = [
  { id: 'Q1', name: '2024年第1季度' },
  { id: 'Q2', name: '2024年第2季度' },
  { id: 'Q3', name: '2024年第3季度' },
  { id: 'Q4', name: '2024年第4季度' }
]
const currentQuarter = ref('Q1')
</script>

<style scoped>
.quarter-plan {
  @apply max-w-7xl mx-auto;
}
</style>       
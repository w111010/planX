<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900">为什么干（价值）</h2>
      <Button
        v-if="showViewExample"
        variant="outline"
        size="sm"
        @click="showExampleModal = true"
      >
        查看参考模板
      </Button>
    </div>

    <p class="text-gray-500">
      在此描述本周期行动与目标背后的深层意义和预期价值，包括对客户、团队和公司的裨益。清晰的价值陈述有助于团队理解行动方向并获得认同感。
    </p>
    
    <div class="space-y-6">
      <ValueCard
        v-for="type in valueTypes"
        :key="type.id"
        v-model="values[type.id]"
        :title="type.title"
        :placeholder="type.placeholder"
      />
    </div>

    <!-- 参考案例弹窗 -->
    <Modal
      v-if="showExampleModal"
      :title="currentExample?.title || '参考模板'"
      @close="closeExample"
    >
      <div class="space-y-4">
        <template v-if="currentExample">
          <p class="text-gray-600">{{ currentExample.content }}</p>
        </template>
        <template v-else>
          <div v-for="type in valueTypes" :key="type.id" class="space-y-2">
            <h4 class="font-medium text-gray-900">{{ type.title }}</h4>
            <p class="text-gray-600">{{ type.example }}</p>
          </div>
        </template>
      </div>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import ValueCard from './ValueCard.vue'

const valueTypes = [
  {
    id: 'customer',
    title: '客户价值',
    description: '描述本周期计划对客户体验提升、满意度提升、服务质量提高的具体意义。',
    placeholder: '例如：通过新产品上市满足客户潜在需求，提高重复购买率和口碑传播。',
    example: '通过提高客户满意度和加速交付时间，为客户带来更佳体验，并降低客户流失率。'
  },
  {
    id: 'team',
    title: '团队价值',
    description: '描述本周期计划对内部团队的成长、能力提升、士气增强的意义。',
    placeholder: '例如：通过培训计划提升销售人员专业度，让团队更高效协作，降低流失率并增强归属感。',
    example: '通过内训与新激励机制，让团队成员快速成长，提升整体产值。'
  },
  {
    id: 'company',
    title: '公司价值',
    description: '描述本周期计划如何促进公司整体战略目标达成。',
    placeholder: '例如：助力公司实现全年盈利目标，提升市场竞争力，并为明年战略扩张打下坚实基础。',
    example: '助力公司实现全年盈利目标，提升市场竞争力，并为明年战略扩张打下坚实基础。'
  }
]

// 值存储
const values = ref({
  customer: '',
  team: '',
  company: ''
})

// 示例模态框控制
const showExampleModal = ref(false)
const currentExample = ref<{
  title: string
  content: string
} | null>(null)

const showViewExample = ref(true)

// 显示特定类型的示例
const showTypeExample = (type: typeof valueTypes[0]) => {
  currentExample.value = {
    title: `${type.title}参考案例`,
    content: type.example
  }
  showExampleModal.value = true
}

// 关闭示例
const closeExample = () => {
  showExampleModal.value = false
  currentExample.value = null
}

// 检查是否所有值都已填写
const isComplete = computed(() => {
  return Object.values(values.value).every(value => value.trim() !== '')
})

defineExpose({
  isComplete,
  values
})
</script>
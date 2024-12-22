<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold text-gray-900">基本信息</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 年度计划名称 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          年度计划名称
        </label>
        <Input
          v-model="formData.planName"
          type="text"
          placeholder="输入年度计划名称"
        />
      </div>

      <!-- 年度 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          年度
        </label>
        <Input
          v-model="formData.year"
          type="number"
          placeholder="输入年度"
        />
      </div>

      <!-- 组号 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          组号
        </label>
        <Input
          v-model="formData.groupNumber"
          type="text"
          placeholder="输入组号"
        />
      </div>

      <!-- 得分 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          得分
        </label>
        <Input
          v-model.number="formData.score"
          type="number"
          placeholder="输入得分"
        />
      </div>

      <!-- 行业 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          行业
        </label>
        <Input
          v-model="formData.industry"
          type="text"
          placeholder="输入行业"
        />
      </div>

      <!-- 公司名称 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          公司名称
        </label>
        <Input
          v-model="formData.companyName"
          type="text"
          placeholder="输入公司名称"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '../ui/Input.vue'

interface BasicInfo {
  planName: string
  year: number | null
  groupNumber: string
  score: number | null
  industry: string
  companyName: string
}

const formData = ref<BasicInfo>({
  planName: '',
  year: new Date().getFullYear(),
  groupNumber: '',
  score: null,
  industry: '',
  companyName: ''
})
</script>

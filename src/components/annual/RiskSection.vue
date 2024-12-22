<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold text-gray-900">风险预案</h2>
      <Button
        variant="primary"
        size="sm"
        @click="showNewRiskModal = true"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        添加风险预案
      </Button>
    </div>

    <!-- 风险预案表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">风险点</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">对应维度/着力点</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">可能风险与后果</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">预备方案</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">支持者</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">完成时间</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">确认人</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="risk in risks" :key="risk.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{{ risk.riskPoint }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ risk.dimension }}</td>
            <td class="px-3 py-4 text-sm text-gray-900">{{ risk.consequence }}</td>
            <td class="px-3 py-4 text-sm text-gray-900">{{ risk.plan }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ risk.supporter }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ risk.completionTime }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ risk.confirmer }}</td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
              <button
                class="text-indigo-600 hover:text-indigo-900 mr-4"
                @click="handleEdit(risk)"
              >
                编辑
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="handleDelete(risk.id)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建/编辑风险预案弹窗 -->
    <BaseModal
      v-if="showNewRiskModal"
      v-model="showNewRiskModal"
      max-width="max-w-2xl"
    >
      <div class="space-y-4 p-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingRisk ? '编辑风险预案' : '新建风险预案' }}
        </h3>
        
        <div class="space-y-4">
          <!-- 风险点 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">风险点</label>
            <Input
              v-model="formData.riskPoint"
              type="text"
              placeholder="输入风险点"
            />
          </div>

          <!-- 对应维度/着力点 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">对应维度/着力点</label>
            <Input
              v-model="formData.dimension"
              type="text"
              placeholder="输入对应维度/着力点"
            />
          </div>

          <!-- 可能风险与后果 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">可能风险与后果</label>
            <textarea
              v-model="formData.consequence"
              rows="3"
              class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              placeholder="描述可能的风险与后果"
            ></textarea>
          </div>

          <!-- 预备方案 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">预备方案</label>
            <textarea
              v-model="formData.plan"
              rows="3"
              class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              placeholder="描述预备方案"
            ></textarea>
          </div>

          <!-- 支持者 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">支持者</label>
            <Input
              v-model="formData.supporter"
              type="text"
              placeholder="输入支持者"
            />
          </div>

          <!-- 完成时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">完成时间</label>
            <Input
              v-model="formData.completionTime"
              type="date"
            />
          </div>

          <!-- 确认人 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认人</label>
            <Input
              v-model="formData.confirmer"
              type="text"
              placeholder="输入确认人"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            @click="showNewRiskModal = false"
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
import { PlusIcon } from '@heroicons/vue/20/solid'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import BaseModal from '../ui/BaseModal.vue'

interface Risk {
  id: number
  riskPoint: string
  dimension: string
  consequence: string
  plan: string
  supporter: string
  completionTime: string
  confirmer: string
}

const risks = ref<Risk[]>([])
const showNewRiskModal = ref(false)
const editingRisk = ref<Risk | null>(null)

const formData = ref<Omit<Risk, 'id'>>({
  riskPoint: '',
  dimension: '',
  consequence: '',
  plan: '',
  supporter: '',
  completionTime: '',
  confirmer: ''
})

const handleEdit = (risk: Risk) => {
  editingRisk.value = risk
  formData.value = { ...risk }
  showNewRiskModal.value = true
}

const handleDelete = (id: number) => {
  if (confirm('确定要删除这条风险预案吗？')) {
    risks.value = risks.value.filter(r => r.id !== id)
  }
}

const handleSave = () => {
  if (editingRisk.value) {
    const index = risks.value.findIndex(r => r.id === editingRisk.value?.id)
    if (index !== -1) {
      risks.value[index] = {
        ...formData.value,
        id: editingRisk.value.id
      }
    }
  } else {
    const newId = Math.max(0, ...risks.value.map(r => r.id)) + 1
    risks.value.push({
      ...formData.value,
      id: newId
    })
  }
  showNewRiskModal.value = false
  editingRisk.value = null
  formData.value = {
    riskPoint: '',
    dimension: '',
    consequence: '',
    plan: '',
    supporter: '',
    completionTime: '',
    confirmer: ''
  }
}
</script>

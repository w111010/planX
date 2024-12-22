<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-bold text-gray-900">所需资源</h2>
      <Button
        variant="primary"
        size="sm"
        @click="showNewResourceModal = true"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        添加资源
      </Button>
    </div>

    <!-- 资源表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">业务流</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">对应维度/着力点</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">所需资源</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">提供方</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">到位时间</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">确认人</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="resource in resources" :key="resource.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{{ resource.businessFlow }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ resource.dimension }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ resource.resource }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ resource.provider }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ resource.arrivalTime }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{{ resource.confirmer }}</td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
              <button
                class="text-indigo-600 hover:text-indigo-900 mr-4"
                @click="handleEdit(resource)"
              >
                编辑
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="handleDelete(resource.id)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建/编辑资源弹窗 -->
    <BaseModal
      v-if="showNewResourceModal"
      v-model="showNewResourceModal"
      max-width="max-w-2xl"
    >
      <div class="space-y-4 p-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingResource ? '编辑资源' : '新建资源' }}
        </h3>
        
        <div class="space-y-4">
          <!-- 业务流 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">业务流</label>
            <Input
              v-model="formData.businessFlow"
              type="text"
              placeholder="输入业务流"
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

          <!-- 所需资源 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">所需资源</label>
            <Input
              v-model="formData.resource"
              type="text"
              placeholder="输入所需资源"
            />
          </div>

          <!-- 提供方 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">提供方</label>
            <Input
              v-model="formData.provider"
              type="text"
              placeholder="输入提供方"
            />
          </div>

          <!-- 到位时间 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">到位时间</label>
            <Input
              v-model="formData.arrivalTime"
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
            @click="showNewResourceModal = false"
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

interface Resource {
  id: number
  businessFlow: string
  dimension: string
  resource: string
  provider: string
  arrivalTime: string
  confirmer: string
}

const resources = ref<Resource[]>([])
const showNewResourceModal = ref(false)
const editingResource = ref<Resource | null>(null)

const formData = ref<Omit<Resource, 'id'>>({
  businessFlow: '',
  dimension: '',
  resource: '',
  provider: '',
  arrivalTime: '',
  confirmer: ''
})

const handleEdit = (resource: Resource) => {
  editingResource.value = resource
  formData.value = { ...resource }
  showNewResourceModal.value = true
}

const handleDelete = (id: number) => {
  if (confirm('确定要删除这条资源记录吗？')) {
    resources.value = resources.value.filter(r => r.id !== id)
  }
}

const handleSave = () => {
  if (editingResource.value) {
    const index = resources.value.findIndex(r => r.id === editingResource.value?.id)
    if (index !== -1) {
      resources.value[index] = {
        ...formData.value,
        id: editingResource.value.id
      }
    }
  } else {
    const newId = Math.max(0, ...resources.value.map(r => r.id)) + 1
    resources.value.push({
      ...formData.value,
      id: newId
    })
  }
  showNewResourceModal.value = false
  editingResource.value = null
  formData.value = {
    businessFlow: '',
    dimension: '',
    resource: '',
    provider: '',
    arrivalTime: '',
    confirmer: ''
  }
}
</script>

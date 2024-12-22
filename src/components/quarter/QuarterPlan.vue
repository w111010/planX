<template>
  <div class="space-y-8">
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

    <!-- 季度目标 -->
    <section class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">季度目标</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="goal in quarterGoals"
          :key="goal.id"
          class="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-900">{{ goal.title }}</h4>
            <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
              {{ goal.dimension }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="text-sm text-gray-500">目标值</div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded p-3">
                <div class="text-xs text-gray-500">保底值</div>
                <div class="mt-1 font-medium">{{ goal.baseValue }}{{ goal.unit }}</div>
              </div>
              <div class="bg-gray-50 rounded p-3">
                <div class="text-xs text-gray-500">冲刺值</div>
                <div class="mt-1 font-medium">{{ goal.stretchValue }}{{ goal.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关键任务 -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">关键任务</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showTaskModal = true"
        >
          添加任务
        </Button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="task in quarterTasks"
          :key="task.id"
          class="bg-white rounded-lg shadow-sm p-6 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="text-lg font-medium text-gray-900">{{ task.title }}</h4>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="text-gray-400 hover:text-gray-600"
                @click="editTask(task)"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="text-gray-400 hover:text-red-600"
                @click="deleteTask(task.id)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ task.description }}
          </div>
          <div class="mt-4 space-y-3">
            <!-- 进度条 -->
            <div>
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{{ task.startMonth }}</span>
                <span>{{ task.endMonth }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  :style="{ width: getMonthProgress(task.startMonth, task.endMonth) + '%' }"
                ></div>
              </div>
            </div>
            <!-- 任务信息 -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">负责人：{{ task.owner }}</span>
              <div class="flex gap-2">
                <span class="px-2 py-1 bg-gray-100 rounded text-xs">{{ task.dimension }}</span>
                <span v-if="task.focusPoint" class="px-2 py-1 bg-gray-100 rounded text-xs">{{ task.focusPoint }}</span>
                <span v-if="task.businessFlow" class="px-2 py-1 bg-gray-100 rounded text-xs">{{ task.businessFlow }}</span>
              </div>
            </div>
            <!-- 关键结果 -->
            <div v-if="task.keyResults && task.keyResults.length > 0" class="mt-2">
              <div class="text-xs text-gray-500 mb-1">关键结果</div>
              <div class="space-y-2">
                <div 
                  v-for="(kr, index) in task.keyResults" 
                  :key="index"
                  class="text-xs text-gray-600 bg-gray-50 p-2 rounded"
                >
                  {{ kr.name }} - {{ kr.classification }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <QuarterTaskModal
      v-model:isOpen="showTaskModal"
      :task="editingTask"
      :current-quarter="currentQuarter"
      @close="closeTaskModal"
      @submit="handleTaskSubmit"
    />

    <!-- 为什么干（价值） -->
    <section class="space-y-6">
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900">为什么干（价值）</h3>
          <Button
            variant="outline"
            size="sm"
            @click="showWhyExample = true"
          >
            查看参考模板
          </Button>
        </div>
      </div>

      <p class="text-gray-500">
        在此描述本季度行动与目标背后的深层意义和预期价值，包括对客户、团队和公司的裨益。清晰的价值陈述有助于团队理解行动方向并获得认同感。
      </p>
      
      <div class="space-y-6">
        <div v-for="type in valueTypes" :key="type.id" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">{{ type.title }}</label>
          <textarea
            v-model="values[type.id]"
            rows="3"
            class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
            :placeholder="type.placeholder"
          />
        </div>
      </div>
    </section>

    <!-- 如何干（路径与流程） -->
    <section class="space-y-6">
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900">如何干（路径与流程）</h3>
          <Button
            variant="outline"
            size="sm"
            @click="showHowExample = true"
          >
            查看参考模板
          </Button>
        </div>
      </div>

      <p class="text-gray-500">
        在此明确本季度目标的具体实施路径，包括管理思维、过程管理和结果管理三个层面。清晰的执行路径有助于团队明确方向并有效推进。
      </p>
      
      <textarea
        v-model="howText"
        rows="6"
        class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
        placeholder="在此填写执行路径与步骤，建议包含：&#10;1. 管理思维：目标管理、过程管理、结果管理&#10;2. 过程管理：追战略、追计划、追进度等九大追踪要素&#10;3. 结果管理：复盘业务与团队，发展团队，奖优罚劣"
      />
    </section>

    <!-- 参考案例弹窗 -->
    <Modal
      v-if="showWhyExample"
      title="价值参考模板"
      @close="showWhyExample = false"
    >
      <div class="space-y-4">
        <div v-for="type in valueTypes" :key="type.id" class="space-y-2">
          <h4 class="font-medium text-gray-900">{{ type.title }}</h4>
          <p class="text-gray-600">{{ type.example }}</p>
        </div>
      </div>
    </Modal>

    <Modal
      v-if="showHowExample"
      title="执行路径参考模板"
      @close="showHowExample = false"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <h4 class="font-medium text-gray-900">管理思维</h4>
          <p class="text-gray-600">设定目标、拆解目标、建立仪表盘、制定绩效、分析达成情况</p>
        </div>
        <div class="space-y-2">
          <h4 class="font-medium text-gray-900">过程管理</h4>
          <p class="text-gray-600">追战略(01)、追计划(02)、追进度(03)、追流程(04)、追工具(05)、追技能(06)、追习惯(07)、追氛围(08)、追机制(09)</p>
        </div>
        <div class="space-y-2">
          <h4 class="font-medium text-gray-900">结果管理</h4>
          <p class="text-gray-600">复盘业务与团队，发展团队，奖优罚劣</p>
        </div>
      </div>
    </Modal>

    <!-- 所需资源 -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">所需资源</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showResourceSection = !showResourceSection"
        >
          {{ showResourceSection ? '收起' : '展开' }}
        </Button>
      </div>
      
      <div v-if="showResourceSection" class="space-y-4">
        <p class="text-gray-500">
          列出实现本季度目标所需的关键资源，包括人力、物力、财力等方面的具体需求。
        </p>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">人力资源</label>
            <textarea
              v-model="resources.human"
              rows="3"
              class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
              placeholder="例如：需要增加2名开发人员，1名产品经理..."
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">物力资源</label>
            <textarea
              v-model="resources.material"
              rows="3"
              class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
              placeholder="例如：新增服务器2台，办公设备升级..."
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">财务预算</label>
            <textarea
              v-model="resources.financial"
              rows="3"
              class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
              placeholder="例如：研发预算200万，市场推广预算100万..."
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 风险预案 -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">风险预案</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showRiskSection = !showRiskSection"
        >
          {{ showRiskSection ? '收起' : '展开' }}
        </Button>
      </div>
      
      <div v-if="showRiskSection" class="space-y-4">
        <p class="text-gray-500">
          识别并列出可能影响季度目标达成的主要风险，以及相应的应对措施。
        </p>
        
        <div class="space-y-4">
          <div v-for="(risk, index) in risks" :key="index" class="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="space-y-2 flex-grow">
                <input
                  v-model="risk.title"
                  type="text"
                  class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
                  placeholder="风险描述"
                />
                <textarea
                  v-model="risk.solution"
                  rows="2"
                  class="block w-full bg-white text-gray-900 border border-gray-300 rounded-md p-2"
                  placeholder="应对措施"
                />
              </div>
              <button
                v-if="risks.length > 1"
                type="button"
                class="ml-2 text-gray-400 hover:text-red-600"
                @click="removeRisk(index)"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            @click="addRisk"
          >
            添加风险项
          </Button>
        </div>
      </div>
    </section>

    <!-- 里程碑 -->
    <section class="space-y-4">
      <h3 class="text-2xl font-bold text-gray-900">里程碑</h3>
      <div class="relative">
        <div class="absolute top-0 bottom-0 left-6 w-px bg-gray-200"></div>
        <ul class="space-y-6">
          <li
            v-for="milestone in quarterMilestones"
            :key="milestone.id"
            class="relative pl-14"
          >
            <div 
              class="absolute left-4 top-1 h-4 w-4 rounded-full border-2 border-indigo-600"
              :class="milestone.completed ? 'bg-indigo-600' : 'bg-white'"
            ></div>
            <div class="bg-white rounded-lg shadow-sm p-4">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-900">{{ milestone.title }}</h4>
                <span class="text-sm text-gray-500">{{ milestone.date }}</span>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ milestone.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/20/solid'
import QuarterTaskModal from './QuarterTaskModal.vue'
import type { Task } from '../../types/task'

// 月份映射
const MONTH_MAPPING = {
  'Q1': { '1月': 1, '2月': 2, '3月': 3 },
  'Q2': { '4月': 4, '5月': 5, '6月': 6 },
  'Q3': { '7月': 7, '8月': 8, '9月': 9 },
  'Q4': { '10月': 10, '11月': 11, '12月': 12 }
}

// 价值类型定义
const valueTypes = [
  {
    id: 'customer',
    title: '客户价值',
    description: '描述本季度计划对客户体验提升、满意度提升、服务质量提高的具体意义。',
    placeholder: '例如：通过新产品上市满足客户潜在需求，提高重复购买率和口碑传播。',
    example: '通过提高客户满意度和加速交付时间，为客户带来更佳体验，并降低客户流失率。'
  },
  {
    id: 'team',
    title: '团队价值',
    description: '描述本季度计划对内部团队的成长、能力提升、士气增强的意义。',
    placeholder: '例如：通过培训计划提升销售人员专业度，让团队更高效协作，降低流失率并增强归属感。',
    example: '通过内训与新激励机制，让团队成员快速成长，提升整体产值。'
  },
  {
    id: 'company',
    title: '公司价值',
    description: '描述本季度计划如何促进公司整体战略目标达成。',
    placeholder: '例如：助力公司实现季度盈利目标，提升市场竞争力，并为下季度战略扩张打下坚实基础。',
    example: '助力公司实现季度盈利目标，提升市场竞争力，并为下季度战略扩张打下坚实基础。'
  }
]

// 示例模态框控制
const showWhyExample = ref(false)
const showHowExample = ref(false)

// 季度规划文本
const values = ref({
  customer: '',
  team: '',
  company: ''
})
const howText = ref('')

// 季度选项
const quarters = [
  { id: 'Q1', name: '第一季度' },
  { id: 'Q2', name: '第二季度' },
  { id: 'Q3', name: '第三季度' },
  { id: 'Q4', name: '第四季度' },
]

const currentQuarter = ref('Q1')

// 资源和风险管理
const showResourceSection = ref(false)
const showRiskSection = ref(false)

const resources = ref({
  human: '',
  material: '',
  financial: ''
})

const risks = ref([
  {
    title: '',
    solution: ''
  }
])

function addRisk() {
  risks.value.push({
    title: '',
    solution: ''
  })
}

function removeRisk(index: number) {
  risks.value.splice(index, 1)
}

// 获取月份进度
function getMonthProgress(startMonth: string, endMonth: string): number {
  const quarterMatch = currentQuarter.value.match(/Q(\d)/)
  if (!quarterMatch) return 0
  
  const monthMap = MONTH_MAPPING[`Q${quarterMatch[1]}`] || {}
  const startMonthNum = monthMap[startMonth]
  const endMonthNum = monthMap[endMonth]
  if (!startMonthNum || !endMonthNum) return 0

  const totalMonths = 3 // 每季度3个月
  const monthsSpent = endMonthNum - startMonthNum + 1
  return Math.min((monthsSpent / totalMonths) * 100, 100)
}

// 示例数据
const quarterGoals = [
  {
    id: 1,
    title: '提升产品质量',
    dimension: '产品',
    baseValue: 95,
    stretchValue: 98,
    unit: '%'
  },
  // ... 更多目标
]

// 任务相关状态
const showTaskModal = ref(false)
const editingTask = ref<Task | undefined>()
const quarterTasks = ref<Task[]>([
  {
    id: 1,
    title: '优化产品性能',
    description: '提升核心功能的响应速度',
    owner: '张三',
    startMonth: '1月',
    endMonth: '3月',
    dimension: '产品',
    focusPoint: 'performance',
    businessFlow: 'development',
    keyResults: []
  }
])

// 任务操作方法
function editTask(task: Task) {
  editingTask.value = task
  showTaskModal.value = true
}

function deleteTask(taskId: number) {
  const index = quarterTasks.value.findIndex(t => t.id === taskId)
  if (index > -1) {
    quarterTasks.value.splice(index, 1)
  }
}

function closeTaskModal() {
  showTaskModal.value = false
  editingTask.value = undefined
}

function handleTaskSubmit(task: Task) {
  if (editingTask.value) {
    const index = quarterTasks.value.findIndex(t => t.id === task.id)
    if (index > -1) {
      quarterTasks.value[index] = task
    }
  } else {
    quarterTasks.value.push(task)
  }
  closeTaskModal()
}

const quarterMilestones = [
  {
    id: 1,
    title: '完成产品升级',
    description: '发布新版本，包含性能优化和新功能',
    date: '2024-03-15',
    completed: true
  },
  // ... 更多里程碑
]
</script>                   
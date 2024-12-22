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
    <GoalSection :period="currentQuarter" />

    <!-- 为什么干（价值） -->
    <ValueSection :period="currentQuarter" />

    <!-- 如何干（路径与流程） -->
    <HowSection :period="currentQuarter" />
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

      <!-- 管理思维与解码 -->
      <div class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h4 class="font-medium text-gray-900">管理思维与解码</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">目标管理：</span>
            <span class="text-sm text-gray-600">设定目标、拆解目标、建立仪表盘、制定绩效、分析达成情况</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">过程管理：</span>
            <span class="text-sm text-gray-600">追战略(01)、追计划(02)、追进度(03)、追流程(04)、追工具(05)、追技能(06)、追习惯(07)、追氛围(08)、追机制(09)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">结果管理：</span>
            <span class="text-sm text-gray-600">复盘业务与团队，发展团队，奖优罚劣</span>
          </div>
        </div>
      </div>

      <!-- 维度执行路径表格 -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-3 border-b border-gray-200">维度</th>
              <th class="p-3 border-b border-gray-200">着力点</th>
              <th class="p-3 border-b border-gray-200">对应业务流</th>
              <th class="p-3 border-b border-gray-200">关键环节</th>
              <th class="p-3 border-b border-gray-200">实施步骤</th>
              <th class="p-3 border-b border-gray-200">责任人</th>
              <th class="p-3 border-b border-gray-200">时间节点</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="dimension in DIMENSION_LIST"
              :key="dimension"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="p-3">
                <div class="flex items-center gap-2">
                  <component :is="getDimensionIcon(dimension)" class="h-5 w-5 text-gray-400" />
                  <span>{{ dimension }}</span>
                </div>
              </td>
              <td class="p-3">
                <select
                  v-model="howData[dimension].focusPoint"
                  class="block w-full rounded-md border-gray-300 text-sm"
                >
                  <option v-for="point in FOCUS_POINTS[dimension]" :key="point.name" :value="point.name">
                    {{ point.name }}
                  </option>
                </select>
              </td>
              <td class="p-3">
                <select
                  v-model="howData[dimension].businessFlow"
                  class="block w-full rounded-md border-gray-300 text-sm"
                >
                  <option v-for="flow in BUSINESS_FLOWS[dimension]" :key="flow" :value="flow">
                    {{ flow }}
                  </option>
                </select>
              </td>
              <td class="p-3">
                <textarea
                  v-model="howData[dimension].keySteps"
                  rows="2"
                  class="block w-full rounded-md border-gray-300 text-sm"
                  :placeholder="`${dimension}关键环节...`"
                />
              </td>
              <td class="p-3">
                <textarea
                  v-model="howData[dimension].implementation"
                  rows="2"
                  class="block w-full rounded-md border-gray-300 text-sm"
                  :placeholder="`Q${currentQuarter.slice(1)}实施步骤...`"
                />
              </td>
              <td class="p-3">
                <input
                  v-model="howData[dimension].owner"
                  type="text"
                  class="block w-full rounded-md border-gray-300 text-sm"
                  placeholder="负责人"
                />
              </td>
              <td class="p-3">
                <input
                  v-model="howData[dimension].timeline"
                  type="text"
                  class="block w-full rounded-md border-gray-300 text-sm"
                  :placeholder="`Q${currentQuarter.slice(1)}时间节点`"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    <section class="space-y-6">
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

      <p class="text-gray-500">
        在本模块中明确完成季度目标所需的资源，包括人力资源（内部/外部专业人士）、资金投入（研发经费、推广费）、工具与系统（ERP、CRM等）、培训与外部咨询服务等。资源需对应到具体的业务流和时间节点上。
      </p>

      <div v-if="showResourceSection" class="space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="p-3 border-b border-gray-200">业务流</th>
                <th class="p-3 border-b border-gray-200">对应维度/着力点</th>
                <th class="p-3 border-b border-gray-200">所需资源</th>
                <th class="p-3 border-b border-gray-200">提供方</th>
                <th class="p-3 border-b border-gray-200">到位时间</th>
                <th class="p-3 border-b border-gray-200">确认人</th>
                <th class="p-3 border-b border-gray-200">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(resource, index) in resourceList"
                :key="index"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="p-3">
                  <select
                    v-model="resource.businessFlow"
                    class="block w-full rounded-md border-gray-300 text-sm"
                  >
                    <option
                      v-for="flow in BUSINESS_FLOWS[resource.dimension]"
                      :key="flow"
                      :value="flow"
                    >
                      {{ flow }}
                    </option>
                  </select>
                </td>
                <td class="p-3">
                  <div class="space-y-2">
                    <select
                      v-model="resource.dimension"
                      class="block w-full rounded-md border-gray-300 text-sm"
                      @change="handleResourceDimensionChange(index)"
                    >
                      <option v-for="dim in DIMENSION_LIST" :key="dim" :value="dim">
                        {{ dim }}
                      </option>
                    </select>
                    <select
                      v-model="resource.focusPoint"
                      class="block w-full rounded-md border-gray-300 text-sm"
                    >
                      <option
                        v-for="point in FOCUS_POINTS[resource.dimension]"
                        :key="point.name"
                        :value="point.name"
                      >
                        {{ point.name }}
                      </option>
                    </select>
                  </div>
                </td>
                <td class="p-3">
                  <textarea
                    v-model="resource.resources"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="所需资源描述..."
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="resource.provider"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="资源提供方"
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="resource.timeline"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    :placeholder="`Q${currentQuarter.slice(1)}时间节点`"
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="resource.confirmer"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="确认人"
                  />
                </td>
                <td class="p-3">
                  <Button
                    v-if="resourceList.length > 1"
                    variant="ghost"
                    size="sm"
                    @click="removeResource(index)"
                  >
                    删除
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Button
          variant="outline"
          size="sm"
          @click="addResource"
        >
          添加资源项
        </Button>
      </div>
    </section>

    <!-- 风险预案 -->
    <section class="space-y-6">
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

      <p class="text-gray-500">
        明确季度目标推进过程中可能出现的风险及后果，并提前制定相应的预备方案和紧急措施。结合五大维度的重点环节，将风险管控纳入季度计划中。
      </p>

      <div v-if="showRiskSection" class="space-y-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50">
                <th class="p-3 border-b border-gray-200">风险点</th>
                <th class="p-3 border-b border-gray-200">对应维度/着力点</th>
                <th class="p-3 border-b border-gray-200">可能风险与后果</th>
                <th class="p-3 border-b border-gray-200">预备方案</th>
                <th class="p-3 border-b border-gray-200">支持者</th>
                <th class="p-3 border-b border-gray-200">完成时间</th>
                <th class="p-3 border-b border-gray-200">确认人</th>
                <th class="p-3 border-b border-gray-200">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(risk, index) in riskList"
                :key="index"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="p-3">
                  <input
                    v-model="risk.riskPoint"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="风险点描述..."
                  />
                </td>
                <td class="p-3">
                  <div class="space-y-2">
                    <select
                      v-model="risk.dimension"
                      class="block w-full rounded-md border-gray-300 text-sm"
                      @change="handleRiskDimensionChange(index)"
                    >
                      <option v-for="dim in DIMENSION_LIST" :key="dim" :value="dim">
                        {{ dim }}
                      </option>
                    </select>
                    <select
                      v-model="risk.focusPoint"
                      class="block w-full rounded-md border-gray-300 text-sm"
                    >
                      <option
                        v-for="point in FOCUS_POINTS[risk.dimension]"
                        :key="point.name"
                        :value="point.name"
                      >
                        {{ point.name }}
                      </option>
                    </select>
                  </div>
                </td>
                <td class="p-3">
                  <textarea
                    v-model="risk.consequences"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="可能的风险与后果..."
                  />
                </td>
                <td class="p-3">
                  <textarea
                    v-model="risk.mitigation"
                    rows="2"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="预备方案与应对措施..."
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="risk.supporter"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="支持者"
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="risk.timeline"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    :placeholder="`Q${currentQuarter.slice(1)}时间节点`"
                  />
                </td>
                <td class="p-3">
                  <input
                    v-model="risk.confirmer"
                    type="text"
                    class="block w-full rounded-md border-gray-300 text-sm"
                    placeholder="确认人"
                  />
                </td>
                <td class="p-3">
                  <Button
                    v-if="riskList.length > 1"
                    variant="ghost"
                    size="sm"
                    @click="removeRisk(index)"
                  >
                    删除
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Button
          variant="outline"
          size="sm"
          @click="addRisk"
        >
          添加风险项
        </Button>
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
import { ref } from 'vue'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import GoalSection from '../goals/GoalSection.vue'
import ValueSection from '../values/ValueSection.vue'
import HowSection from '../how/HowSection.vue'

// 季度选择相关
const quarters = [
  { id: 'Q1', name: '2024年第1季度' },
  { id: 'Q2', name: '2024年第2季度' },
  { id: 'Q3', name: '2024年第3季度' },
  { id: 'Q4', name: '2024年第4季度' }
]
const currentQuarter = ref('Q1')
</script>   
<template>
  <div class="space-y-8">
    <!-- 基本信息 -->
    <section class="space-y-4 bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold mb-2">基本信息</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-500">年度计划名称</label>
          <input
            v-model="basicInfo.planName"
            type="text"
            class="block w-full rounded-md border-gray-300 text-sm"
            placeholder="输入计划名称"
          />
        </div>
        <div>
          <label class="text-sm text-gray-500">年度</label>
          <input
            v-model="basicInfo.planYear"
            type="text"
            class="block w-full rounded-md border-gray-300 text-sm"
            placeholder="2024"
          />
        </div>
        <div>
          <label class="text-sm text-gray-500">组号</label>
          <input
            v-model="basicInfo.groupNumber"
            type="text"
            class="block w-full rounded-md border-gray-300 text-sm"
            placeholder="输入组号"
          />
        </div>
        <div>
          <label class="text-sm text-gray-500">得分</label>
          <input
            v-model="basicInfo.score"
            type="text"
            class="block w-full rounded-md border-gray-300 text-sm"
            placeholder="输入得分"
          />
        </div>
      </div>
    </section>

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
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold text-gray-900">季度目标</h3>
        <Button
          variant="outline"
          size="sm"
          @click="showGoalExample = true"
        >
          查看参考模板
        </Button>
      </div>
      
      <p class="text-gray-500">
        在此明确季度总目标及各维度核心指标，以数字化、可衡量的方式体现目标。目标从五大维度设定，着力点为"三升一降"原则。
      </p>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-3 border-b border-gray-200">维度</th>
              <th class="p-3 border-b border-gray-200">着力点</th>
              <th class="p-3 border-b border-gray-200">指标名称</th>
              <th class="p-3 border-b border-gray-200">单位</th>
              <th class="p-3 border-b border-gray-200">上年同期</th>
              <th class="p-3 border-b border-gray-200">季度目标</th>
              <th class="p-3 border-b border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="goal in dimensionGoals || []"
              :key="goal.id"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="p-3">
                <div class="flex items-center gap-2">
                  <component :is="getDimensionIcon(goal.dimension)" class="h-5 w-5 text-gray-400" />
                  <span>{{ goal.dimension }}</span>
                </div>
              </td>
              <td class="p-3">{{ goal.focusPoint }}</td>
              <td class="p-3">{{ goal.title }}</td>
              <td class="p-3">{{ goal.unit }}</td>
              <td class="p-3">{{ goal.previousValue || '-' }}</td>
              <td class="p-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs text-gray-500">保底值</div>
                    <div class="mt-1">{{ goal.baseValue || '-' }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">冲刺值</div>
                    <div class="mt-1">{{ goal.stretchValue || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  @click="editGoal(goal)"
                >
                  编辑
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 目标参考模板 -->
    <Modal
      v-if="showGoalExample"
      title="目标设定参考模板"
      @close="showGoalExample = false"
    >
      <div class="space-y-6">
        <p class="text-gray-600">
          目标设定应遵循"三升一降"原则，从五大维度出发，确保目标具体、可衡量、可实现。
        </p>
        
        <div v-for="preset in PRESET_GOALS || []" :key="preset.dimension" class="space-y-4">
          <h4 class="font-medium text-gray-900">{{ preset.dimension }}</h4>
          <div class="space-y-2">
            <div v-for="goal in preset.goals" :key="goal.title" class="bg-gray-50 p-3 rounded">
              <div class="text-sm text-gray-900">{{ goal.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ goal.hint }}</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

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
          v-for="task in quarterTasks || []"
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
                  :style="{ width: (task.startMonth && task.endMonth ? getMonthProgress(task.startMonth, task.endMonth) : 0) + '%' }"
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
import { ref, computed } from 'vue'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'
import QuarterTaskModal from './QuarterTaskModal.vue'
import { 
  PencilIcon, 
  TrashIcon,
  CubeIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  BanknotesIcon
} from '@heroicons/vue/20/solid'
import { DIMENSIONS, DIMENSION_LIST, FOCUS_POINTS, PRESET_GOALS } from '../../constants/dimensions'
import { BUSINESS_FLOWS } from '../../constants/businessFlows'
import type { Goal } from '../../types/goal'
import type { Task } from '../../types/task'

// 基本信息
const basicInfo = ref({
  planName: '',
  planYear: '2024',
  groupNumber: '',
  score: '',
})

import { MONTH_MAPPING } from '../../constants/months'

// 季度选择相关
const quarters = [
  { id: 'Q1', name: '2024年第1季度' },
  { id: 'Q2', name: '2024年第2季度' },
  { id: 'Q3', name: '2024年第3季度' },
  { id: 'Q4', name: '2024年第4季度' }
]
const currentQuarter = ref('Q1')

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
// 维度执行路径数据
const howData = ref(
  DIMENSION_LIST.reduce((acc, dimension) => ({
    ...acc,
    [dimension]: {
      focusPoint: FOCUS_POINTS[dimension]?.[0]?.name ?? '',
      businessFlow: BUSINESS_FLOWS[dimension]?.[0] ?? '',
      keySteps: '',
      implementation: '',
      owner: '',
      timeline: ''
    }
  }), {})
)

// 资源和风险管理
const showResourceSection = ref(false)
const showRiskSection = ref(false)

// 资源列表数据
const resourceList = ref([
  {
    dimension: DIMENSION_LIST[0] ?? '',
    focusPoint: FOCUS_POINTS[DIMENSION_LIST[0]]?.[0]?.name ?? '',
    businessFlow: BUSINESS_FLOWS[DIMENSION_LIST[0]]?.[0] ?? '',
    resources: '',
    provider: '',
    timeline: '',
    confirmer: ''
  }
])

// 资源相关方法
function addResource() {
  const defaultDimension = DIMENSION_LIST[0]
  resourceList.value.push({
    dimension: defaultDimension,
    focusPoint: FOCUS_POINTS[defaultDimension][0].name,
    businessFlow: BUSINESS_FLOWS[defaultDimension][0],
    resources: '',
    provider: '',
    timeline: '',
    confirmer: ''
  })
}

function removeResource(index: number) {
  resourceList.value.splice(index, 1)
}

function handleResourceDimensionChange(index: number) {
  const resource = resourceList.value[index]
  resource.focusPoint = FOCUS_POINTS[resource.dimension][0].name
  resource.businessFlow = BUSINESS_FLOWS[resource.dimension][0]
}

// 风险列表数据
const riskList = ref([
  {
    dimension: DIMENSION_LIST[0] ?? '',
    focusPoint: FOCUS_POINTS[DIMENSION_LIST[0]]?.[0]?.name ?? '',
    riskPoint: '',
    consequences: '',
    mitigation: '',
    supporter: '',
    timeline: '',
    confirmer: ''
  }
])

// 风险相关方法
function addRisk() {
  const defaultDimension = DIMENSION_LIST[0]
  riskList.value.push({
    dimension: defaultDimension,
    focusPoint: FOCUS_POINTS[defaultDimension][0].name,
    riskPoint: '',
    consequences: '',
    mitigation: '',
    supporter: '',
    timeline: '',
    confirmer: ''
  })
}

function removeRisk(index: number) {
  riskList.value.splice(index, 1)
}

function handleRiskDimensionChange(index: number) {
  const risk = riskList.value[index]
  risk.focusPoint = FOCUS_POINTS[risk.dimension][0].name
}

// 获取月份进度
function getMonthProgress(startMonth: string, endMonth: string): number {
  if (!currentQuarter.value) return 0
  const quarterNum = currentQuarter.value.slice(1)
  if (!quarterNum) return 0
  
  const monthMap = MONTH_MAPPING[`Q${quarterNum}`] || {}
  const startMonthNum = monthMap[startMonth]
  const endMonthNum = monthMap[endMonth]
  if (!startMonthNum || !endMonthNum) return 0

  const totalMonths = 3 // 每季度3个月
  const monthsSpent = endMonthNum - startMonthNum + 1
  return Math.min((monthsSpent / totalMonths) * 100, 100)
}

// 维度目标数据
const dimensionGoals = ref<Goal[]>(
  PRESET_GOALS.flatMap(preset => 
    preset.goals.map((goal, index) => ({
      id: Math.random(),
      title: goal.title,
      dimension: preset.dimension,
      focusPoint: FOCUS_POINTS[preset.dimension][0].name,
      unit: goal.unit,
      baseValue: null,
      stretchValue: null,
      previousValue: null,
      hint: goal.hint
    }))
  )
)

// 获取维度图标
function getDimensionIcon(dimension: string) {
  switch(dimension) {
    case DIMENSIONS.PRODUCT:
      return CubeIcon
    case DIMENSIONS.CUSTOMER:
      return UserGroupIcon
    case DIMENSIONS.CHANNEL:
      return BuildingStorefrontIcon
    case DIMENSIONS.TEAM:
      return UsersIcon
    case DIMENSIONS.FINANCE:
      return BanknotesIcon
    default:
      return CubeIcon
  }
}

// 编辑目标
function editGoal(goal: Goal) {
  // TODO: Implement goal editing modal
  console.log('Edit goal:', goal)
}

// 显示目标示例
const showGoalExample = ref(false)

// 任务相关状态

// 任务相关状态
const showTaskModal = ref(false)
const editingTask = ref<Task | undefined>()
const quarterTasks = ref<Task[]>([])

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
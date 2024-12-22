import { DIMENSIONS } from './dimensions'
import type { Task } from '../types/task'

export const QUARTERLY_TASKS: Task[] = [
  {
    id: 1,
    title: '市场调研分析',
    owner: '王经理',
    startMonth: 4,  // First month of Q2
    endMonth: 6,    // Last month of Q2
    description: '针对目标市场进行深入调研，分析客户需求和竞争态势',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c1',
    businessFlow: 'c3',
    keyResults: [
      {
        name: '完成市场调研报告',
        type: '事件',
        metrics: [
          { name: '调研样本量', target: 1000, unit: '份' },
          { name: '覆盖目标客户群', target: 80, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '调研方案', url: '/docs/research-plan.pdf' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '销售团队培训',
    owner: '李总',
    startMonth: 5,  // Second month of Q2
    endMonth: 6,    // Last month of Q2
    description: '提升销售团队的产品知识和销售技能',
    dimension: DIMENSIONS.TEAM,
    focusPoint: 't2',
    businessFlow: 't4',
    keyResults: [
      {
        name: '完成培训课程',
        type: '技能',
        metrics: [
          { name: '培训覆盖率', target: 100, unit: '%' },
          { name: '考核通过率', target: 90, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '培训大纲', url: '/docs/training-outline.pdf' }
        ]
      }
    ]
  }
]

import { DIMENSIONS } from './dimensions'
import type { Task } from '../types/task'

export const MONTHLY_TASKS: Task[] = [
  {
    id: 1,
    title: '客户回访计划',
    owner: '张三',
    startWeek: 1,
    endWeek: 2,
    weeklyProgress: [
      { week: 1, status: '进行中', completion: 50 },
      { week: 2, status: '未开始', completion: 0 }
    ],
    description: '对重点客户进行定期回访和需求跟进',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c2',
    businessFlow: 'c3',
    keyResults: [
      {
        name: '完成客户回访',
        type: '事件',
        metrics: [
          { name: '回访完成率', target: 100, unit: '%' },
          { name: '客户满意度', target: 90, unit: '分' }
        ],
        attachments: [
          { type: 'file', name: '回访记录表', url: '/docs/visit-log.pdf' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '产品测试',
    owner: '李四',
    startWeek: 2,
    endWeek: 3,
    weeklyProgress: [
      { week: 2, status: '未开始', completion: 0 },
      { week: 3, status: '未开始', completion: 0 }
    ],
    description: '进行新功能测试和bug修复',
    dimension: DIMENSIONS.PRODUCT,
    focusPoint: 'p1',
    businessFlow: 'p2',
    keyResults: [
      {
        name: '完成功能测试',
        type: '事件',
        metrics: [
          { name: '测试用例覆盖率', target: 95, unit: '%' },
          { name: '关键bug修复率', target: 100, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '测试报告', url: '/docs/test-report.pdf' }
        ]
      }
    ]
  }
]

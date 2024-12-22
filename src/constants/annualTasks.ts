import { DIMENSIONS } from './dimensions'
import type { Task } from '../types/task'

export const ANNUAL_TASKS: Task[] = [
  {
    id: 1,
    title: '开发新一代产品原型',
    owner: '张工',
    startQuarter: 'Q1',
    endQuarter: 'Q2',
    description: '基于市场调研结果，开发下一代产品原型，提升核心竞争力',
    dimension: DIMENSIONS.PRODUCT,
    focusPoint: 'p2',
    businessFlow: 'p4',
    keyResults: [
      {
        name: '完成产品原型开发',
        type: '事件',
        metrics: [
          { name: '用户体验评分', target: 90, unit: '分' },
          { name: '性能提升', target: 50, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '产品原型设计文档', url: '/docs/prototype.pdf' },
          { type: 'link', name: '原型演示地址', url: 'https://demo.example.com' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '大客户开发计划',
    owner: '李总',
    startQuarter: 'Q2',
    endQuarter: 'Q4',
    description: '针对重点行业，开发和维护核心大客户',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c1',
    businessFlow: 'c4',
    keyResults: [
      {
        name: '建立大客户服务体系',
        type: '机制',
        metrics: [
          { name: '大客户满意度', target: 95, unit: '%' },
          { name: '响应时效', target: 2, unit: '小时' }
        ],
        attachments: [
          { type: 'file', name: '服务体系方案', url: '/docs/service.pdf' }
        ]
      }
    ]
  }
]
import { DIMENSIONS } from './dimensions'
import type { Task } from '../types/task'

export const SAMPLE_TASKS: Task[] = [
  {
    id: 1,
    title: '开发新一代产品原型',
    owner: '张工',
    startDate: '',  // Deprecated
    endDate: '',    // Deprecated
    startMonth: 1,  // Q1
    endMonth: 3,    // Q1
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
      },
      {
        name: '建立产品研发流程',
        type: '流程',
        metrics: [
          { name: '研发周期缩短', target: 30, unit: '%' },
          { name: '一次性通过率', target: 95, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '研发流程文档', url: '/docs/process.pdf' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '大客户开发计划',
    owner: '李总',
    startDate: '',  // Deprecated
    endDate: '',    // Deprecated
    startMonth: 1,  // Q1
    endMonth: 3,    // Q1 (adjusted to stay within quarter)
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
      },
      {
        name: '销售团队能力提升',
        type: '技能',
        metrics: [
          { name: '人均产值', target: 500, unit: '万元' },
          { name: '成交转化率', target: 35, unit: '%' }
        ],
        attachments: [
          { type: 'file', name: '培训计划', url: '/docs/training.pdf' },
          { type: 'link', name: '在线课程', url: 'https://course.example.com' }
        ]
      }
    ]
  }
]

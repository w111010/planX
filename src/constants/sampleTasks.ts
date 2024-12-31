import { DIMENSIONS } from './dimensions'
import type { Task } from '../types/task'

export const SAMPLE_TASKS: Task[] = [
  {
    id: 1,
    title: '开发新一代产品原型',
    owner: '张工',
    startDate: '2024-03-31', // Q1
    endDate: '2024-06-30',   // Q2
    description: '基于市场调研结果，开发下一代产品原型，提升核心竞争力',
    dimension: DIMENSIONS.PRODUCT,
    focusPoint: 'p2',
    businessFlow: 'p4',
    keyResults: {
      description: '完成产品原型开发并通过内部评审',
      metrics: [
        { name: '用户体验评分', target: 90, unit: '分' },
        { name: '性能提升', target: 50, unit: '%' },
        { name: '成本降低', target: 30, unit: '%' }
      ]
    }
  },
  {
    id: 2,
    title: '大客户开发计划',
    owner: '李总',
    startDate: '2024-03-31', // Q1
    endDate: '2024-12-31',   // Q4
    description: '针对重点行业，开发和维护核心大客户',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c1',
    businessFlow: 'c4',
    keyResults: {
      description: '完成年度大客户开发目标',
      metrics: [
        { name: '新增大客户数', target: 10, unit: '个' },
        { name: '大客户收入', target: 1000, unit: '万元' },
        { name: '客户满意度', target: 95, unit: '%' }
      ]
    }
  },
  {
    id: 3,
    title: '渠道伙伴激励计划',
    owner: '王经理',
    startDate: '2024-03-31', // Q1
    endDate: '2024-09-30',   // Q3
    description: '设计并实施渠道伙伴激励方案，提升渠道活跃度',
    dimension: DIMENSIONS.CHANNEL,
    focusPoint: 'ch2',
    businessFlow: 'ch9',
    keyResults: {
      description: '提升渠道伙伴积极性和销售业绩',
      metrics: [
        { name: '渠道活跃率', target: 85, unit: '%' },
        { name: '渠道销售额', target: 2000, unit: '万元' },
        { name: '渠道满意度', target: 90, unit: '%' }
      ]
    }
  }
]
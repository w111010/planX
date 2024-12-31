import type { BusinessFlow } from '../types/businessFlow'

export const BUSINESS_FLOWS: Record<string, BusinessFlow[]> = {
  '产品维度': [
    { id: 'p1', name: '战略选择', description: '制定产品战略方向和定位' },
    { id: 'p2', name: '市场调研', description: '研究市场需求和竞争态势' },
    { id: 'p3', name: '明确客户', description: '确定目标客户群体' },
    { id: 'p4', name: '产品/服务设计', description: '设计产品功能和服务方案' },
    { id: 'p5', name: '采购/制造过程', description: '原材料采购和生产制造' },
    { id: 'p6', name: '产品创造', description: '产品开发和生产' },
    { id: 'p7', name: '卖点提炼', description: '提炼产品核心卖点' },
    { id: 'p8', name: '产品布局', description: '规划产品线布局' },
    { id: 'p9', name: '定价策略', description: '制定产品定价策略' }
  ],
  '客户维度': [
    { id: 'c1', name: '客户画像', description: '描绘目标客户特征' },
    { id: 'c2', name: '鱼塘', description: '建立客户蓄水池' },
    { id: 'c3', name: '鱼饵', description: '设计营销吸引策略' },
    { id: 'c4', name: '抓潜', description: '获取潜在客户' },
    { id: 'c5', name: '培育', description: '客户沟通与培育' },
    { id: 'c6', name: '成交', description: '促成客户签单' },
    { id: 'c7', name: '服务', description: '提供售后服务' },
    { id: 'c8', name: '追销', description: '深度销售' },
    { id: 'c9', name: '转介绍', description: '获取客户推荐' }
  ],
  '渠道维度': [
    { id: 'ch1', name: '代理商画像', description: '描绘理想渠道伙伴特征' },
    { id: 'ch2', name: '鱼塘', description: '建立渠道储备库' },
    { id: 'ch3', name: '鱼饵', description: '设计渠道吸引策略' },
    { id: 'ch4', name: '招商', description: '招募渠道商' },
    { id: 'ch5', name: '签约', description: '达成合作协议' },
    { id: 'ch6', name: '服务', description: '提供渠道支持' },
    { id: 'ch7', name: '培训', description: '渠道能力建设' },
    { id: 'ch8', name: '推广', description: '协助市场推广' },
    { id: 'ch9', name: '激发', description: '渠道激励管理' }
  ],
  '团队维度': [
    { id: 't1', name: '人才画像', description: '制定人才标准' },
    { id: 't2', name: '鱼塘', description: '建立人才库' },
    { id: 't3', name: '鱼饵', description: '设计人才吸引策略' },
    { id: 't4', name: '招聘', description: '人才招聘' },
    { id: 't5', name: '面试', description: '人才筛选' },
    { id: 't6', name: '入职上岗', description: '人才入职管理' },
    { id: 't7', name: '培训', description: '人才培养' },
    { id: 't8', name: '氛围建设', description: '团队文化建设' },
    { id: 't9', name: '激励', description: '绩效与文化激励' }
  ],
  '财务维度': [
    { id: 'f1', name: '增收', description: '拓展营收渠道' },
    { id: 'f2', name: '降本', description: '降低成本策略' },
    { id: 'f3', name: '增效', description: '提高运营效率' },
    { id: 'f4', name: '周转', description: '提升资金周转率' },
    { id: 'f5', name: '应付', description: '优化应付账款周期' },
    { id: 'f6', name: '存货', description: '控制存货周转天数' },
    { id: 'f7', name: '负债', description: '合理控制负债率' },
    { id: 'f8', name: '税收', description: '合理合规税务筹划' },
    { id: 'f9', name: '应收', description: '加速应收账款回款' }
  ]
}
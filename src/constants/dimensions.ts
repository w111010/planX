import {
  CubeIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'

export interface Dimension {
  id: keyof typeof DIMENSIONS
  name: string
  icon: Component
}

export const DIMENSIONS = {
  PRODUCT: '产品维度',
  CUSTOMER: '客户维度',
  CHANNEL: '渠道维度',
  TEAM: '团队维度',
  FINANCE: '财务维度'
} as const

export const DIMENSION_LIST: Dimension[] = [
  { id: 'PRODUCT', name: DIMENSIONS.PRODUCT, icon: CubeIcon },
  { id: 'CUSTOMER', name: DIMENSIONS.CUSTOMER, icon: UserGroupIcon },
  { id: 'CHANNEL', name: DIMENSIONS.CHANNEL, icon: BuildingStorefrontIcon },
  { id: 'TEAM', name: DIMENSIONS.TEAM, icon: UsersIcon },
  { id: 'FINANCE', name: DIMENSIONS.FINANCE, icon: BanknotesIcon }
]

export const FOCUS_POINTS = {
  [DIMENSIONS.PRODUCT]: [
    { id: 'p1', name: '增加新产品', type: 'increase' },
    { id: 'p2', name: '提升产品吸引力', type: 'increase' },
    { id: 'p3', name: '提升产品单价', type: 'increase' },
    { id: 'p4', name: '降低产品成本', type: 'decrease' }
  ],
  [DIMENSIONS.CUSTOMER]: [
    { id: 'c1', name: '增加客户数量', type: 'increase' },
    { id: 'c2', name: '提升成交率', type: 'increase' },
    { id: 'c3', name: '提升客户终身价值', type: 'increase' },
    { id: 'c4', name: '降低客户流失率', type: 'decrease' }
  ],
  [DIMENSIONS.CHANNEL]: [
    { id: 'ch1', name: '增加渠道数量', type: 'increase' },
    { id: 'ch2', name: '提升成材率', type: 'increase' },
    { id: 'ch3', name: '提升渠道人均产值', type: 'increase' },
    { id: 'ch4', name: '降低渠道流失率', type: 'decrease' }
  ],
  [DIMENSIONS.TEAM]: [
    { id: 't1', name: '增加团队人数', type: 'increase' },
    { id: 't2', name: '提升成材率', type: 'increase' },
    { id: 't3', name: '提升人均产值', type: 'increase' },
    { id: 't4', name: '降低团队流失率', type: 'decrease' }
  ],
  [DIMENSIONS.FINANCE]: [
    { id: 'f1', name: '增加营收', type: 'increase' },
    { id: 'f2', name: '提升利润率', type: 'increase' },
    { id: 'f3', name: '提升投资回报率', type: 'increase' },
    { id: 'f4', name: '降低风险', type: 'decrease' }
  ]
} as const
export const PRESET_GOALS = [
  // 产品维度
  {
    dimension: DIMENSIONS.PRODUCT,
    goals: [
      { title: '新产品数量', unit: '个', hint: '新开发并上市的产品数量' },
      { title: '产品吸引力', unit: '%', hint: '产品体验评分' },
      { title: '产品单价', unit: '元', hint: '产品平均售价' },
      { title: '产品成本', unit: '元', hint: '单位产品成本（需降低）' }
    ]
  },
  // 客户维度
  {
    dimension: DIMENSIONS.CUSTOMER,
    goals: [
      { title: '客户数量', unit: '个', hint: '总客户数' },
      { title: '成交率', unit: '%', hint: '成功转化的客户比例' },
      { title: '客户终身价值', unit: '万元', hint: '单个客户预期贡献的总收入' },
      { title: '客户流失率', unit: '%', hint: '客户流失比例（需降低）' }
    ]
  },
  // 渠道维度
  {
    dimension: DIMENSIONS.CHANNEL,
    goals: [
      { title: '渠道数量', unit: '个', hint: '有效销售渠道数量' },
      { title: '渠道成熟度', unit: '%', hint: '渠道达标率' },
      { title: '渠道人均产值', unit: '万元', hint: '每个渠道的平均产出' },
      { title: '渠道流失率', unit: '%', hint: '渠道流失比例（需降低）' }
    ]
  },
  // 团队维度
  {
    dimension: DIMENSIONS.TEAM,
    goals: [
      { title: '团队规模', unit: '人', hint: '正式员工数量' },
      { title: '人才培养率', unit: '%', hint: '人才培养成功比例' },
      { title: '人均产值', unit: '万元', hint: '每位员工创造的价值' },
      { title: '团队流失率', unit: '%', hint: '员工离职率（需降低）' }
    ]
  },
  // 财务维度
  {
    dimension: DIMENSIONS.FINANCE,
    goals: [
      { title: '营业收入', unit: '万元', hint: '总营业收入' },
      { title: '利润率', unit: '%', hint: '净利润率' },
      { title: '投资回报率', unit: '%', hint: 'ROI' },
      { title: '运营成本', unit: '万元', hint: '总运营成本（需降低）' }
    ]
  }
]
import { DIMENSIONS } from './dimensions'
import type { Goal } from '../types/goal'

export const SAMPLE_GOALS: Goal[] = [
  // 产品维度
  {
    id: 1,
    title: '新产品开发',
    dimension: DIMENSIONS.PRODUCT,
    focusPoint: 'p1',
    unit: '个',
    previousValue: 3,
    baseValue: 5,
    stretchValue: 8,
    note: '包括完整产品线规划和迭代升级'
  },
  {
    id: 2,
    title: '产品满意度',
    dimension: DIMENSIONS.PRODUCT,
    focusPoint: 'p2',
    unit: '%',
    previousValue: 85,
    baseValue: 90,
    stretchValue: 95,
    note: '基于用户反馈和市场调研'
  },
  
  // 客户维度
  {
    id: 3,
    title: '大客户数量',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c1',
    unit: '个',
    previousValue: 20,
    baseValue: 30,
    stretchValue: 40,
    note: '年收入100万以上的客户'
  },
  {
    id: 4,
    title: '客户续约率',
    dimension: DIMENSIONS.CUSTOMER,
    focusPoint: 'c3',
    unit: '%',
    previousValue: 75,
    baseValue: 85,
    stretchValue: 90,
    note: '老客户续约率提升'
  },
  
  // 渠道维度
  {
    id: 5,
    title: '核心渠道数量',
    dimension: DIMENSIONS.CHANNEL,
    focusPoint: 'ch1',
    unit: '个',
    previousValue: 10,
    baseValue: 15,
    stretchValue: 20,
    note: '年销售额500万以上的渠道'
  },
  {
    id: 6,
    title: '渠道人均产值',
    dimension: DIMENSIONS.CHANNEL,
    focusPoint: 'ch3',
    unit: '万元',
    previousValue: 200,
    baseValue: 250,
    stretchValue: 300,
    note: '提升渠道效率和产出'
  },
  
  // 团队维度
  {
    id: 7,
    title: '研发团队规模',
    dimension: DIMENSIONS.TEAM,
    focusPoint: 't1',
    unit: '人',
    previousValue: 30,
    baseValue: 40,
    stretchValue: 50,
    note: '扩充核心研发力量'
  },
  {
    id: 8,
    title: '人才保留率',
    dimension: DIMENSIONS.TEAM,
    focusPoint: 't4',
    unit: '%',
    previousValue: 85,
    baseValue: 90,
    stretchValue: 95,
    note: '降低核心人才流失'
  },
  
  // 财务维度
  {
    id: 9,
    title: '年度营收',
    dimension: DIMENSIONS.FINANCE,
    focusPoint: 'f1',
    unit: '亿元',
    previousValue: 1.5,
    baseValue: 2,
    stretchValue: 2.5,
    note: '实现营收稳健增长'
  },
  {
    id: 10,
    title: '净利润率',
    dimension: DIMENSIONS.FINANCE,
    focusPoint: 'f2',
    unit: '%',
    previousValue: 15,
    baseValue: 18,
    stretchValue: 20,
    note: '提升经营效率和盈利能力'
  }
]
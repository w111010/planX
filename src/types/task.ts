// 关键结果类型定义
export type KeyResultType = '流程' | '技能' | '工具' | '机制' | '事件'

export interface Metric {
  name: string
  target: number
  unit: string
}

export interface Attachment {
  type: 'file' | 'link'
  name: string
  url: string
}

export interface KeyResult {
  name: string
  type: KeyResultType
  attachments: Attachment[]
  metrics: Metric[]
}

export interface Task {
  id: number
  title: string
  owner: string
  startDate: string  // Deprecated: Use startMonth instead
  endDate: string    // Deprecated: Use endMonth instead
  startMonth?: number // 1-12, representing the month number
  endMonth?: number   // 1-12, representing the month number
  description?: string
  dimension: string
  focusPoint: string
  businessFlow: string
  keyResults: KeyResult[]
}

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

export interface WeeklyProgress {
  week: number
  status: string
  completion: number
}

export interface Task {
  id: number
  title: string
  owner: string
  // For annual plans (quarter-based)
  startDate?: string    // @deprecated Use startQuarter instead
  endDate?: string      // @deprecated Use endQuarter instead
  startQuarter?: string  // Q1-Q4, representing the quarter (e.g., "Q1")
  endQuarter?: string    // Q1-Q4, representing the quarter (e.g., "Q4")
  // For quarterly plans (month-based)
  startMonth?: number // 1-12, representing the month number
  endMonth?: number   // 1-12, representing the month number
  // For monthly plans (week-based)
  startWeek?: number    // 1-4, representing the week number
  endWeek?: number      // 1-4, representing the week number
  weeklyProgress?: WeeklyProgress[] // Weekly progress tracking for monthly tasks
  // Common fields
  description?: string
  dimension: string
  focusPoint: string
  businessFlow: string
  keyResults: KeyResult[]
}

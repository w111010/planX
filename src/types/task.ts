export interface Task {
  id: number
  title: string
  owner: string
  startDate: string
  endDate: string
  description?: string
  dimension: string
  focusPoint: string
  businessFlow: string
  relatedGoals?: number[]
  keyResults: {
    description?: string
    files?: Array<{
      name: string
      url: string
    }>
    links?: Array<{
      name: string
      url: string
    }>
    metrics?: Array<{
      name: string
      target: number
      unit: string
    }>
  }
}
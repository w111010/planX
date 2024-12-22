export interface Goal {
  id: number
  title: string
  dimension: string
  focusPoint?: string
  unit: string
  previousValue?: number
  hint?: string,
  baseValue?: number | null,
  stretchValue?: number | null,
  note?: string
}

export interface GoalFormData {
  baseValue: number | null
  stretchValue: number | null
  note: string
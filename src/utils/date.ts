/**
 * 格式化月份显示
 * @param month 月份数字 (1-12)
 * @returns 格式化后的月份字符串 (例如: "1月")
 */
export function formatMonth(month: number | null | undefined): string {
  if (!month || month < 1 || month > 12) return '未指定'
  return `${month}月`
}

/**
 * 获取季度对应的月份范围
 * @param quarter 季度 (1-4)
 * @returns 季度包含的月份数组
 */
export function getQuarterMonths(quarter: number): number[] {
  const quarterMonthMap: Record<number, number[]> = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12]
  }
  return quarterMonthMap[quarter] || []
}

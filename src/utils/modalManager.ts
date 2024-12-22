// 弹窗管理器
let modalCount = 0
let isLocked = false
let zIndexBase = 1000

export const modalManager = {
  open(isNested?: boolean) {
    modalCount++
    if (!isLocked || isNested) {
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.touchAction = 'none'
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
      isLocked = true
    }
    return isNested ? zIndexBase + modalCount : zIndexBase
  },

  close() {
    modalCount = Math.max(0, modalCount - 1)
    if (modalCount === 0 && isLocked) {
      document.documentElement.style.overflow = ''
      document.documentElement.style.touchAction = ''
      document.body.style.paddingRight = ''
      isLocked = false
    }
  },

  // 强制重置（用于异常情况）
  reset() {
    modalCount = 0
    if (isLocked) {
      document.documentElement.style.overflow = ''
      document.documentElement.style.touchAction = ''
      document.body.style.paddingRight = ''
      isLocked = false
    }
  }
}
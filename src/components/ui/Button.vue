<!-- 基础按钮组件 -->
<template>
  <button
    :disabled="disabled"
    class="inline-flex items-center justify-center transition-colors duration-200 rounded-full"
    :class="{
      'bg-gray-900 text-white hover:bg-gray-800': variant === 'primary',
      'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
      'border border-gray-200 text-gray-700 hover:bg-gray-50': variant === 'outline',
      'bg-transparent': variant === 'ghost',
      'h-8 px-4 text-sm': size === 'sm',
      'h-10 px-6 text-base': size === 'md',
      'h-12 px-8 text-lg': size === 'lg',
      'opacity-50 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
      [className || '']: true
    }"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}>()

defineEmits<{
  click: []
}>()</script>
<template>
  <span 
    class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
    :class="[
      variant === 'gray' ? 'bg-gray-50 text-gray-600' :
      variant === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
      'bg-green-50 text-green-600'
    ]"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'gray' | 'indigo' | 'green'
}>()
</script>

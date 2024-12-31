<template>
  <div class="relative">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'peer block w-full rounded-md border-0 py-2.5 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-all duration-200 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]',
        suffix ? 'pr-8 pl-3' : 'px-3'
      ]"
      @input="handleInput"
    />
    <span 
      v-if="suffix"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none text-sm"
    >
      {{ suffix }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number | null
  type?: string
  placeholder?: string
  suffix?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [string | number | null]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.type === 'number' ? 
    target.value === '' ? null : parseFloat(target.value) :
    target.value
  
  emit('update:modelValue', value)
}
</script>
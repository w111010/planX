<template>
  <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    
    <textarea
      :value="modelValue"
      class="block w-full rounded-md border-0 py-2 px-3 bg-white text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-all duration-200 sm:text-sm/6 resize-none h-24"
      :placeholder="placeholder"
      @input="handleInput"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  placeholder: string
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
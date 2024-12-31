<template>
  <Listbox 
    :modelValue="modelValue" 
    :disabled="disabled"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="relative">
      <ListboxButton 
        class="grid w-full grid-cols-1 rounded-md bg-white py-2.5 pl-3 pr-2 text-left outline outline-1 -outline-offset-1 transition-colors sm:text-sm/6"
        :class="[
          disabled ? 
            'cursor-not-allowed bg-gray-50 text-gray-400 outline-gray-200' : 
            'cursor-default text-gray-900 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
        ]"
      >
        <span class="col-start-1 row-start-1 truncate pr-6">
          {{ selectedLabel || placeholder }}
        </span>
        <ChevronUpDownIcon 
          class="col-start-1 row-start-1 h-5 w-5 self-center justify-self-end"
          :class="disabled ? 'text-gray-300' : 'text-gray-500'"
          aria-hidden="true" 
        />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions 
          v-if="!disabled"
          class="absolute z-[100] w-full max-h-[240px] overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          :class="[
            position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          ]"
        >
          <ListboxOption
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              ref="optionRefs"
              :class="[
              active ? 'bg-indigo-600 text-white' : 'text-gray-900',
              'relative cursor-default select-none py-2 pl-3 pr-9'
            ]">
              <span :class="[
                selected ? 'font-semibold' : 'font-normal',
                'block truncate'
              ]">
                {{ option.label }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4'
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { CheckIcon } from '@heroicons/vue/20/solid'

interface Option {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: Option[]
  placeholder?: string
  disabled?: boolean
  position?: 'top' | 'bottom'
}>()

defineEmits<{
  'update:modelValue': [string]
}>()

const selectedLabel = computed(() => {
  return props.options.find(option => option.value === props.modelValue)?.label
})
</script>
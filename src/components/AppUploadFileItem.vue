<script setup lang="ts">
import Button from 'primevue/button'
import { CloudUpload, Times } from '@primeicons/vue'
import { formatSize } from '@/utils/formatSize'

type Props = {
  file: File
  onRemove: () => void
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center justify-between rounded-lg bg-surface-50 p-3 dark:bg-surface-800">
    <div class="flex min-w-0 items-center gap-3">
      <CloudUpload class="shrink-0 text-primary" aria-hidden="true" />
      <div class="flex min-w-0 flex-col">
        <span class="truncate text-sm font-medium">{{ file.name }}</span>
        <span class="text-xs text-muted-color">{{ formatSize(file.size) }}</span>
      </div>
    </div>
    <Button
      iconOnly
      type="button"
      size="small"
      variant="text"
      severity="secondary"
      rounded
      :aria-label="`Remove ${file.name}`"
      @click="onRemove"
    >
      <Times aria-hidden="true" />
    </Button>
  </div>
</template>

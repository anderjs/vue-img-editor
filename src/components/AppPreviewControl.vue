<script setup lang="ts">
import { Images, Refresh, Times } from '@primeicons/vue'
import Button from 'primevue/button'

defineProps<{
  canReset: boolean
}>()

const emit = defineEmits<{
  reset: []
  close: []
  replace: []
}>()
</script>

<template>
  <Teleport to="#photo-actions">
    <div class="photo-actions" role="group" aria-label="Photo actions">
      <Button
        class="photo-action"
        text
        :disabled="!canReset"
        aria-label="Reset adjustments"
        title="Reset adjustments"
        @click="emit('reset')"
      >
        <Refresh aria-hidden="true" />
      </Button>
      <Button
        class="photo-action"
        text
        aria-label="Replace photo"
        title="Replace photo"
        @click="emit('replace')"
      >
        <Images aria-hidden="true" />
      </Button>
      <Button
        class="photo-action"
        text
        aria-label="Close photo"
        title="Close photo"
        @click="emit('close')"
      >
        <Times aria-hidden="true" />
      </Button>
    </div>
  </Teleport>
</template>

<style scoped>
.photo-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.photo-actions :deep(.photo-action) {
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--text-secondary);
}

.photo-actions :deep(.photo-action:hover:not(:disabled)) {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
}

.photo-actions :deep(.photo-action:disabled) {
  opacity: 0.45;
}
</style>

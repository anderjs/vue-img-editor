<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor'

const { image, filter } = storeToRefs(useEditorStore())
</script>

<template>
  <section v-if="image" class="preview-stage" aria-label="Image preview">
    <figure class="preview-frame">
      <img :style="filter" class="preview-image border-4" alt="preview" :src="image.objectURL" />
    </figure>
  </section>
</template>

<style scoped>
.clear {
  display: flex;
  float: right;
  margin: auto;
  align-items: self-end;
  justify-content: end;
}

.preview-stage {
  display: grid;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  place-items: center;
  padding: clamp(16px, 4vw, 15px);
}

.preview-frame {
  display: flex;
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  margin: 0;
  animation: preview-enter 180ms ease-out both;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  object-fit: contain;
  border: 1px solid var(--border);
}

@keyframes preview-enter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-frame {
    animation: none;
  }
}
</style>

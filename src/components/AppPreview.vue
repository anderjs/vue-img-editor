<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import { useEditorStore } from '@/stores/editor'

// - Composables
import { useImageWebGL } from '@/composables/useImageWebGL'
import { useCanvasResize } from '@/composables/useCanvasResize'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const preview = useTemplateRef<HTMLImageElement>('image')

const { image, brightness, filter } = storeToRefs(useEditorStore())

/**
 * @description
 * WebGL2 rendering context engine.
 */
const { error, isReady, synchronize } = useImageWebGL({
  image: preview,
  canvas,
  adjustments: brightness,
})

/**
 * @description
 * Uses Resize observer to synchronize canvas with rendering context.
 */
const { observe } = useCanvasResize({
  image: preview,
  canvas,
})

function handleImageLoad(): void {
  observe()

  synchronize()
}
</script>

<template>
  <section v-if="image" class="preview-stage" aria-label="Image preview">
    <figure class="preview-frame">
      <img
        ref="image"
        :style="error ? filter : undefined"
        :src="image.objectURL"
        alt="preview"
        class="preview-image"
        :class="{ 'preview-image-hidden': isReady }"
        @load="handleImageLoad"
      />
      <canvas v-show="isReady" ref="canvas" class="canvas" aria-hidden="true" />
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

.canvas {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
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
  position: relative;
  display: flex;
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  box-sizing: border-box;
  margin: 0;
  border: 1px solid var(--border);
  animation: preview-enter 180ms ease-out both;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  object-fit: contain;
}

.preview-image-hidden {
  visibility: hidden;
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

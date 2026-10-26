<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, shallowRef, useTemplateRef } from 'vue'
import { useEditorStore } from '@/stores/editor'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const preview = useTemplateRef<HTMLImageElement>('image')

const resizeObserver = shallowRef<ResizeObserver | null>(null)

const renderingContext = shallowRef<WebGL2RenderingContext | null>(null)

const { image, filter } = storeToRefs(useEditorStore())

/**
 * @description
 * If canvas updated on instance we set webgl2 rendering context.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext
 */
function handleSyncCanvas(): void {
  const imageRef = preview.value

  const canvasRef = canvas.value

  if (imageRef && canvasRef) {
    const { width, height } = imageRef.getBoundingClientRect()

    canvasRef.width = imageRef.naturalWidth
    canvasRef.height = imageRef.naturalHeight
    canvasRef.style.width = `${width}px`
    canvasRef.style.height = `${height}px`

    renderingContext.value?.viewport(0, 0, canvasRef.width, canvasRef.height)
  }
}

/**
 * @description
 * @requires useEditorStore (image) to be ready.
 * Once image is loaded because of we synchronize the rendering.
 */
function handleImageLoad(): void {
  const imageRef = preview.value

  const canvasRef = canvas.value

  if (imageRef && canvasRef) {
    renderingContext.value = canvasRef.getContext('webgl2')

    handleSyncCanvas()

    resizeObserver.value?.disconnect()

    resizeObserver.value = new ResizeObserver(handleSyncCanvas)

    resizeObserver.value.observe(imageRef)
  }
}

/**
 * @description
 * Stop resize observer.
 * @see
 */
void onBeforeUnmount((): void => resizeObserver.value?.disconnect())
</script>

<template>
  <section v-if="image" class="preview-stage" aria-label="Image preview">
    <figure class="preview-frame">
      <img
        ref="image"
        :style="filter"
        :src="image.objectURL"
        alt="preview"
        class="preview-image"
        @load="handleImageLoad"
      />
      <canvas ref="canvas" class="canvas" aria-hidden="true" />
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
  margin: 0;
  animation: preview-enter 180ms ease-out both;
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: calc(100dvh - 140px);
  object-fit: contain;
  border: 4px solid var(--border);
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

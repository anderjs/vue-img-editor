import { computed, onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'
import { useContextCanvas } from '@/composables/useContextCanvas'
import { createRendererFromElements, type ImageRenderer } from '@/utils/webgl-renderer'
import type { Brightness } from '@/schema/light'
import { resolveShaderParameters, type ShaderParameters } from '@/utils/filter'

type ComposableWebGLContext = {
  readonly image: Readonly<Ref<HTMLImageElement | null>>
  readonly canvas: Readonly<Ref<HTMLCanvasElement | null>>
  readonly adjustments: Readonly<Ref<Brightness>>
}

export function useImageWebGL({ image, canvas, adjustments }: ComposableWebGLContext) {
  const frame = shallowRef<number | null>(null)
  const error = shallowRef<Error | null>(null)
  const isReady = shallowRef(false)
  const renderer = shallowRef<ImageRenderer | null>(null)
  const parameters = computed<ShaderParameters>(() => resolveShaderParameters(adjustments.value))

  const cancelRender = (): void => {
    if (frame.value === null) return

    cancelAnimationFrame(frame.value)
    frame.value = null
  }

  const render = (): void => {
    if (frame.value !== null || !renderer.value) return

    frame.value = requestAnimationFrame(() => {
      frame.value = null
      renderer.value?.render(parameters.value)
      isReady.value = renderer.value !== null
    })
  }

  const handleContextLost = (event: Event): void => {
    event.preventDefault()
    cancelRender()
    renderer.value = null
    isReady.value = false
    error.value = new Error('WebGL context lost')
  }

  const synchronize = (): void => {
    const imageElement = image.value
    const canvasElement = canvas.value

    if (!imageElement || !canvasElement || imageElement.naturalWidth === 0) return

    isReady.value = false
    renderer.value?.destroy()

    try {
      renderer.value = createRendererFromElements(imageElement, canvasElement)
      error.value = null
      render()
    } catch (cause) {
      renderer.value = null
      isReady.value = false
      error.value = cause instanceof Error ? cause : new Error('WebGL initialization failed')
    }
  }

  useContextCanvas({
    canvas,
    onContextLost: handleContextLost,
    onContextRestored: synchronize,
  })

  watch(parameters, render, { flush: 'post' })

  onBeforeUnmount(() => {
    cancelRender()
    renderer.value?.destroy()
  })

  return { error, isReady, synchronize }
}

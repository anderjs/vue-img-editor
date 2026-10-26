import { computed, onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'
import {
  createRendererFromElements,
  type ImageRenderer,
} from '@/utils/webgl-renderer'
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
  const renderer = shallowRef<ImageRenderer | null>(null)
  const parameters = computed<ShaderParameters>(() => resolveShaderParameters(adjustments.value))

  const render = (): void => {
    if (frame.value !== null) {
      return
    }

    frame.value = requestAnimationFrame(() => {
      frame.value = null
      renderer.value?.render(parameters.value)
    })
  }

  const synchronize = (): void => {
    const imageElement = image.value
    const canvasElement = canvas.value

    if (!imageElement || !canvasElement || imageElement.naturalWidth === 0) {
      return
    }

    renderer.value?.destroy()

    try {
      renderer.value = createRendererFromElements(imageElement, canvasElement)

      error.value = null

      render()
    } catch (err) {
      renderer.value = null

      error.value = err instanceof Error ? err : new Error('WebGL initialization failed')
    }
  }

  watch(parameters, render, { flush: 'post' })

  onBeforeUnmount(() => {
    if (frame.value !== null) {
      cancelAnimationFrame(frame.value)
    }

    renderer.value?.destroy()
  })

  return { error, synchronize }
}

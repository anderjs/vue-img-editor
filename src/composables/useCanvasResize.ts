import { onBeforeUnmount, shallowRef, type Ref } from 'vue'
import { WEBGL_CONTEXT_ATTRIBUTES } from '@/utils/webgl-context'
import { toPixels } from '@/utils/toPixels'

interface UseCanvasResizeOptions {
  readonly image: Readonly<Ref<HTMLImageElement | null>>
  readonly canvas: Readonly<Ref<HTMLCanvasElement | null>>
}

/**
 * @description
 * Composable to track changes with resize observer api through shallowRef.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Resize_Observer_API
 * @see https://vuejs.org/api/reactivity-advanced.html
 */
export function useCanvasResize({ canvas, image }: UseCanvasResizeOptions) {
  const observer = shallowRef<ResizeObserver | null>(null)

  const synchronize = (): void => {
    const imageRef = image.value

    const canvasRef = canvas.value

    /**
     * @description
     * If not instanced not sync.
     */
    if (!imageRef || !canvasRef || imageRef?.naturalWidth === 0) {
      return
    }

    const { width, height } = imageRef.getBoundingClientRect()

    canvasRef.width = imageRef.naturalWidth
    canvasRef.height = imageRef.naturalHeight
    canvasRef.style.width = toPixels(width)
    canvasRef.style.height = toPixels(height)

    canvasRef
      .getContext('webgl2', WEBGL_CONTEXT_ATTRIBUTES)
      ?.viewport(0, 0, canvasRef.width, canvasRef.height)
  }

  /**
   * @description
   * Uses resize observer api to synchronize sizes between image and canvas.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
   */
  const observe = (): void => {
    const imageRef = image.value

    if (imageRef) {
      observer.value?.disconnect()

      observer.value = new ResizeObserver(synchronize)

      observer.value.observe(imageRef)

      synchronize()
    }
  }

  onBeforeUnmount((): void => observer.value?.disconnect())

  return {
    observe,
    synchronize,
  }
}

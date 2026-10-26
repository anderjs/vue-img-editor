import { onBeforeUnmount, shallowRef, type Ref } from 'vue'

interface UseCanvasResizeOptions {
  readonly canvas: Readonly<Ref<HTMLCanvasElement | null>>
  readonly image: Readonly<Ref<HTMLImageElement | null>>
}

export function useCanvasResize({ canvas, image }: UseCanvasResizeOptions) {
  const observer = shallowRef<ResizeObserver | null>(null)

  const synchronize = (): void => {
    const imageElement = image.value
    const canvasElement = canvas.value

    if (!imageElement || !canvasElement || imageElement.naturalWidth === 0) {
      return
    }

    const { width, height } = imageElement.getBoundingClientRect()

    canvasElement.width = imageElement.naturalWidth
    canvasElement.height = imageElement.naturalHeight
    canvasElement.style.width = `${width}px`
    canvasElement.style.height = `${height}px`

    canvasElement
      .getContext('webgl2', { preserveDrawingBuffer: true })
      ?.viewport(0, 0, canvasElement.width, canvasElement.height)
  }

  const observe = (): void => {
    const imageElement = image.value

    if (!imageElement) {
      return
    }

    observer.value?.disconnect()
    observer.value = new ResizeObserver(synchronize)
    observer.value.observe(imageElement)

    synchronize()
  }

  onBeforeUnmount(() => observer.value?.disconnect())

  return {
    observe,
    synchronize,
  }
}

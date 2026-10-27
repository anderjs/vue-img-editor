import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

interface UseContextCanvasOptions {
  readonly canvas: MaybeRefOrGetter<HTMLCanvasElement | null>
  readonly onContextLost: (event: Event) => void
  readonly onContextRestored: (event: Event) => void
}

export function useContextCanvas({
  canvas,
  onContextLost,
  onContextRestored,
}: UseContextCanvasOptions): void {
  watchEffect(
    (onCleanup) => {
      const canvasElement = toValue(canvas)

      if (!canvasElement) return

      canvasElement.addEventListener('webglcontextlost', onContextLost)
      canvasElement.addEventListener('webglcontextrestored', onContextRestored)

      onCleanup(() => {
        canvasElement.removeEventListener('webglcontextlost', onContextLost)
        canvasElement.removeEventListener('webglcontextrestored', onContextRestored)
      })
    },
    { flush: 'sync' },
  )
}

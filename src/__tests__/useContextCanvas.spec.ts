import { createApp, shallowRef } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useContextCanvas } from '@/composables/useContextCanvas'

describe('useContextCanvas', () => {
  const apps: ReturnType<typeof createApp>[] = []

  afterEach(() => {
    apps.forEach((app) => app.unmount())
    apps.length = 0
  })

  it('moves WebGL context listeners with the reactive canvas and cleans them up', () => {
    const canvas = shallowRef<HTMLCanvasElement | null>(null)
    const onContextLost = vi.fn<(event: Event) => void>((event) => event.preventDefault())
    const onContextRestored = vi.fn<(event: Event) => void>()
    const app = createApp({
      setup() {
        useContextCanvas({ canvas, onContextLost, onContextRestored })

        return () => null
      },
    })

    apps.push(app)
    app.mount(document.createElement('div'))

    const firstCanvas = document.createElement('canvas')
    const secondCanvas = document.createElement('canvas')

    canvas.value = firstCanvas

    const contextLost = new Event('webglcontextlost', { cancelable: true })
    firstCanvas.dispatchEvent(contextLost)
    firstCanvas.dispatchEvent(new Event('webglcontextrestored'))

    expect(contextLost.defaultPrevented).toBe(true)
    expect(onContextLost).toHaveBeenCalledOnce()
    expect(onContextRestored).toHaveBeenCalledOnce()

    canvas.value = secondCanvas

    firstCanvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
    secondCanvas.dispatchEvent(new Event('webglcontextrestored'))

    expect(onContextLost).toHaveBeenCalledOnce()
    expect(onContextRestored).toHaveBeenCalledTimes(2)

    app.unmount()
    apps.length = 0
    secondCanvas.dispatchEvent(new Event('webglcontextrestored'))

    expect(onContextRestored).toHaveBeenCalledTimes(2)
  })
})

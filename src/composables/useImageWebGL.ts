import type { IEditorState } from '@/stores/editor'
import {
  createRendererFromElements,
  type ImageRenderer,
  type ShaderParameters,
} from '@/utils/webgl-renderer'
import { watch, shallowRef, onBeforeUnmount, type Ref, computed } from 'vue'

type ComposableWebGLContext = {
  readonly image: Ref<HTMLImageElement | null>
  readonly canvas: Ref<HTMLCanvasElement | null>
  readonly adjusments: Ref<IEditorState['brightness']>
}

type Throttler = {
  frame: number | null;
}

export function useImageWebGL({ image, canvas, adjusments }: ComposableWebGLContext) {
  const renderer = shallowRef<ImageRenderer | null>(null)

  /**
   * @description
   * Throttler.
   */
  const throttle: Throttler = {
    frame: null,
  }

  /**
   * @description
   * Computed parameters from store.
   */
  const parameters = computed<ShaderParameters>(() => ({
    ...adjusments.value,
  }))

  /**
   * @description
   * Render context.
   */
  const render = (): void => {
    if (throttle.frame === null) {
      throttle.frame = requestAnimationFrame(() => {
        throttle.frame = null

        synchronize()
      })
    }
  }

  /**
   * @description
   * Synchronize render app.
   */
  const synchronize = (): void => {
    if (image?.value && canvas?.value) {
      renderer.value = createRendererFromElements(image.value, canvas.value, adjusments.value)
    }
  }


  /**
   * @description
   * Watch lifecycle.
   */
  watch(parameters, render, { flush: "post" })

  /**
   * @description
   * Unmount lifecycle.
   */
  onBeforeUnmount(() => {
    if (throttle.frame) {
      cancelAnimationFrame(throttle.frame)
    }

    renderer.value?.destroy()
  })
}

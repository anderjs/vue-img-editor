import type { IEditorState } from '@/stores/editor'
import type { ImageRenderer, ShaderParameters } from '@/utils/webgl-renderer'
import { watch, shallowRef, onBeforeUnmount, type Ref, computed } from 'vue'

type ComposableWebGLContext = {
  readonly image: Ref<HTMLImageElement | null>
  readonly canvas: Ref<HTMLCanvasElement | null>
  readonly adjusments: Ref<IEditorState['brightness']>
}

export function useImageWebGL({ image, canvas, adjusments }: ComposableWebGLContext) {
  const renderer = shallowRef<ImageRenderer | null>(null)

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
    renderer.value?.render(parameters.value satisfies ShaderParameters)
  }

  /**
   * @description
   * Synchronize render app.
   */
  const synchronize = (): void => {
    if (image?.value && canvas?.value) {
      const imageRef = image.value;
      const canvasRef = canvas.value;


    }
  }
}

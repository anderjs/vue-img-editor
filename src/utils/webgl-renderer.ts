import type { IEditorState } from '@/stores/editor'

interface RendererResources {
  readonly gl: WebGL2RenderingContext
  readonly program: WebGLProgram
  readonly texture: WebGLTexture
  readonly adjusments: IEditorState['brightness']
  readonly imageLocation: WebGLUniformLocation | null
  readonly shadowsLocation: WebGLUniformLocation | null
  readonly contrastLocation: WebGLUniformLocation | null
  readonly exposureLocation: WebGLUniformLocation | null
  readonly highlightsLocation: WebGLUniformLocation | null
}

export type ShaderParameters = Omit<IEditorState['brightness'], 'black' | 'whites'>

export interface ImageRenderer {
  render: (params: ShaderParameters) => void
  destroy: () => void
}

/**
 * @description
 * Create render context to connect to WebGL2.
 */
export function createRenderer({
  gl,
  texture,
  program,
  imageLocation,
  shadowsLocation,
  exposureLocation,
  contrastLocation,
  highlightsLocation,
}: RendererResources) : ImageRenderer {
  const render = ({ shadows, contrast, exposure, highlights }: ShaderParameters): void => {
    /**
     * @description
     * Enabling texture.
     */
    gl.useProgram(program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    /**
     * @description
     * THE uniform1i is an OpenGL function used to specify the value of a single integer uniform variable or to bind a texture unit index to a sampler uniform in a GLSL shader.
     * The uniform1f method is a WebGL and OpenGL function used to specify the value of a single floating-point uniform variable in a shader program, as detailed in the MDN.
     */
    gl.uniform1i(imageLocation, 0)
    gl.uniform1f(shadowsLocation, shadows)
    gl.uniform1f(contrastLocation, contrast)
    gl.uniform1f(exposureLocation, exposure)
    gl.uniform1f(highlightsLocation, highlights)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  const destroy = (): void => {
    gl.deleteTexture(texture)
    gl.deleteProgram(program)
  }

  return {
    render,
    destroy
  }
}

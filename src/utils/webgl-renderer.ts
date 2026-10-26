import { createProgram } from '@/shaders/program'
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

export interface FullscreenQuad {
  vertexCount: number
  vertexArray: WebGLVertexArrayObject
  vertexBuffer: WebGLBuffer
}

export function createRendererFromElements(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  adjusments: RendererResources['adjusments'],
) {
  const gl = canvas.getContext('webgl2')

  if (gl) {
    const program = createProgram(gl)

    const texture = createTexture(gl, image)

    if (program) {
      const geometry = createFullscreenQuad(gl, program)

      const resources = {
        gl,
        program,
        texture,
        adjusments,
        ...geometry,
        imageLocation: gl.getUniformLocation(program, 'uImage'),
        shadowsLocation: gl.getAttribLocation(program, 'uShadows'),
        exposureLocation: gl.getUniformLocation(program, 'uExposure'),
        contrastLocation: gl.getUniformLocation(program, 'uContrast'),
        highlightsLocation: gl.getUniformLocation(program, 'uHighlights'),
      } as RendererResources

      return createRenderer(resources)
    }
  }

  throw new Error('WebGL not available')
}

export function createFullscreenQuad(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const vArray = gl.createVertexArray()

  const vBuffer = gl.createBuffer()

  if (vArray && vBuffer) {
    gl.bindVertexArray(vArray)
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer)

    // prettier-ignore
    const vortex = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,

      -1,  1, 0, 1,
       1, -1, 1, 0,
       1,  1, 1, 1,
    ])

    gl.bufferData(gl.ARRAY_BUFFER, vortex, gl.STATIC_DRAW)

    const uvLoc = gl.getAttribLocation(program, 'aUv')
    const posLoc = gl.getAttribLocation(program, 'aPosition')

    if (uvLoc === -1) {
      throw new Error('aUv Not Found')
    }

    if (posLoc === -1) {
      throw new Error('posLoc Not Found')
    }

    const stride = 4 * Float32Array.BYTES_PER_ELEMENT
    const uvOffset = 2 * Float32Array.BYTES_PER_ELEMENT
    const posOffset = 0

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, posOffset)

    gl.enableVertexAttribArray(uvLoc)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, stride, uvOffset)

    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return {
      vertexCount: 6,
      vertexArray: vArray,
      vertexBuffer: vBuffer,
    } as FullscreenQuad
  }
}

export function createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement): WebGLTexture {
  const texture = gl.createTexture()

  if (texture) {
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.bindTexture(gl.TEXTURE_2D, null)

    return texture
  }

  throw new Error('Texture could not be created')
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
}: RendererResources): ImageRenderer {
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
    destroy,
  }
}

import { createProgram } from '@/shaders/program'
import type { ShaderParameters } from '@/utils/filter'

interface RendererResources {
  readonly gl: WebGL2RenderingContext
  readonly program: WebGLProgram
  readonly texture: WebGLTexture
  readonly geometry: FullscreenQuad
  readonly blackLocation: WebGLUniformLocation | null
  readonly whitesLocation: WebGLUniformLocation | null
  readonly shadowsLocation: WebGLUniformLocation | null
  readonly contrastLocation: WebGLUniformLocation | null
  readonly exposureLocation: WebGLUniformLocation | null
  readonly highlightsLocation: WebGLUniformLocation | null
  readonly imageLocation: WebGLUniformLocation | null
}

export interface ImageRenderer {
  render: (params: ShaderParameters) => void
  destroy: () => void
}

export interface FullscreenQuad {
  readonly vertexCount: number
  readonly vertexArray: WebGLVertexArrayObject
  readonly vertexBuffer: WebGLBuffer
}

export function createRendererFromElements(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
): ImageRenderer {
  const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true })

  if (!gl) {
    throw new Error('WebGL2 is not available')
  }

  const program = createProgram(gl)
  let texture: WebGLTexture | null = null
  let geometry: FullscreenQuad | null = null

  try {
    texture = createTexture(gl, image)
    geometry = createFullscreenQuad(gl, program)
    const resources: RendererResources = {
      gl,
      program,
      texture,
      geometry,
      imageLocation: gl.getUniformLocation(program, 'uImage'),
      blackLocation: gl.getUniformLocation(program, 'uBlack'),
      whitesLocation: gl.getUniformLocation(program, 'uWhites'),
      shadowsLocation: gl.getUniformLocation(program, 'uShadows'),
      contrastLocation: gl.getUniformLocation(program, 'uContrast'),
      exposureLocation: gl.getUniformLocation(program, 'uExposure'),
      highlightsLocation: gl.getUniformLocation(program, 'uHighlights'),
    }

    return createRenderer(resources)
  } catch (error) {
    if (geometry) {
      gl.deleteVertexArray(geometry.vertexArray)
      gl.deleteBuffer(geometry.vertexBuffer)
    }

    if (texture) {
      gl.deleteTexture(texture)
    }

    gl.deleteProgram(program)

    throw error
  }
}

export function createFullscreenQuad(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
): FullscreenQuad {
  const vertexArray = gl.createVertexArray()
  const vertexBuffer = gl.createBuffer()

  if (!vertexArray || !vertexBuffer) {
    if (vertexArray) gl.deleteVertexArray(vertexArray)
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer)
    throw new Error('Fullscreen quad could not be created')
  }

  gl.bindVertexArray(vertexArray)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // prettier-ignore
  const vertices = new Float32Array([
    -1, -1, 0, 0,
     1, -1, 1, 0,
    -1,  1, 0, 1,

    -1,  1, 0, 1,
     1, -1, 1, 0,
     1,  1, 1, 1,
  ])

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const uvLocation = gl.getAttribLocation(program, 'aUv')
  const positionLocation = gl.getAttribLocation(program, 'aPosition')

  if (uvLocation === -1 || positionLocation === -1) {
    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.deleteVertexArray(vertexArray)
    gl.deleteBuffer(vertexBuffer)
    throw new Error('Fullscreen quad attributes were not found')
  }

  const stride = 4 * Float32Array.BYTES_PER_ELEMENT
  const uvOffset = 2 * Float32Array.BYTES_PER_ELEMENT

  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, 0)
  gl.enableVertexAttribArray(uvLocation)
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, stride, uvOffset)

  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  return {
    vertexCount: 6,
    vertexArray,
    vertexBuffer,
  }
}

export function createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement): WebGLTexture {
  const texture = gl.createTexture()

  if (!texture) {
    throw new Error('Texture could not be created')
  }

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

/**
 * @description
 * Creates the render context that connects editor parameters to WebGL uniforms.
 */
export function createRenderer({
  gl,
  texture,
  program,
  geometry,
  blackLocation,
  whitesLocation,
  shadowsLocation,
  contrastLocation,
  exposureLocation,
  highlightsLocation,
  imageLocation,
}: RendererResources): ImageRenderer {
  const render = ({
    black,
    whites,
    shadows,
    contrast,
    exposure,
    highlights,
  }: ShaderParameters): void => {
    gl.useProgram(program)
    gl.bindVertexArray(geometry.vertexArray)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.uniform1f(blackLocation, black)
    gl.uniform1f(whitesLocation, whites)
    gl.uniform1f(shadowsLocation, shadows)
    gl.uniform1f(contrastLocation, contrast)
    gl.uniform1f(exposureLocation, exposure)
    gl.uniform1f(highlightsLocation, highlights)
    gl.uniform1i(imageLocation, 0)
    gl.drawArrays(gl.TRIANGLES, 0, geometry.vertexCount)
    gl.bindVertexArray(null)
  }

  const destroy = (): void => {
    gl.deleteTexture(texture)
    gl.deleteVertexArray(geometry.vertexArray)
    gl.deleteBuffer(geometry.vertexBuffer)
    gl.deleteProgram(program)
  }

  return { render, destroy }
}

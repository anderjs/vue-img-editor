import { createEngine } from './engine'
import vertexShaderSource from './image.vert.glsl?raw'
import fragmentShaderSource from './image.frag.glsl?raw'

/**
 * @description
 * Reads GLSL files and creates a linked WebGL2 program.
 * @param render - WebGL2 rendering context.
 */
export const createProgram = (render: WebGL2RenderingContext): WebGLProgram => {
  let vertexShader: WebGLShader | null = null
  let fragmentShader: WebGLShader | null = null
  let program: WebGLProgram | null = null

  try {
    vertexShader = createEngine({
      gl: render,
      type: render.VERTEX_SHADER,
      source: vertexShaderSource,
    })
    fragmentShader = createEngine({
      gl: render,
      type: render.FRAGMENT_SHADER,
      source: fragmentShaderSource,
    })
    program = render.createProgram()

    if (!program) {
      throw new Error('WebGL program could not be created')
    }

    render.attachShader(program, vertexShader)
    render.attachShader(program, fragmentShader)
    render.linkProgram(program)

    if (!render.getProgramParameter(program, render.LINK_STATUS)) {
      const log = render.getProgramInfoLog(program)

      throw new Error(`WebGL program linking failed: ${log ?? 'unknown error'}`)
    }

    return program
  } catch (error) {
    if (program) {
      render.deleteProgram(program)
    }

    throw error
  } finally {
    if (vertexShader) {
      render.deleteShader(vertexShader)
    }

    if (fragmentShader) {
      render.deleteShader(fragmentShader)
    }
  }
}

import { createEngine } from './engine'
import vertexShaderSource from './image.vert.glsl?raw'
import fragmentShaderSource from './image.frag.glsl?raw'

/**
 * @description
 * Reads glsl files from our shaders.
 * @param render - WebGL2 rendering context.
 */
export const createProgram = (render: WebGL2RenderingContext) => {
  /**
   * @description
   * Creates an engine reading the vertex glsl.
   */
  const vertexShader = createEngine({
    gl: render,
    type: render.VERTEX_SHADER,
    source: vertexShaderSource,
  }) as WebGLShader

  /**
   * @description
   * Creates an engine reading the fragment glsl.
   */
  const fragmentShader = createEngine({
    gl: render,
    type: render.FRAGMENT_SHADER,
    source: fragmentShaderSource,
  })

  /**
   * @description
   * Creates the program with WebGL2.
   */
  const program = render?.createProgram()

  /**
   * @description
   * Check if program exist.
   */
  if (program && vertexShader && fragmentShader) {
    render.attachShader(program, vertexShader)
    render.attachShader(program, fragmentShader)
    render.linkProgram(program)

    if (render.getProgramParameter(program, render.LINK_STATUS)) {
      return program
    }

    throw new Error('Error sync WebGL')
  }
}

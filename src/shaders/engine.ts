type EngineOptions = {
  gl: WebGL2RenderingContext
  type: number
  source: string
}

/**
 * @description
 * Create an engine shader for WebGL2RenderingContext.
 */
export const createEngine = ({ gl, type, source }: EngineOptions) => {
  const shader = gl.createShader(type)

  /**
   * @description
   * Making sure shader is created.
   */
  if (shader) {
    gl.shaderSource(shader, source)

    gl.compileShader(shader)

    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (compiled) {
      return shader
    }

    const log = gl.getShaderInfoLog(shader)

    gl.deleteShader(shader)

    throw new Error(`${log}`)
  }
}

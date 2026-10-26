type EngineOptions = {
  gl: WebGL2RenderingContext
  type: number
  source: string
}

/**
 * @description
 * Create an engine shader for WebGL2RenderingContext.
 */
export const createEngine = ({ gl, type, source }: EngineOptions): WebGLShader => {
  const shader = gl.createShader(type)

  /**
   * @description
   * Making sure shader is created.
   */
  if (!shader) {
    throw new Error('Shader could not be created')
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  }

  const log = gl.getShaderInfoLog(shader)
  gl.deleteShader(shader)

  throw new Error(`Shader compilation failed: ${log ?? 'unknown error'}`)
}

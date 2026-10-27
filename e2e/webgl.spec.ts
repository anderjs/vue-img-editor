import { readFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'

interface ShaderParameters {
  black: number
  whites: number
  shadows: number
  contrast: number
  exposure: number
  highlights: number
}

const vertexShaderSource = await readFile('src/shaders/image.vert.glsl', 'utf8')
const fragmentShaderSource = await readFile('src/shaders/image.frag.glsl', 'utf8')

const neutralParameters: ShaderParameters = {
  black: 0,
  whites: 0,
  shadows: 0,
  contrast: 1,
  exposure: 1,
  highlights: 0,
}

async function renderToneRamps(page: Page) {
  return page.evaluate(
    ({ fragmentSource, parameters, vertexSource }) => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 1

      const gl = canvas.getContext('webgl2', {
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
      })

      if (!gl) throw new Error('WebGL2 unavailable')

      const compileShader = (type: number, source: string): WebGLShader => {
        const shader = gl.createShader(type)

        if (!shader) throw new Error('Shader creation failed')

        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation failed')
        }

        return shader
      }

      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource)
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
      const program = gl.createProgram()

      if (!program) throw new Error('Program creation failed')

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'Program linking failed')
      }

      const vertexArray = gl.createVertexArray()
      const vertexBuffer = gl.createBuffer()

      if (!vertexArray || !vertexBuffer) throw new Error('Geometry creation failed')

      gl.bindVertexArray(vertexArray)
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
        ]),
        gl.STATIC_DRAW,
      )

      const positionLocation = gl.getAttribLocation(program, 'aPosition')
      const uvLocation = gl.getAttribLocation(program, 'aUv')
      const stride = 4 * Float32Array.BYTES_PER_ELEMENT

      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, stride, 0)
      gl.enableVertexAttribArray(uvLocation)
      gl.vertexAttribPointer(
        uvLocation,
        2,
        gl.FLOAT,
        false,
        stride,
        2 * Float32Array.BYTES_PER_ELEMENT,
      )

      const sourcePixels = new Uint8Array(256 * 4)

      for (let value = 0; value < 256; value += 1) {
        const offset = value * 4
        sourcePixels[offset] = value
        sourcePixels[offset + 1] = value
        sourcePixels[offset + 2] = value
        sourcePixels[offset + 3] = value
      }

      const texture = gl.createTexture()

      if (!texture) throw new Error('Texture creation failed')

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, sourcePixels)

      const setUniforms = (values: ShaderParameters): void => {
        gl.useProgram(program)
        gl.bindVertexArray(vertexArray)
        gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0)
        gl.uniform1f(gl.getUniformLocation(program, 'uBlack'), values.black)
        gl.uniform1f(gl.getUniformLocation(program, 'uWhites'), values.whites)
        gl.uniform1f(gl.getUniformLocation(program, 'uShadows'), values.shadows)
        gl.uniform1f(gl.getUniformLocation(program, 'uContrast'), values.contrast)
        gl.uniform1f(gl.getUniformLocation(program, 'uExposure'), values.exposure)
        gl.uniform1f(gl.getUniformLocation(program, 'uHighlights'), values.highlights)
      }

      const draw = (values: ShaderParameters): number[] => {
        setUniforms(values)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        const output = new Uint8Array(256 * 4)
        gl.readPixels(0, 0, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, output)

        return Array.from(output)
      }

      const results = {
        neutral: draw(parameters),
        blackNegative: draw({ ...parameters, black: -1 }),
        blackPositive: draw({ ...parameters, black: 1 }),
        shadowsNegative: draw({ ...parameters, shadows: -1 }),
        shadowsPositive: draw({ ...parameters, shadows: 1 }),
        highlightsNegative: draw({ ...parameters, highlights: -1 }),
        highlightsPositive: draw({ ...parameters, highlights: 1 }),
        whitesNegative: draw({ ...parameters, whites: -1 }),
        whitesPositive: draw({ ...parameters, whites: 1 }),
        darkRegionsNegative: draw({ ...parameters, black: -1, shadows: -1 }),
        darkRegionsPositive: draw({ ...parameters, black: 1, shadows: 1 }),
        brightRegionsNegative: draw({ ...parameters, highlights: -1, whites: -1 }),
        brightRegionsPositive: draw({ ...parameters, highlights: 1, whites: 1 }),
        exposureNegative: draw({ ...parameters, exposure: 0.5 }),
        exposurePositive: draw({ ...parameters, exposure: 2 }),
        orientation: [] as number[],
        error: 0,
      }

      const sourceCanvas = document.createElement('canvas')
      sourceCanvas.width = 2
      sourceCanvas.height = 2
      const sourceContext = sourceCanvas.getContext('2d')

      if (!sourceContext) throw new Error('2D context unavailable')

      sourceContext.fillStyle = '#ff0000'
      sourceContext.fillRect(0, 0, 1, 1)
      sourceContext.fillStyle = '#00ff00'
      sourceContext.fillRect(1, 0, 1, 1)
      sourceContext.fillStyle = '#0000ff'
      sourceContext.fillRect(0, 1, 1, 1)
      sourceContext.fillStyle = '#ffffff'
      sourceContext.fillRect(1, 1, 1, 1)

      canvas.width = 2
      canvas.height = 2
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)
      setUniforms(parameters)
      gl.viewport(0, 0, 2, 2)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      const orientationPixels = new Uint8Array(2 * 2 * 4)
      gl.readPixels(0, 0, 2, 2, gl.RGBA, gl.UNSIGNED_BYTE, orientationPixels)
      results.orientation = Array.from(orientationPixels)
      results.error = gl.getError()

      gl.deleteTexture(texture)
      gl.deleteBuffer(vertexBuffer)
      gl.deleteVertexArray(vertexArray)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)

      return results
    },
    {
      fragmentSource: fragmentShaderSource,
      parameters: neutralParameters,
      vertexSource: vertexShaderSource,
    },
  )
}

function channelAt(pixels: number[], value: number, channel = 0): number {
  return pixels[value * 4 + channel] ?? -1
}

function expectMonotonic(pixels: number[]): void {
  for (let value = 1; value < 256; value += 1) {
    expect(channelAt(pixels, value)).toBeGreaterThanOrEqual(channelAt(pixels, value - 1))
  }
}

test.describe('WebGL tone processing', () => {
  test('preserves neutral pixels and keeps every regional curve monotonic', async ({ page }) => {
    await page.goto('/')
    const results = await renderToneRamps(page)

    expect(results.error).toBe(0)

    for (let value = 0; value < 256; value += 1) {
      expect(channelAt(results.neutral, value)).toBeCloseTo(value, 0)
      expect(channelAt(results.neutral, value, 3)).toBeCloseTo(value, 0)
    }

    const adjustedRamps = [
      results.blackNegative,
      results.blackPositive,
      results.shadowsNegative,
      results.shadowsPositive,
      results.highlightsNegative,
      results.highlightsPositive,
      results.whitesNegative,
      results.whitesPositive,
      results.darkRegionsNegative,
      results.darkRegionsPositive,
      results.brightRegionsNegative,
      results.brightRegionsPositive,
      results.exposureNegative,
      results.exposurePositive,
    ]

    adjustedRamps.forEach(expectMonotonic)

    expect(channelAt(results.blackNegative, 32)).toBeLessThan(channelAt(results.neutral, 32))
    expect(channelAt(results.blackPositive, 32)).toBeGreaterThan(channelAt(results.neutral, 32))
    expect(channelAt(results.shadowsNegative, 96)).toBeLessThan(channelAt(results.neutral, 96))
    expect(channelAt(results.shadowsPositive, 96)).toBeGreaterThan(channelAt(results.neutral, 96))
    expect(channelAt(results.highlightsNegative, 160)).toBeLessThan(channelAt(results.neutral, 160))
    expect(channelAt(results.highlightsPositive, 160)).toBeGreaterThan(
      channelAt(results.neutral, 160),
    )
    expect(channelAt(results.whitesNegative, 224)).toBeLessThan(channelAt(results.neutral, 224))
    expect(channelAt(results.whitesPositive, 224)).toBeGreaterThan(channelAt(results.neutral, 224))
    expect(channelAt(results.exposureNegative, 128)).toBeCloseTo(64, 0)
    expect(channelAt(results.exposurePositive, 64)).toBeCloseTo(128, 0)

    expect(results.orientation).toEqual([
      0, 0, 255, 255, 255, 255, 255, 255, 255, 0, 0, 255, 0, 255, 0, 255,
    ])
  })

  test('preserves alpha in the composed application preview', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[type="file"]').setInputFiles({
      name: 'semi-transparent-red.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEUlEQVR4nGP4z8DQAMIMMAYAOOgF/REzMMkAAAAASUVORK5CYII=',
        'base64',
      ),
    })

    const canvas = page.locator('canvas.canvas')
    const image = page.locator('img.preview-image')

    await expect(canvas).toBeVisible()
    await expect(image).toHaveCSS('visibility', 'hidden')

    const result = await canvas.evaluate((element) => {
      const gl = element.getContext('webgl2')

      if (!gl) throw new Error('WebGL2 unavailable')

      const pixel = new Uint8Array(4)
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

      return {
        attributes: gl.getContextAttributes(),
        pixel: Array.from(pixel),
      }
    })

    expect(result.attributes?.premultipliedAlpha).toBe(false)
    expect(result.pixel[0]).toBeCloseTo(255, 0)
    expect(result.pixel[1]).toBeCloseTo(0, 0)
    expect(result.pixel[2]).toBeCloseTo(0, 0)
    expect(result.pixel[3]).toBeCloseTo(128, 0)
  })

  test('restores the renderer after WebGL context loss', { tag: '@chromium' }, async ({ page }) => {
    await page.goto('/')
    await page.locator('input[type="file"]').setInputFiles({
      name: 'pixel.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR4nGP4z8DwHwyBNBgAAEnICff5q7YNAAAAAElFTkSuQmCC',
        'base64',
      ),
    })

    const canvas = page.locator('canvas.canvas')
    const image = page.locator('img.preview-image')
    await expect(canvas).toBeVisible()
    await expect(image).toHaveCSS('visibility', 'hidden')

    const canLoseContext = await canvas.evaluate((element) => {
      const gl = element.getContext('webgl2')
      const extension = gl?.getExtension('WEBGL_lose_context')

      if (!extension) return false

      Object.assign(window, { webglLoseContextExtension: extension })
      extension.loseContext()

      return true
    })

    expect(canLoseContext).toBe(true)
    await expect(canvas).toBeHidden()
    await expect(image).toHaveCSS('visibility', 'visible')

    await page.evaluate(() => {
      const extension = Reflect.get(window, 'webglLoseContextExtension') as WEBGL_lose_context
      extension.restoreContext()
    })

    await expect(canvas).toBeVisible()
    await expect(image).toHaveCSS('visibility', 'hidden')
    await expect
      .poll(() =>
        canvas.evaluate((element) => {
          const gl = element.getContext('webgl2')

          if (!gl) return 0

          const pixel = new Uint8Array(4)
          gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

          return pixel[3]
        }),
      )
      .toBeGreaterThan(0)
  })
})

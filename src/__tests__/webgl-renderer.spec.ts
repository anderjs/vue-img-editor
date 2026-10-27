import { describe, expect, it, vi } from 'vitest'
import { createTexture } from '@/utils/webgl-renderer'

function createWebGLContext(options?: { maxTextureSize?: number; uploadError?: number }) {
  const texture = {} as WebGLTexture
  const gl = {
    MAX_TEXTURE_SIZE: 0x0d33,
    NO_ERROR: 0,
    INVALID_VALUE: 0x0501,
    TEXTURE0: 0x84c0,
    TEXTURE_2D: 0x0de1,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    CLAMP_TO_EDGE: 0x812f,
    LINEAR: 0x2601,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    getParameter: vi.fn<(parameter: number) => unknown>(() => options?.maxTextureSize ?? 4096),
    getError: vi.fn<() => number>(() => options?.uploadError ?? 0),
    createTexture: vi.fn<() => WebGLTexture | null>(() => texture),
    deleteTexture: vi.fn<(value: WebGLTexture | null) => void>(),
    activeTexture: vi.fn<(textureUnit: number) => void>(),
    bindTexture: vi.fn<(target: number, value: WebGLTexture | null) => void>(),
    pixelStorei: vi.fn<(parameter: number, value: number | boolean) => void>(),
    texParameteri: vi.fn<(target: number, parameter: number, value: number) => void>(),
    texImage2D: vi.fn<(...args: unknown[]) => void>(),
  }

  return {
    gl: gl as unknown as WebGL2RenderingContext,
    spies: gl,
  }
}

function createImage(width: number, height: number): HTMLImageElement {
  return {
    naturalWidth: width,
    naturalHeight: height,
  } as HTMLImageElement
}

describe('createTexture', () => {
  it('rejects images larger than the GPU texture limit', () => {
    const { gl, spies } = createWebGLContext({ maxTextureSize: 2048 })

    expect(() => createTexture(gl, createImage(4096, 1024))).toThrow(
      'exceed the WebGL texture limit',
    )
    expect(spies.createTexture).not.toHaveBeenCalled()
  })

  it('deletes the texture when WebGL reports an upload error', () => {
    const { gl, spies } = createWebGLContext({ uploadError: 0x0501 })

    expect(() => createTexture(gl, createImage(16, 16))).toThrow(
      'Texture upload failed with WebGL error 1281',
    )
    expect(spies.deleteTexture).toHaveBeenCalledOnce()
    expect(spies.bindTexture).toHaveBeenLastCalledWith(gl.TEXTURE_2D, null)
  })
})

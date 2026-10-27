import type { Brightness } from '@/schema/light'

export const resolveContrast = (contrast: number) => 1 + contrast / 100
export const resolveExposure = (exposure: number) => 2 ** exposure

export type ShaderParameters = Pick<
  Brightness,
  'black' | 'whites' | 'shadows' | 'contrast' | 'exposure' | 'highlights'
>

export const resolveBlack = (black: number) => black / 100
export const resolveWhites = (whites: number) => whites / 100

export const resolveShaderParameters = (brightness: Brightness): ShaderParameters => ({
  black: resolveBlack(brightness.black),
  whites: resolveWhites(brightness.whites),
  shadows: brightness.shadows / 100,
  contrast: resolveContrast(brightness.contrast),
  exposure: resolveExposure(brightness.exposure),
  highlights: brightness.highlights / 100,
})

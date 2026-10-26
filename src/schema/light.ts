import { z } from 'zod'

export const MAX = 100;
export const MIN = -100;
export const EXPOSURE_MAX = 5;
export const EXPOSURE_MIN = -5;

const controls = z.number().min(-100).max(100)

/**
 * @description
 * Light adjusments.
 */
export const brightnessSchema = z.object({
  black: controls.default(0),
  whites: controls.default(0),
  shadows: controls.default(0),
  contrast: controls.default(0),
  exposure: z.number().min(EXPOSURE_MIN).max(EXPOSURE_MAX).default(0),
  highlights: controls.default(0),
})

export type Brightness = z.infer<typeof brightnessSchema>;

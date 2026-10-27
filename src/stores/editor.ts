import { defineStore } from 'pinia'
import type { IUpload } from '@/common/app.types'
import type { Brightness } from '@/schema/light'
import { hasAdjustments } from '@/utils/adjusments'
import { resolveContrast, resolveExposure } from '@/utils/filter'

export interface IEditorState {
  image: IUpload | null
  brightness: Brightness
}

const createDefaultBrightness = (): Brightness => ({
  black: 0,
  whites: 0,
  shadows: 0,
  contrast: 0,
  exposure: 0,
  highlights: 0,
})

export const useEditorStore = defineStore('editor', {
  state: (): IEditorState => ({
    image: null,
    brightness: createDefaultBrightness(),
  }),
  getters: {
    filter: (state) => {
      const exposure = resolveExposure(state.brightness.exposure)
      const contrast = resolveContrast(state.brightness.contrast)

      return {
        filter: `contrast(${contrast}) brightness(${exposure})`,
      }
    },
    disabled: (state) => !state.image,
    hasAdjustments: (state) => hasAdjustments(state.brightness),
  },
  actions: {
    closePhoto() {
      if (this.image) {
        URL.revokeObjectURL(this.image.objectURL)
      }

      this.image = null

      this.resetAdjustments()
    },
    setPreview(upload: IUpload) {
      if (this.image && this.image.objectURL !== upload.objectURL) {
        URL.revokeObjectURL(this.image.objectURL)
      }

      this.image = upload

      this.resetAdjustments()
    },
    resetAdjustments() {
      this.brightness = createDefaultBrightness()
    },
  },
})

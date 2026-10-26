import { defineStore } from 'pinia'
import type { IUpload } from '@/common/app.types'
import type { Brightness } from '@/schema/light'
import { resolveContrast, resolveExposure } from '@/utils/filter'

export interface IEditorState {
  image: IUpload | null
  brightness: Brightness
}

export const useEditorStore = defineStore('editor', {
  state: (): IEditorState => ({
    image: null,
    brightness: {
      black: 0,
      whites: 0,
      shadows: 0,
      contrast: 0,
      exposure: 0,
      highlights: 0,
    },
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
  },
  actions: {
    setPreview(upload: IUpload) {
      this.image = upload
    },
  },

})

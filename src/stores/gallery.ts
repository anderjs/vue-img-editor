import { defineStore } from 'pinia'
import { EngineStore } from '@/storage/engine'

interface IGalleryStore {
  gallery: string[] | null[]
  storage: EngineStore
}

export const useGalleryStore = defineStore('gallery', {
  state: (): IGalleryStore => ({
    gallery: [null, null, null, null, null, null],
    storage: new EngineStore({ directory: 'lume' }),
  }),
  actions: {
    push(image: string) {
      this.gallery.push(image as never)
    },
    pop(index: number) {
      this.gallery.splice(index, 1)
    },
  },
})

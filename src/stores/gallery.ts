import { defineStore } from 'pinia'

interface IGalleryStore {
  gallery: string[]
}

export const useGalleryStore = defineStore('gallery', {
  state: (): IGalleryStore => ({
    gallery: [],
  }),
  actions: {
    push(image: string) {
      this.gallery.push(image)
    },
    pop(index: number) {
      this.gallery.splice(index, 1)
    },
  },
})

import { defineStore } from 'pinia'

interface IGalleryStore {
  gallery: string[] | null[]
}

export const useGalleryStore = defineStore('gallery', {
  state: (): IGalleryStore => ({
    gallery: [null, null, null, null, null, null],
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

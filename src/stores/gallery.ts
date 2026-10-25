import { defineStore } from 'pinia'

interface IGalleryStore {
  gallery: string[]
}

export const useGalleryStore = defineStore('gallery', {
  state: (): IGalleryStore => ({
    gallery: [],
  }),
})

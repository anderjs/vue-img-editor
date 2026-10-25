import { defineStore } from 'pinia'

export interface IEditorState {
  image: string | null
  imageName: string | null
  imageType: string | null
  imageSize: number | null
  imageWidth: number | null
  imageHeight: number | null
}

export const useEditorStore = defineStore('editor', {
  state: (): IEditorState => ({
    image: null as string | null,
    imageName: null as string | null,
    imageType: null as string | null,
    imageSize: null as number | null,
    imageWidth: null as number | null,
    imageHeight: null as number | null,
  }),
})

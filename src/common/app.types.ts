export interface IAppState {
  img: typeof Image
}

export interface IUpload {
  name: string
  size: number
  type: string
  objectURL: string
  lastModified: number
  lastModifiedDate: Date
  webkitRelativePath: string
}

export interface IGalleryImage {
  id: string
  name: string
  type: string
  size: number
  original: Blob
  createdAt: Date
}

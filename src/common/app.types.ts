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

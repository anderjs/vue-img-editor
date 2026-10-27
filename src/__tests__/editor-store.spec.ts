import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { IUpload } from '@/common/app.types'
import { useEditorStore } from '@/stores/editor'

const createUpload = (objectURL: string): IUpload => ({
  name: 'photo.jpg',
  size: 1,
  type: 'image/jpeg',
  objectURL,
  lastModified: 0,
  lastModifiedDate: new Date(0),
  webkitRelativePath: '',
})

describe('editor store photo controls', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  it('resets adjustments without closing the photo', () => {
    const editor = useEditorStore()
    const photo = createUpload('blob:photo')

    editor.setPreview(photo)
    editor.brightness.exposure = 1
    editor.brightness.black = -10

    editor.resetAdjustments()

    expect(editor.image?.objectURL).toBe(photo.objectURL)
    expect(editor.brightness).toEqual({
      black: 0,
      whites: 0,
      shadows: 0,
      contrast: 0,
      exposure: 0,
      highlights: 0,
    })
    expect(URL.revokeObjectURL).not.toHaveBeenCalled()
    expect(editor.hasAdjustments).toBe(false)
  })

  it('releases the previous image and resets adjustments when replaced', () => {
    const editor = useEditorStore()
    const previousPhoto = createUpload('blob:previous')
    const nextPhoto = createUpload('blob:next')

    editor.setPreview(previousPhoto)
    editor.brightness.exposure = 1
    editor.setPreview(nextPhoto)

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previousPhoto.objectURL)
    expect(editor.image?.objectURL).toBe(nextPhoto.objectURL)
    expect(editor.hasAdjustments).toBe(false)
  })

  it('closes the photo, releases its object URL, and resets adjustments', () => {
    const editor = useEditorStore()
    const photo = createUpload('blob:photo')

    editor.setPreview(photo)
    editor.brightness.exposure = 1
    editor.closePhoto()

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(photo.objectURL)
    expect(editor.image).toBeNull()
    expect(editor.hasAdjustments).toBe(false)
  })
})

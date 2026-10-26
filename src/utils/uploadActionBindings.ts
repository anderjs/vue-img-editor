import { shallowRef, type ComponentPublicInstance } from 'vue'

export type UploadActions = {
  clear: () => void
  choose?: () => void
  upload?: () => void
}

export const useUploadActionBindings = () => {
  const actions = shallowRef<UploadActions | null>(null)

  const bind = (
    element: Element | ComponentPublicInstance | null,
    uploadActions: UploadActions,
  ) => {
    if (element) actions.value = uploadActions
  }

  const invoke = (action: keyof UploadActions) => {
    const callback = actions.value?.[action]
    if (!callback) throw new Error(`Upload ${action} action has not been bound`)

    callback()
  }

  return {
    bind,
    clear: () => invoke('clear'),
    choose: () => invoke('choose'),
    upload: () => invoke('upload'),
  }
}

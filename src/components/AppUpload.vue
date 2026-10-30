<script lang="ts" setup>
import { computed } from 'vue'
import Preview from './AppPreview.vue'
import UploadEmptyState from './AppUploadEmptyState.vue'
import PreviewControl from './AppPreviewControl.vue'

import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'

import { useToast } from 'primevue/usetoast'
import { useEditorStore } from '@/stores/editor.ts'
import { useGalleryStore } from '@/stores/gallery.ts'
import { useUploadActionBindings } from '@/utils/uploadActionBindings'

import { uploadStyles } from '@/common/app.styles'
import type { IUpload } from '@/common/app.types.ts'
import config from '@/config'

const toast = useToast()

const editor = useEditorStore()

const gallery = useGalleryStore()

const { bind, choose } = useUploadActionBindings()

const uploadPt = computed(() => ({
  ...uploadStyles.pt,
  root: {
    ...uploadStyles.pt.root,
    class: [uploadStyles.pt.root.class, { 'photo-loaded': Boolean(editor.image) }],
  },
}))

function handleReplace(chooseCallback: () => void, clearCallback: () => void) {
  clearCallback()
  chooseCallback()
}

function handleClose(clearCallback: () => void) {
  clearCallback()
  editor.closePhoto()
}

async function handleSelect({ files }: FileUploadSelectEvent) {
  if (files && Array.isArray(files)) {
    const file = files[0] as IUpload

    try {
      gallery.push(file.objectURL)

      editor.setPreview(file)

      toast.add({
        detail: 'Image upload successfully',
        summary: 'Upload',
        severity: 'success',
      })
    } catch {
      toast.add({
        detail: 'There was an error uploading an Image',
        summary: 'Upload error',
        severity: 'error',
      })
    }
  }
}
</script>

<template>
  <div class="upload-stage">
    <Preview />
    <FileUpload
      name="image"
      mode="advanced"
      accept="image/*"
      :pt="uploadPt"
      :multiple="false"
      :max-file-size="config.MAX_FILE_SIZE"
      @select="handleSelect"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback }">
        <span
          :ref="
            (element) =>
              bind(element, {
                clear: clearCallback,
                choose: chooseCallback,
                upload: uploadCallback,
              })
          "
        />
        <PreviewControl
          v-if="editor.image"
          :can-reset="editor.hasAdjustments"
          @reset="editor.resetAdjustments()"
          @replace="handleReplace(chooseCallback, clearCallback)"
          @close="handleClose(clearCallback)"
        />
      </template>
      <template #content>
        <span aria-hidden="true" />
      </template>
      <template #empty>
        <UploadEmptyState v-if="!editor.image" :on-choose="choose" />
      </template>
    </FileUpload>
  </div>
</template>

<style scoped>
.upload-stage {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 100%;
  place-items: center;
}

.photo-loaded {
  position: absolute;
  z-index: 1;
  inset: 0;
  pointer-events: none;
}

.photo-loaded :deep(.p-fileupload-content) {
  height: 100%;
  box-sizing: border-box;
  border: 0;
  background: transparent;
  pointer-events: auto;
}
</style>

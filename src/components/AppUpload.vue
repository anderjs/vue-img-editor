<script lang="ts" setup>
import Preview from './AppPreview.vue'
import UploadEmptyState from './AppUploadEmptyState.vue'

import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'

import { useToast } from 'primevue/usetoast'
import { useEditorStore } from '@/stores/editor.ts'
import { useUploadActionBindings } from '@/utils/uploadActionBindings'

import { uploadStyles } from '@/common/app.styles'
import type { IUpload } from '@/common/app.types.ts'
import config from '@/config'

const toast = useToast()

const editor = useEditorStore()

const { bind, choose } = useUploadActionBindings()

async function handleSelect({ files }: FileUploadSelectEvent) {
  if (files && Array.isArray(files)) {
    const file = files[0] as IUpload

    try {
      editor.setPreview(file)

      toast.add({
        detail: "Image upload successfully",
        summary: "Upload",
        severity: "success"
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
      v-if="!editor.image"
      :pt="uploadStyles.pt"
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
      </template>
      <template #empty>
        <UploadEmptyState :on-choose="choose" />
      </template>
    </FileUpload>
  </div>
</template>

<style scoped>
.upload-stage {
  display: grid;
  width: 100%;
  min-height: 100%;
  place-items: center;
}
</style>

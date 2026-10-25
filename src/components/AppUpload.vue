<script lang="ts" setup>
import FileUpload from 'primevue/fileupload'
import UploadControl from './AppUploadControl.vue'
import UploadEmptyState from './AppUploadEmptyState.vue'
import { uploadStyles } from '@/common/app.styles'
import { useUploadActionBindings } from '@/utils/uploadActionBindings'

const { bind, choose, clear, upload } = useUploadActionBindings()
</script>

<template>
  <div class="upload-stage">
    <FileUpload
      name="image"
      mode="advanced"
      accept="image/*"
      :pt="uploadStyles.pt"
      :multiple="true"
      :max-file-size="1000000"
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
      <template #content="{ files, removeFileCallback, messages }">
        <UploadControl
          :files="files"
          :messages="messages ?? []"
          :on-clear="clear"
          :on-upload="upload"
          :remove-file-callback="removeFileCallback"
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

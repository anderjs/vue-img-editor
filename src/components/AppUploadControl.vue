<script lang="ts" setup>
import Button from 'primevue/button'
import Message from 'primevue/message'
import UploadFileItem from './AppUploadFileItem.vue'

type Props = {
  files: File[]
  messages: string[]
  onClear: () => void
  onUpload: () => void
  removeFileCallback: (index: number) => void
}

defineProps<Props>()
</script>

<template>
  <div>
    <div v-if="messages.length" class="flex flex-col gap-2">
      <Message v-for="message of messages" :key="message" severity="error">{{ message }}</Message>
    </div>
    <div v-if="files.length" class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-color">{{ files.length }} file(s) selected</span>
        <div class="flex items-center gap-2">
          <Button variant="text" size="small" @click="onUpload">Upload</Button>
          <Button variant="text" size="small" severity="danger" @click="onClear">
            Clear all
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <UploadFileItem
          v-for="(file, index) of files"
          :key="file.name + file.size"
          :file="file"
          :on-remove="() => removeFileCallback(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'

type Props = {
  onChoose: () => void
}

defineProps<Props>()
</script>

<template>
  <section class="empty-state" aria-labelledby="upload-heading">
    <img class="preview-image" src="@/assets/upload-preview.svg" alt="" aria-hidden="true" />
    <p>Drop an image here, or choose one to start editing.</p>
    <Button class="choose-button" label="Choose an image" @click="onChoose" />
    <span class="file-note">JPG, PNG, or WebP · up to 1 MB</span>
  </section>
</template>

<style scoped>
.empty-state {
  display: flex;
  width: min(100%, 400px);
  flex-direction: column;
  align-items: center;
  padding: 24px;
  text-align: center;
}

.preview-image {
  display: block;
  width: min(100%, 264px);
  aspect-ratio: 4 / 3;
  margin-bottom: 26px;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.empty-state h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.empty-state p {
  margin: 8px 0 18px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.choose-button {
  min-height: 38px;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 550;
}

.file-note {
  margin-top: 13px;
  color: var(--text-secondary);
  font-size: 11px;
}
</style>

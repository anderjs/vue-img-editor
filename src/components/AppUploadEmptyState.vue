<script setup lang="ts">
import { Image, Upload } from '@primeicons/vue'
import config from '@/config'
import { formatSize } from '@/utils/formatSize'
import Button from 'primevue/button'

type Props = {
  onChoose: () => void
}

defineProps<Props>()
</script>

<template>
  <section class="empty-state" aria-labelledby="upload-heading">
    <span class="empty-icon" aria-hidden="true">
      <Image class="photo-icon" />
      <Upload class="upload-icon" />
    </span>
    <h1 id="upload-heading">No photo open</h1>
    <p>Drop a photo here or select one from your device.</p>
    <Button class="choose-button" @click="onChoose">
      <Upload class="button-icon" aria-hidden="true" />
      <span>Open photo</span>
    </Button>
    <span class="file-note">
      JPG, PNG, WebP · Max {{ formatSize(config.MAX_FILE_SIZE) }}
    </span>
  </section>
</template>

<style scoped>
.empty-state {
  display: flex;
  width: min(100%, 360px);
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.empty-icon {
  position: relative;
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  margin-bottom: 12px;
  color: var(--primary);
}

.photo-icon {
  width: 22px;
  height: 22px;
}

.upload-icon {
  position: absolute;
  right: -3px;
  bottom: -2px;
  width: 11px;
  height: 11px;
  padding: 2px;
  border-radius: 50%;
  background: var(--workspace);
}

.empty-state h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.empty-state p {
  margin: 6px 0 16px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.choose-button {
  min-height: 36px;
  gap: 8px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 550;
  transition:
    background-color 140ms ease,
    border-color 140ms ease,
    color 140ms ease;
}

.button-icon {
  width: 14px;
  height: 14px;
}

.choose-button:hover {
  background: var(--primary-hover, var(--primary));
}

.file-note {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 11px;
}

@media (prefers-reduced-motion: reduce) {
  .choose-button {
    transition: none;
  }
}
</style>

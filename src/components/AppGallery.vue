<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '@/stores/gallery'

const { gallery } = storeToRefs(useGalleryStore())
</script>

<template>
  <div class="gallery-root">
    <div v-for="(element, index) in gallery" :key="index" class="gallery-item">
      <img
        v-if="element"
        :src="element"
        alt="gallery"
        class="gallery-image aspect-square cursor-pointer hover:opacity-75 transition-opacity"
      />
      <div
        v-else
        class="gallery-empty aspect-square cursor-pointer hover:opacity-75 transition-opacity"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.gallery-root {
  display: grid;
  width: 100%;
  justify-items: center;
  grid-template-columns: minmax(0, 1fr);
  gap: 3.5rem;
}

.gallery-item {
  min-width: 0;
  width: 100%;
  max-width: 64px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: var(--surface-hover);
}

.gallery-empty {
  min-width: 0;
  width: 100%;
  max-width: 64px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 0.5rem;
  background-color: var(--surface-hover);
}

.gallery-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Slider from 'primevue/slider'
import Divider from 'primevue/divider'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useEditorStore } from '@/stores/editor'
import { brightnessSchema, EXPOSURE_MIN, EXPOSURE_MAX, MIN, MAX } from '@/schema/light'

const brightnessResolver = zodResolver(brightnessSchema)
const { disabled, brightness } = storeToRefs(useEditorStore())

const formatExposure = (value: number) => value.toFixed(2)
</script>

<template>
  <section class="adjustment-panel" aria-labelledby="adjustments-heading">
    <header class="panel-header">
      <h2 id="adjustments-heading">Adjustments</h2>
      <span class="active-category">Light</span>
    </header>
    <Divider class="panel-divider" />
    <Form class="brightness-form" :initial-values="brightness" :resolver="brightnessResolver">
      <div class="brightness-field">
        <div class="field-heading">
          <label id="exposure-label" class="brightness-label">Exposure</label>
          <output class="field-value">{{ formatExposure(brightness.exposure) }}</output>
        </div>
        <Slider
          v-model="brightness.exposure"
          aria-labelledby="exposure-label"
          name="exposure"
          class="adjustment-slider"
          :step="0.01"
          :max="EXPOSURE_MAX"
          :min="EXPOSURE_MIN"
          :disabled="disabled"
        />
      </div>
      <div class="brightness-field">
        <div class="field-heading">
          <label id="contrast-label" class="brightness-label">Contrast</label>
          <output class="field-value">{{ brightness.contrast }}</output>
        </div>
        <Slider
          v-model="brightness.contrast"
          aria-labelledby="contrast-label"
          name="contrast"
          class="adjustment-slider"
          :step="1"
          :max="MAX"
          :min="MIN"
          :disabled="disabled"
        />
      </div>
      <div class="brightness-field">
        <div class="field-heading">
          <label id="highlights-label" class="brightness-label">Highlights</label>
          <output class="field-value">{{ brightness.highlights }}</output>
        </div>
        <Slider
          v-model="brightness.highlights"
          aria-labelledby="highlights-label"
          name="highlights"
          class="adjustment-slider"
          :step="1"
          :max="MAX"
          :min="MIN"
          :disabled="disabled"
        />
      </div>
      <div class="brightness-field">
        <div class="field-heading">
          <label id="shadows-label" class="brightness-label">Shadows</label>
          <output class="field-value">{{ brightness.shadows }}</output>
        </div>
        <Slider
          v-model="brightness.shadows"
          aria-labelledby="shadows-label"
          name="shadows"
          class="adjustment-slider"
          :step="1"
          :max="MAX"
          :min="MIN"
          :disabled="disabled"
        />
      </div>
      <div class="brightness-field">
        <div class="field-heading">
          <label id="whites-label" class="brightness-label">Whites</label>
          <output class="field-value">{{ brightness.whites }}</output>
        </div>
        <Slider
          v-model="brightness.whites"
          aria-labelledby="whites-label"
          name="whites"
          class="adjustment-slider"
          :step="1"
          :max="MAX"
          :min="MIN"
          :disabled="disabled"
        />
      </div>
      <div class="brightness-field">
        <div class="field-heading">
          <label id="black-label" class="brightness-label">Blacks</label>
          <output class="field-value">{{ brightness.black }}</output>
        </div>
        <Slider
          v-model="brightness.black"
          aria-labelledby="black-label"
          name="black"
          class="adjustment-slider"
          :step="1"
          :max="MAX"
          :min="MIN"
          :disabled="disabled"
        />
      </div>
    </Form>
  </section>
</template>

<style scoped>
.adjustment-panel {
  width: 100%;
}

.panel-header {
  display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.active-category {
  color: var(--text-secondary);
  font-size: 12px;
}

.panel-divider {
  margin: 0 0 14px;
}

.brightness-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brightness-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.field-heading {
  display: flex;
  min-height: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.brightness-label {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
}

.field-value {
  min-width: 42px;
  color: var(--text-secondary);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.adjustment-slider {
  position: relative;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--border) 72%, var(--surface));
}

.adjustment-slider :deep(.p-slider-range) {
  background: transparent;
}

.adjustment-slider :deep(.p-slider-handle) {
  width: 14px;
  height: 14px;
  border: 1.5px solid color-mix(in srgb, var(--primary) 65%, var(--border));
  border-radius: 50%;
  background: var(--surface);
  cursor: grab;
  transition:
    border-color 120ms ease,
    box-shadow 120ms ease,
    transform 120ms ease;
}

.adjustment-slider :deep(.p-slider-handle:hover) {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 14%, transparent);
}

.adjustment-slider :deep(.p-slider-handle:active) {
  cursor: grabbing;
  transform: scale(1.08);
}

.adjustment-slider :deep(.p-slider-handle:focus-visible) {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.adjustment-slider :deep(.p-slider-handle:focus:not(:focus-visible)) {
  box-shadow: none;
}

@media (prefers-reduced-motion: reduce) {
  .adjustment-slider :deep(.p-slider-handle) {
    transition: none;
    transform: none;
  }
}
</style>

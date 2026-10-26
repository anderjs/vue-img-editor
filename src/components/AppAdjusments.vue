<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Slider from 'primevue/slider'
import Divider from 'primevue/Divider'
import { Form } from '@primevue/forms'

import { useEditorStore } from '@/stores/editor'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { brightnessSchema, EXPOSURE_MIN, EXPOSURE_MAX, MIN, MAX } from '@/schema/light'

const brightnessResolver = zodResolver(brightnessSchema)

const { disabled, brightness } = storeToRefs(useEditorStore())

</script>

<template>
  <div>
    <group>
      <div class="text-xs text-text-secondary text-center mb-2.5">
        Brightness
      </div>
      <Form class="brightness-form" :initialValues="brightness" :resolver="brightnessResolver">
        <div class="brightness-field">
          <label class="brightness-label" for="black">Black</label>
          <Slider
            v-model="brightness.black"
            name="black"
            :step="1"
            :max="MAX"
            :min="MIN"
            :disabled="disabled"
          />
          <span class="label">{{ brightness.black }}</span>
        </div>
        <div class="brightness-field">
          <label class="brightness-label" for="shadows">Shadows</label>
          <Slider
            v-model="brightness.shadows"
            name="shadows"
            :step="1"
            :max="MAX"
            :min="MIN"
            :disabled="disabled"
          />
          <span class="label">{{ brightness.shadows }}</span>
        </div>
        <div class="brightness-field">
          <label class="brightness-label" for="contrast">Contrast</label>
          <Slider
            v-model="brightness.contrast"
            name="contrast"
            :step="1"
            :max="MAX"
            :min="MIN"
            :disabled="disabled"
          />
          <span class="label">{{ brightness.contrast }}</span>
        </div>
        <div class="brightness-field">
          <label class="brightness-label" for="exposure">Exposure</label>
          <Slider
            v-model="brightness.exposure"
            name="exposure"
            :step="0.01"
            :max="EXPOSURE_MAX"
            :min="EXPOSURE_MIN"
            :disabled="disabled"
          />
          <span class="label">{{ brightness.exposure }}</span>
        </div>
        <div class="brightness-field">
          <label class="brightness-label" for="highlights">Highlights</label>
          <Slider
            v-model="brightness.highlights"
            name="highlights"
            :step="1"
            :max="MAX"
            :min="MIN"
            :disabled="disabled"
          />
          <span class="label">{{ brightness.highlights }}</span>
        </div>
      </Form>
    </group>
    <Divider />
  </div>
</template>

<style lang="css" scoped>
.brightness-form,
.brightness-field {
  display: flex;
  flex-direction: column;
  gap: 0.500rem;
}

.brightness-field {
  justify-content: flex-start;
}

.brightness-label {
  font-size: 0.75rem;
}

.label {
  font-size: 10px;
  text-align: center;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppLayout',
})
</script>

<template>
  <div class="layout">
    <slot />
  </div>
</template>

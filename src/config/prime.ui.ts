import Aura from '@primeuix/themes/aura'

export const ui = {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue, components, utilities',
      },
      darkModeSelector: '.app-dark',
    },
  },
}

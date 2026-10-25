import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const LumePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#8bcdb0',
      100: '#8bcdb0',
      200: '#8bcdb0',
      300: '#8bcdb0',
      400: '#8bcdb0',
      500: '#42b883',
      600: '#35a475',
      700: '#35a475',
      800: '#35a475',
      900: '#35a475',
      950: '#35a475',
      color: '#42b883',
      contrastColor: '#121619',
      hoverColor: '#35a475',
      activeColor: '#35a475',
    },
    surface: {
      0: '#f2f5f4',
      50: '#f2f5f4',
      100: '#a1afb4',
      200: '#718087',
      300: '#344149',
      400: '#263139',
      500: '#1b2227',
      600: '#1b2227',
      700: '#1b2227',
      800: '#1b2227',
      900: '#121619',
      950: '#121619',
    },
    content: {
      background: '{surface.800}',
      hoverBackground: '{surface.400}',
      borderColor: '{surface.300}',
      color: '{text.color}',
      hoverColor: '{text.hover.color}',
    },
    formField: {
      background: '{surface.950}',
      disabledBackground: '{surface.700}',
      filledBackground: '{surface.800}',
      filledHoverBackground: '{surface.800}',
      filledFocusBackground: '{surface.800}',
      borderColor: '{surface.300}',
      hoverBorderColor: '{surface.400}',
      focusBorderColor: '{primary.color}',
      color: '{text.color}',
      disabledColor: '{text.muted.color}',
      placeholderColor: '{text.muted.color}',
      floatLabelColor: '{text.muted.color}',
      iconColor: '{text.muted.color}',
    },
    text: {
      color: '#f2f5f4',
      hoverColor: '#f2f5f4',
      mutedColor: '#a1afb4',
      hoverMutedColor: '#718087',
    },
  },
})

export const ui = {
  theme: {
    preset: LumePreset,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue, components, utilities',
      },
      darkModeSelector: '.app-dark',
    },
  },
}

import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

const LumePreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: '#eaf5ef',
          100: '#d4ebdf',
          200: '#a9d7bf',
          300: '#7ec39f',
          400: '#53af7f',
          500: '#2f966b',
          600: '#287f5a',
          700: '#21684a',
          800: '#19513a',
          900: '#123a29',
          950: '#0b2319',
          color: '#2f966b',
          contrastColor: '#ffffff',
          hoverColor: '#287f5a',
          activeColor: '#21684a',
        },
        surface: {
          0: '#ffffff',
          50: '#f8faf9',
          100: '#edf3f0',
          200: '#dce5e0',
          300: '#c8d5ce',
          400: '#a5b7ad',
          500: '#82988c',
          600: '#60736a',
          700: '#46574e',
          800: '#304038',
          900: '#182721',
          950: '#111c17',
        },
        text: {
          color: '#182721',
          hoverColor: '#182721',
          mutedColor: '#60736a',
          hoverMutedColor: '#46574e',
        },
      },
      dark: {
        primary: {
          50: '#e8f6ef',
          100: '#c9ebd9',
          200: '#a9dfc3',
          300: '#8ad3ad',
          400: '#69c797',
          500: '#42b883',
          600: '#35a475',
          700: '#2b875f',
          800: '#21694a',
          900: '#174b35',
          950: '#0e2d20',
          color: '#42b883',
          contrastColor: '#121619',
          hoverColor: '#35a475',
          activeColor: '#2b875f',
        },
        surface: {
          0: '#f2f5f4',
          50: '#d8e0dc',
          100: '#a1afb4',
          200: '#718087',
          300: '#526168',
          400: '#344149',
          500: '#263139',
          600: '#202a30',
          700: '#1b2227',
          800: '#171d21',
          900: '#121619',
          950: '#0d1113',
        },
        text: {
          color: '#f2f5f4',
          hoverColor: '#f2f5f4',
          mutedColor: '#a1afb4',
          hoverMutedColor: '#718087',
        },
      },
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

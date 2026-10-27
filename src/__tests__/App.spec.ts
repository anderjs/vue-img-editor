import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { Moon, Sun } from '@primeicons/vue'
import PrimeVue from 'primevue/config'
import App from '../App.vue'
import { ui } from '../config/prime.ui'

const mountApp = () =>
  mount(App, {
    global: {
      plugins: [createPinia(), [PrimeVue, ui]],
      stubs: {
        RouterView: true,
      },
    },
  })

describe('App', () => {
  it('renders the application shell', () => {
    const wrapper = mountApp()

    expect(wrapper.text()).toContain('Luma')
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('aside nav').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('.shell-body').element.firstElementChild).toBe(
      wrapper.find('.left-sidebar').element,
    )
    expect(wrapper.find('.shell-body').element.children[1]).toBe(
      wrapper.find('main').element,
    )
    expect(wrapper.find('.shell-body').element.lastElementChild).toBe(
      wrapper.find('#application-sidebar').element,
    )
    expect(wrapper.text()).not.toContain('Workspace')
    expect(wrapper.text()).not.toContain('Editor')
  })

  it('toggles the sidebar from the mobile menu control', async () => {
    const wrapper = mountApp()
    const shellBody = wrapper.find('.shell-body')

    expect(shellBody.classes()).not.toContain('sidebar-open')
    await wrapper.get('button[aria-label="Open sidebar"]').trigger('click')
    expect(shellBody.classes()).toContain('sidebar-open')
    expect(
      wrapper.get('button[aria-label="Close sidebar"]').attributes('aria-expanded'),
    ).toBe('true')
  })

  it('switches between dark and light themes', async () => {
    const wrapper = mountApp()
    const toggle = wrapper.get('button[aria-label="Switch to light mode"]')

    expect(document.documentElement.classList.contains('app-dark')).toBe(true)
    expect(toggle.findComponent(Moon).exists()).toBe(true)
    await toggle.trigger('click')
    expect(document.documentElement.classList.contains('app-light')).toBe(true)
    expect(document.documentElement.classList.contains('app-dark')).toBe(false)

    const lightModeToggle = wrapper.get('button[aria-label="Switch to dark mode"]')
    expect(lightModeToggle.findComponent(Sun).exists()).toBe(true)
    await lightModeToggle.trigger('click')
    expect(document.documentElement.classList.contains('app-dark')).toBe(true)
    expect(document.documentElement.classList.contains('app-light')).toBe(false)
  })
})

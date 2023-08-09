import type { VerticalNavItems } from '@/@layouts/types'

export default [
  {
    title: 'Home',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Djanazah',
    to: { name: 'djanazah' },
    icon: { icon: 'tabler-mood-sad' }
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'tabler-file' },
  },
] as VerticalNavItems

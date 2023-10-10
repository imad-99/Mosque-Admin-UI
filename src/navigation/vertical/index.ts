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
    title: 'Lezing',
    to: { name: 'lecture' },
    icon: { icon: 'tabler-school' },
  },
] as VerticalNavItems

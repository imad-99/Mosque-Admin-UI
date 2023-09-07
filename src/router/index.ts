import axios from 'axios'
import queryString, { ParsedQuery } from 'query-string'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach(() => {
  const enableAuth = import.meta.env.VITE_APP_ENABLE_AUTH
  if (enableAuth && Boolean(enableAuth)) {
    if (!localStorage.getItem(import.meta.env.VITE_APP_TOKEN_KEY)) {
      const params: ParsedQuery = queryString.parse(window.location.search);
      if (params.code) {
        const formData: URLSearchParams = new URLSearchParams()
        formData.append('grant_type', 'authorization_code')
        formData.append('code', params.code.toString())
        formData.append('client_id', import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID)
        axios.post(import.meta.env.VITE_APP_KEYCLOAK_TOKEN_URL, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then((result) => {
          const token = result.data.access_token
          console.log(token)
          localStorage.setItem(import.meta.env.VITE_APP_TOKEN_KEY, token)
        })
        .catch((error) => {
          localStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY)
          console.log(error)
        })
      }
    }
  }
})

export default router

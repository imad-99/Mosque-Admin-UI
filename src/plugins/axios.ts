import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URI,
})

const enableAuth = import.meta.env.VITE_APP_ENABLE_AUTH

axiosIns.interceptors.request.use(config => {
  if (enableAuth === 'true') {
    const token = localStorage.getItem(import.meta.env.VITE_APP_TOKEN_KEY)

    config.headers.Authorization = 'Bearer ' + token
  }

  return config
})

axiosIns.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY)
    window.location.href = import.meta.env.VITE_APP_KEYCLOAK_LOGIN_URL
  }
  else {
    return Promise.reject(error)
  }
})

export default axiosIns

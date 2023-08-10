import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URI,
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  const enableAuth = import.meta.env.VITE_APP_ENABLE_AUTH
  if (enableAuth && Boolean(enableAuth)) { 
    const token = localStorage.getItem(import.meta.env.VITE_APP_TOKEN_KEY)

    config.headers.Authorization = 'Bearer ' + token
  }
  
  return config
})

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(response => {
  return response
}, error => {
  // Handle error
  if (error.response && error.response.status === 401) {
    localStorage.removeItem(import.meta.env.VITE_APP_TOKEN_KEY)
    window.location.href = import.meta.env.VITE_APP_KEYCLOAK_LOGIN_URL
  }
  else {
    return Promise.reject(error)
  }
})

export default axiosIns

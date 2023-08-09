import axios from 'axios'

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URI,
})

// ℹ️ Add request interceptor to send the authorization header on each subsequent request after login
axiosIns.interceptors.request.use(config => {
  return config
})

// ℹ️ Add response interceptor to handle 401 response
axiosIns.interceptors.response.use(response => {
  return response
}, error => {
  // Handle error
  if (error.response && error.response.status === 401) {
    window.location.href = 'https://www.google.nl'
  }
  else {
    return Promise.reject(error)
  }
})

export default axiosIns

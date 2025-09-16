import { router } from '@/router';
import axios, { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3002/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de solicitud para incluir el token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        try {
            const auth = JSON.parse(localStorage.getItem('auth') || '{}')
            const token = auth?.token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (err) {
            console.warn('Error al procesar el token de autenticación: ', err)
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Interceptor de respuesta para manejar errores comunes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message) {
            const { status, data } = error.response
            const message = data?.message || 'Acceso no autorizado'

            if (status === 401 || status === 403) {
                localStorage.removeItem('auth')
                router.push({ name: 'Login', query: { reason: message } })
            } else if (status === 404) {
                router.push({ name: 'NotAuthorized' })
            }
        }

        return Promise.reject()
    }
)

export default api
import { createRouter, createWebHistory } from 'vue-router'

import authRoutes from './modules/auth.routes'
import adjuntoRoutes from './modules/adjunto.routes'
import cargoRoutes from './modules/cargo.routes'
import dashboardRoutes from './modules/dashboard.routes'
import tipoEventoRoutes from './modules/tipoevento.routes'
import eventoRoutes from './modules/evento.routes'
import alumnoRoutes from './modules/alumno.routes'
import certificadoRoutes from './modules/certificado.routes'
import instructorRoutes from './modules/instructor.routes'
import trabajadorRoutes from './modules/trabajador.routes'
import usuarioRoutes from './modules/usuario.routes'
import reporteRoutes from './modules/reporte.routes'
import NotAuthorizedRoutes from './modules/401.routes'
import NotFoundRoutes from './modules/404.routes'
import { useAuthStore } from "@/stores/authStore"

// Ruta raíz dinámica
const rootRoute = {
    path: '/',
    redirect: () => {
        const auth = localStorage.getItem('auth')
        return auth ? '/certificado' : '/login'
    }
}

const routes = [
    rootRoute,
    ...authRoutes,
    ...adjuntoRoutes,
    ...cargoRoutes,
    ...dashboardRoutes,
    ...tipoEventoRoutes,
    ...eventoRoutes,
    ...alumnoRoutes,
    ...certificadoRoutes,
    ...instructorRoutes,
    ...trabajadorRoutes,
    ...usuarioRoutes,
    ...reporteRoutes,
    ...NotAuthorizedRoutes,
    ...NotFoundRoutes
]

export const router = createRouter({
    history: createWebHistory('/sistema'),
    routes
})

// Guard global para proteger rutas
router.beforeEach((to, from, next) => {
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)

    const authStore = useAuthStore()

    if (!authStore.usuario) {
        const savedAuth = localStorage.getItem('auth')
        if (savedAuth) {
            const parsed = JSON.parse(savedAuth)
            authStore.usuario = parsed.usuario
        }
    }

    if (authRequired && !authStore.usuario) {
        authStore.returnUrl = to.fullPath
        return next('/login')
    }

    document.title = `${to.meta.title} | Sistema`

    next()
})
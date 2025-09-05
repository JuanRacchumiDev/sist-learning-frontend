import { defineStore } from 'pinia'
import { router } from '@/router'
import { IAuth } from '@/interfaces/authInterface'
import api from '../utils/axios'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        usuario: {
            id: null,
            id_alumno: null,
            id_instructor: null,
            id_trabajador: null,
            id_perfil: null,
            username: '',
            usuario: '',
            slug_perfil: '',
            nombre_perfil: ''
        },
        returnUrl: null as string | null,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async login(username: string, password: string) {
            try {
                const userAgent = "web"

                const authItem: IAuth = {
                    username,
                    password,
                    user_agent: userAgent
                }

                const response = await api.post('/auth/login', authItem)

                const { data } = response

                const { result, message, token, usuario } = data

                if (result) {

                    this.result = result

                    const {
                        id,
                        id_alumno,
                        id_instructor,
                        id_perfil,
                        id_trabajador,
                        nombre_perfil,
                        slug_perfil,
                        username
                    } = usuario

                    this.usuario.id = id
                    this.usuario.id_alumno = id_alumno
                    this.usuario.id_instructor = id_instructor
                    this.usuario.id_trabajador = id_trabajador
                    this.usuario.id_perfil = id_perfil
                    this.usuario.nombre_perfil = nombre_perfil
                    this.usuario.slug_perfil = slug_perfil
                    this.usuario.username = username

                    const dataLogin = {
                        token,
                        usuario: this.usuario
                    }

                    const urlRedireccion = (slug_perfil === 'estudiante' || slug_perfil === 'instructor')
                        ? '/certificado'
                        : '/dashboard'

                    this.message = message
                    localStorage.setItem('auth', JSON.stringify(dataLogin))
                    router.push(this.returnUrl || urlRedireccion)
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }

            } catch (error) {
                this.message = 'Error de autenticación'
                this.result = false
                console.error('Error de autenticación: ', error)
            }
        },

        logout() {
            this.usuario = {
                id: null,
                id_alumno: null,
                id_instructor: null,
                id_trabajador: null,
                id_perfil: null,
                username: '',
                usuario: '',
                slug_perfil: '',
                nombre_perfil: ''
            }
            this.message = '¡Cierre de sesión exitosa'
            this.result = true
            localStorage.removeItem('auth')
            router.push('/login')
        }
    }
})
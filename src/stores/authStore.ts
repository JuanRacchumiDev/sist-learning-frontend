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
            slug_perfil: '',
            nombre_perfil: '',
            nombre_persona: '',
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
                console.log({ response })
                const { data } = response

                const { result, message, token, usuario: dataUsuario } = data

                console.log({ result })

                console.log({ message })

                console.log({ token })

                console.log({ dataUsuario })

                if (result && dataUsuario) {
                    // const {
                    //     usuario: { id, id_perfil, username },
                    //     alumno: { id: idAlumno, nombre_capitalized },
                    //     perfil: { nombre, nombre_url },
                    //     // trabajador: { id: idTrabajador },
                    //     // instructor: { id: idInstructor }
                    // } = dataUsuario

                    const { usuario, perfil, alumno } = dataUsuario

                    this.result = result
                    // this.usuario.id = id
                    this.usuario.id = usuario?.id || null
                    // this.usuario.id_perfil = id_perfil
                    this.usuario.id_perfil = usuario?.id_perfil || null
                    // this.usuario.username = username
                    this.usuario.username = usuario?.username || ''

                    this.usuario.nombre_perfil = perfil?.nombre || ''
                    this.usuario.slug_perfil = perfil?.nombre_url || ''

                    if (alumno) {
                        this.usuario.id_alumno = alumno.id
                        this.usuario.nombre_persona = alumno.nombre_capitalized
                    }

                    console.log('---- this.usuario ----')
                    console.log(this.usuario)

                    this.message = message

                    const dataLogin = {
                        token,
                        usuario: this.usuario
                    }

                    const urlRedireccion = (perfil.nombre_url === 'estudiante' || perfil.nombre_url === 'instructor')
                        ? '/certificado'
                        : '/evento'

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
                slug_perfil: '',
                nombre_perfil: '',
                nombre_persona: ''
            }
            this.message = '¡Cierre de sesión exitosa'
            this.result = true
            localStorage.removeItem('auth')
            router.push('/login')
        }
    }
})
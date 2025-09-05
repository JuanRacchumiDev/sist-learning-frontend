import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IUsuario } from '../interfaces/usuarioInterface'

export const useUsuarioStore = defineStore('usuarioStore', {
    state: () => ({
        usuarios: [] as IUsuario[],
        usuario: null as IUsuario | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchUsuarios() {
            this.loading = false
            this.error = null

            try {
                const response = await api.get('/usuario')
                const { data } = response
                const { result } = data

                if (result) {
                    const usuarios = data.data.map((u: any) => ({
                        ...u,
                        perfil: u.Perfil,
                        alumno: u.Alumno,
                        instructor: u.Instructor,
                        trabajador: u.Trabajador
                    }))

                    this.result = result
                    this.usuarios = usuarios
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching usuarios: ', error)
            } finally {
                this.loading = false
            }
        },
        async getUsuarioById(id: number) {
            try {
                const response = await api.get(`/usuario/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.usuario = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = 'Error al obtener al usuario'
                console.error('Error al obtener el usuario: ', error)
            } finally {
                this.loading = false
            }
        },
        async createUsuario(usuario: IUsuario) {
            try {
                const response = await api.post('/usuario', usuario)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.usuarios.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo usuario"
                this.result = false
                console.error("Error creating usuario: ", error)
            }
        },
        async updateUsuario(idUsuario: number, usuario: IUsuario) {
            try {
                const response = await api.patch(`/usuario/${idUsuario}`, usuario)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar al usuario"
                this.result = false
                console.error('Error updating usuario: ', error)
            }
        },
        async deleteUsuario(idUsuario: number) {
            try {
                const response = await api.delete(`/usuario/${idUsuario}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.usuarios = this.usuarios.filter((us) => us.id !== idUsuario)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar al usuario'
                this.result = false
                console.error('Error deleting usuario: ', error)
            }
        }
    }
})
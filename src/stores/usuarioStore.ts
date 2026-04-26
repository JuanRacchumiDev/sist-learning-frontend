import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IUsuario } from '../interfaces/usuarioInterface'
import { TQuery } from "../types/TQuery"

export const useUsuarioStore = defineStore('usuarioStore', {
    state: () => ({
        usuarios: [] as IUsuario[],
        usuario: null as IUsuario | null,
        pagination: {
            currentPage: 1,
            limit: 10,
            totalPages: 1,
            totalItems: 0,
            nextPage: null,
            previousPage: null
        },
        currentQuery: '',
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchUsuariosPaginate({ page = 1, query = '', limit = 10 }: TQuery) {
            this.loading = false
            this.error = null

            const finalQuery = (query !== undefined && query.length > 0) ? query : this.currentQuery

            if (query !== undefined) {
                this.currentQuery = finalQuery
            }

            console.log({ finalQuery })

            console.log('---- this.currentQuery ----')
            console.log(this.currentQuery)

            try {
                const response = await api.get('/usuario/paginate', {
                    params: {
                        page,
                        limit,
                        busqueda: finalQuery
                    }
                })

                const { data } = response

                const { result, data: usuariosData, pagination, message } = data

                if (result) {
                    this.usuarios = usuariosData
                    this.pagination = pagination
                    this.result = result
                    this.message = message || "Usuarios cargados exitosamente"
                } else {
                    this.usuarios = []
                    this.pagination = { ...this.pagination, totalItems: 0, totalPages: 1, currentPage: 1 }
                    this.result = false
                    this.message = message || "No se pudieron cargar los usuarios"
                }

                // const response = await api.get('/usuario')
                // console.log('---- response fetchUsuarios ----')
                // console.log({ response })

                // const { data } = response
                // const { result } = data

                // if (result) {
                //     const usuarios = data.data.map((u: any) => ({
                //         ...u,
                //         perfil: u.perfil,
                //         alumno: u.alumno,
                //         instructor: u.instructor,
                //         trabajador: u.trabajador
                //     }))

                //     this.result = result
                //     this.usuarios = usuarios
                // }
            } catch (error) {
                this.result = false
                this.message = "Error al cargar los usuarios"
                console.error('Error fetching usuarios: ', error)
            } finally {
                this.loading = false
            }
        },
        async fetchUsuarioById(id: number) {
            try {
                const response = await api.get(`/usuario/${id}`)
                const { data: dataUsuario } = response
                const { data, message, result, status, error } = dataUsuario

                // if (result) {
                //     this.result = result
                //     this.usuario = data.data
                // } else {
                //     this.message = message || data.error || 'Error desconocido'
                // }

                if (result) {
                    this.result = result
                    this.usuario = data as IUsuario
                    this.message = message || "Usuario obtenido correctamente"
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = 'Error al obtener al usuario'
                this.error = error instanceof Error ? error.message : 'Error desconocido'
                console.error('Error al obtener el usuario: ', error)
            } finally {
                this.loading = false
            }
        },
        async createUsuario(usuario: IUsuario) {
            // this.loading = true;
            // this.message = '';
            // this.result = false;

            try {
                console.log('---- payload usuario ----')
                console.log({ usuario })

                const response = await api.post('/usuario', usuario)

                const { data: dataUsuario } = response

                const { result, message, error, data } = dataUsuario

                if (result) {
                    this.result = result
                    this.usuarios.push(data)
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
                const { data: dataUsuario } = response
                const { result, message, error } = dataUsuario

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar al usuario"
                this.result = false
                console.error('Error updating usuario: ', error)
            }
        },
        async updateEstado(idEvento: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/usuario/cambiar-estado/${idEvento}`, {
                    estado: newEstado
                })
                const { data: dataUsuario } = response
                const { result, message, error } = dataUsuario

                if (result) {
                    this.result = result
                    this.message = message
                    this.fetchUsuariosPaginate({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al actualizar el estado"
                console.error('Error updating evento: ', error)
            }
        },
        async deleteUsuario(idUsuario: number) {
            try {
                const response = await api.delete(`/usuario/${idUsuario}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.message = message
                    // this.usuarios = this.usuarios.filter((us) => us.id !== idUsuario)
                    // this.message = message
                    this.fetchUsuariosPaginate({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
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
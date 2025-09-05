import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IPerfil } from '../interfaces/perfilInterface'

export const usePerfilStore = defineStore('perfilStore', {
    state: () => ({
        perfiles: [] as IPerfil[],
        perfil: null as IPerfil | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchPerfiles(estado: boolean | null = null) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/perfil')
                const { data } = response
                const { result } = data

                if (result) {
                    const perfiles = data.data

                    if (estado) {
                        this.result = result
                        this.perfiles = perfiles.filter((perfil: IPerfil) => perfil.estado === estado)
                    } else {
                        this.perfiles = perfiles
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching perfiles: ', error)
            } finally {
                this.loading = false
            }
        },
        async getPerfilById(id: number) {
            try {
                const response = await api.get(`/perfil/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.perfil = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al obtener el perfil"
                console.error('Error al obtener el perfil: ', error)
            } finally {
                this.loading = false
            }
        },
        async createPerfil(perfil: IPerfil) {
            try {
                const response = await api.post('/perfil', perfil)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.perfiles.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo perfil"
                this.result = false
                console.error('Error creating perfil: ', error)
            }
        },
        async updatePerfil(idPerfil: number, perfil: IPerfil) {
            try {
                const response = await api.patch(`/perfil/${idPerfil}`, perfil)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar el perfil"
                this.result = false
                console.error('Error updating perfil: ', error)
            }
        },
        async updateEstado(idPerfil: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/perfil/cambiar-estado/${idPerfil}`, {
                    estado: newEstado
                })
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.message = data.message
                } else {
                    this.message = data.message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al actualizar el estado"
                console.error('Error updating perfil: ', error)
            }
        },
        async deletePerfil(idPerfil: number) {
            try {
                const response = await api.delete(`/perfil/${idPerfil}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.perfiles = this.perfiles.filter((perfil) => perfil.id !== idPerfil)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el perfil'
                this.result = false
                console.error('Error deleting perfil: ', error)
            }
        }
    }
})
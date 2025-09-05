import { defineStore } from 'pinia'
import api from '../utils/axios'
import { ITipoEvento } from '../interfaces/tipoEventoInterface'

export const useTipoEventoStore = defineStore('tipoEventoStore', {
    state: () => ({
        tipos: [] as ITipoEvento[],
        tipoEvento: null as ITipoEvento | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchTipoEventos(estado: boolean | null = null) {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/tipo-evento')
                const { data } = response
                const { result } = data

                if (result) {
                    const tipos = data.data

                    if (estado) {
                        this.result = result
                        this.tipos = tipos.filter((tipo: ITipoEvento) => tipo.estado === estado)
                    } else {
                        this.tipos = tipos
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching tipo eventos: ', error)
            } finally {
                this.loading = false
            }
        },
        async getTipoEventoById(id: number) {
            try {
                const response = await api.get(`/tipo-evento/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.tipoEvento = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el tipo de evento"
                console.error('Error al obtener el tipo evento: ', error)
            } finally {
                this.loading = false
            }
        },
        async getTipoEventoByNombre(nombre: string) {
            try {
                const url = `/tipo-evento/nombre/${nombre}`
                const response = await api.get(`${url}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.tipoEvento = data.data
                } else {
                    this.tipoEvento = null
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el tipo de evento"
                console.error('Error al obtener el tipo evento: ', error)
            } finally {
                this.loading = false
            }
        },
        async createTipoEvento(tipoEvento: ITipoEvento) {
            try {
                const response = await api.post('/tipo-evento', tipoEvento)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.tipos.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo tipo de evento"
                this.result = false
                console.error('Error creating tipo evento: ', error)
            }
        },
        async updateTipoEvento(idTipoEvento: number, tipoEvento: ITipoEvento) {
            try {
                const response = await api.patch(`/tipo-evento/${idTipoEvento}`, tipoEvento)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar el tipo de evento"
                this.result = false
                console.error('Error updating tipo evento: ', error)
            }
        },
        async updateEstado(idTipoEvento: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/tipo-evento/cambiar-estado/${idTipoEvento}`, {
                    estado: newEstado
                })
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al actualizar el estado"
                console.error('Error updating tipo evento: ', error)
            }
        },
        async deleteTipoEvento(idTipoEvento: number) {
            try {
                const response = await api.delete(`/tipo-evento/${idTipoEvento}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.tipos = this.tipos.filter((tipo) => tipo.id !== idTipoEvento)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el tipo de evento'
                this.result = false
                console.error('Error deleting tipo evento: ', error)
            }
        }
    }
})
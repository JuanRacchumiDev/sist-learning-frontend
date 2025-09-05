import { defineStore } from 'pinia'
import api from '../utils/axios'
import { ITipoDocumento } from '../interfaces/tipoDocumentoInterface'

export const useTipoDocumentoStore = defineStore('tipoDocumentoStore', {
    state: () => ({
        tipos: [] as ITipoDocumento[],
        tipoDocumento: null as ITipoDocumento | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchTipos() {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/tipo-documento')
                const { data } = response
                const { result } = data

                if (result) {
                    this.result = result
                    this.tipos = data.data
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching tipo documentos: ', error)
            } finally {
                this.loading = false
            }
        },
        async fetchTiposPorCategoria(categoria: String) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get(`/tipo-documento/categoria/${categoria}`)
                const { data } = response
                const { result } = data

                if (result) {
                    this.result = result
                    this.tipos = data.data
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching tipo documentos por categoria: ', error)
            } finally {
                this.loading = false
            }
        },
        async getTipoDocumentoById(id: number) {
            try {
                const response = await api.get(`/tipo-documento/${id}`)
                const { data } = response
                const { result } = data

                if (result) {
                    this.result = result
                    this.tipos = data.data
                }
            } catch (error) {
                this.result = false
                console.error('Error al obtener el tipo documento: ', error)
            } finally {
                this.loading = false
            }
        },
        async createTipoDocumento(tipoDocumento: ITipoDocumento) {
            try {
                const response = await api.post('/tipo-documento', tipoDocumento)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.tipos.push(response.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un tipo de documento"
                this.result = false
                console.error('Error creating tipo documento: ', error)
            }
        },
        async updateTipoDocumento(idTipoDocumento: number, tipoDocumento: ITipoDocumento) {
            try {
                const response = await api.patch(`/tipo-documento/${idTipoDocumento}`, tipoDocumento)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al actualizar el tipo de documento'
                this.result = false
                console.error('Error updating tipo documento: ', error)
            }
        },
        async deleteTipoDocumento(idTipoDocumento: number) {
            try {
                const response = await api.delete(`/tipo-documento/${idTipoDocumento}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.tipos = this.tipos.filter((tipo) => tipo.id !== idTipoDocumento)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }

            } catch (error) {
                this.message = 'Error al eliminar el tipo de documento'
                this.result = false
                console.error('Error deleting tipo documento: ', error)
            }
        }
    }
})
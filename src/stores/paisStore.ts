import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IPais } from '../interfaces/paisInterface'

export const usePaisStore = defineStore('paisStore', {
    state: () => ({
        paises: [] as IPais[],
        pais: null as IPais | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchPaises() {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/pais')
                const { data } = response
                const { result } = data

                if (result) {
                    const paises = response.data.data
                    this.paises = paises
                    this.result = result
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching paises: ', error)
            } finally {
                this.loading = false
            }
        },
        async getPaisById(id: number) {
            try {
                const response = await api.get(`/pais/${id}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.pais = data.data
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al país"
                console.error('Error al obtener el país: ', error)
            } finally {
                this.loading = false
            }
        },
        async createPais(pais: IPais) {
            try {
                const response = await api.post('/pais', pais)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.paises.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo país"
                this.result = false
                console.error('Error creating país: ', error)
            }
        },
        async updatePais(idPais: number, pais: IPais) {
            try {
                const response = await api.patch(`/alumno/${idPais}`, pais)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar al país"
                this.result = false
                console.error('Error updating país: ', error)
            }
        },
        async deletePais(idPais: number) {
            try {
                const response = await api.delete(`/pais/${idPais}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.paises = this.paises.filter((a) => a.id !== idPais)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el país'
                this.result = false
                console.error('Error deleting país: ', error)
            }
        }
    }
})
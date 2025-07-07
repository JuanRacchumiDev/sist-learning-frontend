import { defineStore } from 'pinia'
import api from '../utils/axios'
import { ICargo } from '../interfaces/cargoInterface'

export const useCargoStore = defineStore('cargoStore', {
    state: () => ({
        cargos: [] as ICargo[],
        cargo: null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchCargos(estado: boolean | null = null) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/cargo')
                const { data } = response
                const { result } = data

                if (result) {
                    this.result = result
                    const cargos = data.data

                    if (estado) {
                        this.cargos = cargos.filter((cargo: ICargo) => cargo.estado === estado)
                    } else {
                        this.cargos = cargos
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching cargos: ', error)
            } finally {
                this.loading = false
            }
        },
        async getCargoById(id: number) {
            try {
                const response = await api.get(`/cargo/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.cargo = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al obtener el cargo"
                console.error(`Error al obtener el cargo: ${error}`)
            } finally {
                this.loading = false
            }
        },
        async getCargoByNombre(nombre: string) {
            try {
                const url = `/cargo/nombre/${nombre.trim()}`

                const response = await api.get(`${url}`)

                const { data } = response

                const { result, message } = data

                if (result) {
                    this.result = result
                    this.cargo = data.data
                } else {
                    this.cargo = null
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el cargo"
                console.error("Error al obtener el cargo: ", error)
            } finally {
                this.loading = false
            }
        },
        async createCargo(cargo: ICargo) {
            try {
                const response = await api.post('/cargo', cargo)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.cargos.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un cargo"
                this.result = false
                console.error('Error creating cargo: ', error)
            }
        },
        async updateCargo(idCargo: number, cargo: ICargo) {
            try {
                const response = await api.put(`/cargo/${idCargo}`, cargo)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualiza el cargo"
                this.result = false
                console.error("Error updating cargo: ", cargo)
            }
        },
        async updateEstado(idCargo: number, newCargo: boolean) {
            try {
                const response = await api.put(`/cargo/cambiar-estado/${idCargo}`, {
                    estado: newCargo
                })
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al actualizar el estado"
                console.error('Error updating cargo: ', error)
            }
        },
        async deleteCargo(idCargo: number) {
            try {
                const response = await api.delete(`/cargo/${idCargo}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.cargos = this.cargos.filter((cargo) => cargo.id !== idCargo)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el cargo'
                this.result = false
                console.error('Error deleting cargo: ', error)
            }
        }
    }
})
import { defineStore } from 'pinia'
import api from '../utils/axios'
import { ITrabajador } from '../interfaces/trabajadorInterface'

export const useTrabajadorStore = defineStore('trabajadorStore', {
    state: () => ({
        trabajadores: [] as ITrabajador[],
        trabajador: null as ITrabajador | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchTrabajadores(estado: boolean | null = null) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/trabajador')

                const { data: dataPersonas } = response
                const { result, data } = dataPersonas

                if (result) {
                    this.result = result

                    if (estado) {
                        this.trabajadores = data.filter((trabajador: ITrabajador) => trabajador.estado === estado)
                    } else {
                        this.trabajadores = data
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching trabajadores: ', error)
            } finally {
                this.loading = false
            }
        },
        async getTrabajadorById(id: number) {
            try {
                const response = await api.get(`/trabajador/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.trabajador = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el cargo"
                console.error('Error al obtener el trabajador: ', error)
            } finally {
                this.loading = false
            }
        },
        async getTrabajadorByTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
            try {
                this.trabajador = null
                this.message = ""

                const url = `/trabajador/tipo-documento/${idTipoDoc}/numero-documento/${numDoc}`
                const response = await api.get(`${url}`)

                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.trabajador = data.data
                    this.message = message
                } else {
                    this.trabajador = null
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al trabajador"
                this.trabajador = null
                console.error('Error al obtener al trabajador: ', error)
            } finally {
                this.loading = false
            }
        },
        async createTrabajador(trabajador: ITrabajador) {
            try {
                const response = await api.post('/trabajador', trabajador)

                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.trabajadores.push(data.data)
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo trabajador"
                this.result = false
                console.error('Error creating trabajador: ', error)
            }
        },
        async updateTrabajador(idTrabajador: number, trabajador: ITrabajador) {
            try {
                const response = await api.patch(`/trabajador/${idTrabajador}`, trabajador)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar al trabajador"
                this.result = false
                console.error('Error updating trabajador: ', error)
            }
        },
        async deleteTrabajador(idTrabajador: number) {
            try {
                const response = await api.delete(`/trabajador/${idTrabajador}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.trabajadores = this.trabajadores.filter((trabajador) => trabajador.id !== idTrabajador)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el trabajador'
                this.result = false
                console.error('Error deleting trabajador: ', error)
            }
        }
    }
})
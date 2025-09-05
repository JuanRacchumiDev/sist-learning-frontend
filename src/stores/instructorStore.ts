import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IInstructor } from '../interfaces/instructorInterface'

export const useInstructorStore = defineStore('instructorStore', {
    state: () => ({
        instructores: [] as IInstructor[],
        instructor: null as IInstructor | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchInstructores() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/instructor')

                const { data: dataInstructores } = response

                const { result, data } = dataInstructores

                if (result) {
                    this.instructores = data

                    this.result = result
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching instructores: ', error)
            } finally {
                this.loading = false
            }
        },
        async getInstructorById(id: number) {
            try {
                const response = await api.get(`/instructor/${id}`)

                const { data: dataInstructor } = response

                const { result, message, error, data } = dataInstructor

                if (result) {
                    this.result = result
                    this.instructor = data
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al instructor"
                console.error('Error al obtener al instructor: ', error)
            } finally {
                this.loading = false
            }
        },
        async getInstructorByTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
            try {
                this.instructor = null
                this.message = ""

                const url = `/instructor/tipo-documento/${idTipoDoc}/numero-documento/${numDoc}`

                const response = await api.get(`${url}`)

                const { data: dataInstructor } = response

                const { result, message, error, data } = dataInstructor

                if (result) {
                    this.result = result
                    this.instructor = data
                    this.message = message
                } else {
                    this.instructor = null
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al instructor"
                this.instructor = null
                console.error('Error al obtener al instructor: ', error)
            } finally {
                this.loading = false
            }
        },
        async createInstructor(instructor: IInstructor) {
            try {
                const response = await api.post('/instructor', instructor)

                const { data: dataInstructor } = response

                const { result, message, error, data } = dataInstructor

                if (result) {
                    this.result = result
                    this.instructores.push(data)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo instructor"
                this.result = false
                console.error('Error creating instructor: ', error)
            }
        },
        async updateInstructor(idInstructor: number, instructor: IInstructor) {
            try {
                const response = await api.patch(`/instructor/${idInstructor}`, instructor)

                const { data: dataInstructor } = response

                const { result, message, error } = dataInstructor

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar al instructor"
                this.result = false
                console.error('Error updating instructor: ', error)
            }
        },
        async updateEstado(idInstructor: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/instructor/cambiar-estado/${idInstructor}`, {
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
                console.error('Error updating instructor: ', error)
            }
        },
        async deleteInstructor(idInstructor: number) {
            try {
                const response = await api.delete(`/instructor/${idInstructor}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.instructores = this.instructores.filter((a) => a.id !== idInstructor)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar al instructor'
                this.result = false
                console.error('Error deleting instructor: ', error)
            }
        }
    }
})
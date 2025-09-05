import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IAlumno } from '../interfaces/alumnoInterface'
import { TQuery } from '../types/TQuery';

export const useAlumnoStore = defineStore('alumnoStore', {
    state: () => ({
        alumnos: [] as IAlumno[],
        alumno: null as IAlumno | null,
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
        async fetchAlumnos(estado: boolean | null = null) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/alumno')

                const { data: dataAlumnos } = response

                const { result, data } = dataAlumnos

                if (result) {
                    this.result = result

                    if (estado) {
                        this.alumnos = data.filter((alumno: IAlumno) => alumno.estado === estado)
                    } else {
                        this.alumnos = data
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching alumnos: ', error)
            } finally {
                this.loading = false
            }
        },
        async fetchAlumnosPaginate({ page = 1, query = '', limit = 10 }: TQuery) {
            this.loading = true
            this.error = null

            const finalQuery = (query !== undefined && query.length > 0) ? query : this.currentQuery

            if (query !== undefined) {
                this.currentQuery = finalQuery
            }

            try {
                const response = await api.get('/alumno/paginate', {
                    params: {
                        page,
                        limit,
                        busqueda: finalQuery
                    }
                })

                const { data } = response

                const { result, data: alumnosData, pagination, message } = data

                if (result) {
                    this.alumnos = alumnosData
                    this.pagination = pagination
                    this.result = result
                    this.message = message || "Alumnos cargados exitosamente"
                } else {
                    this.alumnos = []
                    this.pagination = { ...this.pagination, totalItems: 0, totalPages: 1, currentPage: 1 }
                    this.result = false;
                    this.message = message || 'No se pudieron cargar los alumnos';
                }
            } catch (error) {
                this.result = false;
                this.message = 'Error al cargar los alumnos.';
                console.error('Error fetching alumnos: ', error);
            } finally {
                this.loading = false
            }
        },
        async getAlumnoById(id: number) {
            try {
                const response = await api.get(`/alumno/${id}`)
                const { data: dataAlumno } = response
                const { result, message, data, error } = dataAlumno

                if (result) {
                    this.result = result
                    this.alumno = data as IAlumno
                    this.message = message || "Alumno encontrado correctamente"
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al alumno"
                console.error('Error al obtener al alumno: ', error)
            } finally {
                this.loading = false
            }
        },
        async getAlumnoByTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
            try {
                this.alumno = null
                this.message = ""

                const url = `/alumno/tipo-documento/${idTipoDoc}/numero-documento/${numDoc}`
                const response = await api.get(`${url}`)

                const { data: dataAlumno } = response
                const { result, message, data, error } = dataAlumno

                if (result) {
                    this.result = result
                    this.alumno = data as IAlumno
                    this.message = message
                } else {
                    this.alumno = null
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al alumno"
                this.alumno = null
                console.error('Error al obtener al alumno: ', error)
            } finally {
                this.loading = false
            }
        },
        async createAlumno(alumno: IAlumno) {
            try {
                const response = await api.post('/alumno', alumno)
                const { data: dataAlumno } = response
                const { result, message, error, data } = dataAlumno

                if (result) {
                    this.result = result
                    this.alumnos.push(data)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo alumno"
                this.result = false
                console.error('Error creating alumno: ', error)
            }
        },
        async updateAlumno(idAlumno: number, alumno: IAlumno) {
            try {
                const response = await api.patch(`/alumno/${idAlumno}`, alumno)
                const { data: dataAlumno } = response
                const { result, message, error } = dataAlumno

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar el alumno"
                this.result = false
                console.error('Error updating alumno: ', error)
            }
        },
        async updateEstado(idAlumno: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/alumno/cambiar-estado/${idAlumno}`, {
                    estado: newEstado
                })
                const { data: dataAlumno } = response
                const { result, message, error } = dataAlumno

                if (result) {
                    this.result = result
                    this.message = message
                    this.fetchAlumnosPaginate({
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
                console.error('Error updating alumno: ', error)
            }
        },
        async deleteAlumno(idAlumno: number) {
            try {
                const response = await api.delete(`/alumno/${idAlumno}`)

                const { data } = response

                const { result, message, error } = data

                if (result) {
                    this.result = result

                    this.message = message

                    this.fetchAlumnosPaginate({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el alumno'

                this.result = false

                console.error('Error deleting alumno: ', error)
            }
        }
    }
})
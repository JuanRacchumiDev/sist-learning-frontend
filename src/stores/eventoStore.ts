import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IEvento } from '../interfaces/eventoInterface'
import { TQuery } from '../types/TQuery';

export const useEventoStore = defineStore('eventoStore', {
    state: () => ({
        eventos: [] as IEvento[],
        evento: null as IEvento | null,
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
        async fetchEventos(estado: boolean | null = null) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/evento')

                const { data: dataEventos } = response

                const { result, data } = dataEventos

                if (result) {
                    this.result = result

                    if (estado) {
                        this.eventos = data.filter((evento: IEvento) => evento.estado === estado)
                    } else {
                        this.eventos = data
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching eventos: ', error)
            } finally {
                this.loading = false
            }
        },
        async fetchEventosPaginate({ page = 1, query = '', limit = 10 }: TQuery) {
            this.loading = true
            this.error = null

            const finalQuery = (query !== undefined && query.length > 0) ? query : this.currentQuery

            if (query !== undefined) {
                this.currentQuery = finalQuery
            }

            try {
                const response = await api.get('/evento/paginate', {
                    params: {
                        page,
                        limit,
                        busqueda: finalQuery
                    }
                })

                const { data } = response

                const { result, data: eventosData, pagination, message } = data

                if (result) {
                    this.eventos = eventosData
                    this.pagination = pagination
                    this.result = result
                    this.message = message || "Eventos cargados exitosamente"
                } else {
                    this.eventos = []
                    this.pagination = { ...this.pagination, totalItems: 0, totalPages: 1, currentPage: 1 }
                    this.result = false;
                    this.message = message || 'No se pudieron cargar los eventos';
                }

            } catch (error) {
                this.result = false;
                this.message = 'Error al cargar los eventos.';
                console.error('Error fetching eventos: ', error);
            } finally {
                this.loading = false
            }
        },
        async getEventoById(id: number) {
            try {
                const response = await api.get(`/evento/${id}`)
                const { data: dataEvento } = response
                const { result, message, data, error } = dataEvento

                if (result) {
                    this.result = result
                    this.evento = data
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el evento"
                console.error('Error al obtener el evento: ', error)
            } finally {
                this.loading = false
            }
        },
        async getEventoByTitulo(titulo: string) {
            try {
                const url = `/evento/titulo/${titulo}`
                const response = await api.get(`${url}`)
                const { data: dataEvento } = response
                const { result, message, data, error } = dataEvento

                if (result) {
                    this.result = result
                    this.evento = data
                } else {
                    this.evento = null
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el evento"
                console.error('Error al obtener el evento: ', error)
            } finally {
                this.loading = false
            }
        },
        async createEvento(evento: IEvento) {
            try {
                const response = await api.post('/evento', evento)
                const { data: dataEvento } = response
                const { result, message, error, data } = dataEvento

                if (result) {
                    this.result = result
                    this.eventos.push(data)
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo evento"
                this.result = false
                console.error('Error creating evento: ', error)
            }
        },
        async updateEvento(idEvento: number, evento: IEvento) {
            try {
                const response = await api.patch(`/evento/${idEvento}`, evento)
                const { data: dataEvento } = response
                const { result, message, error } = dataEvento

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar el evento"
                this.result = false
                console.error('Error updating evento: ', error)
            }
        },
        async updateEstado(idEvento: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/evento/cambiar-estado/${idEvento}`, {
                    estado: newEstado
                })
                const { data: dataEvento } = response
                const { result, message, error } = dataEvento

                if (result) {
                    this.result = result
                    this.message = message
                    this.fetchEventosPaginate({
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
        async deleteEvento(idEvento: number) {
            try {
                const response = await api.delete(`/evento/${idEvento}`)
                const { data } = response
                const { result, message, error } = data

                if (result) {
                    this.result = result
                    this.message = message
                    this.fetchEventosPaginate({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el evento'
                this.result = false
                console.error('Error deleting evento: ', error)
            }
        }
    }
})
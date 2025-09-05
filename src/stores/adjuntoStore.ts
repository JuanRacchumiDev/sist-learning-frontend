import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IAdjunto } from '../interfaces/adjuntoInterface'

export const useAdjuntoStore = defineStore('adjuntoStore', {
    state: () => ({
        adjuntos: [] as IAdjunto[],
        adjunto: null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchAdjuntos() {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/adjunto')
                const { data } = response
                const { result } = data

                if (result) {
                    const adjuntos = data.data.map((a: any) => ({
                        ...a,
                        evento: a.Evento
                    }))

                    this.result = result
                    this.adjuntos = adjuntos
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching adjuntos: ', error)
            } finally {
                this.loading = false
            }
        },
        async getAdjuntoById(id: number) {
            try {
                const response = await api.get(`/adjunto/${id}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.adjunto = data.data
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener al adjunto"
                console.error('Error al obtener al adjunto: ', error)
            } finally {
                this.loading = false
            }
        },
        async createAdjunto(file: FormData) {
            try {
                const response = await api.post('/adjunto/upload', file, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.adjuntos.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear un nuevo adjunto"
                this.result = false
                console.error('Error creating adjunto: ', error)
            }
        },
        async updateAdjunto(idAdjunto: number, adjunto: IAdjunto) {
            try {
                const response = await api.patch(`/adjunto/${idAdjunto}`, adjunto)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al actualizar el adjunto"
                this.result = false
                console.error('Error updating adjunto: ', error)
            }
        },
        async downloadAdjunto(idAdjunto: number) {
            try {
                const urlApi = `/adjunto/${idAdjunto}/download`

                const response = await api.get(urlApi, {
                    responseType: 'blob'
                })

                const { status, data } = response

                if (status === 200) {
                    this.result = true
                    this.message = "Adjunto descargado correctamente"

                    const responseAdjunto = await this.getAdjuntoById(idAdjunto)

                    const fileName = 'prueba-de-flores'

                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');

                    link.href = url;
                    link.setAttribute('download', `${fileName}`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else {
                    this.result = false
                    this.message = "Error al descargar el certificado"
                }
            } catch (error) {
                this.result = false
                this.message = "Error para descargar el certificado"
                console.error('Error downloading certificado', error)
            }
        },
        async updateEstado(idAdjunto: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/adjunto/cambiar-estado/${idAdjunto}`, {
                    estado: newEstado
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
                console.error('Error updating adjunto: ', error)
            }
        },
        async deleteAdjunto(idAdjunto: number) {
            try {
                const response = await api.delete(`/adjunto/${idAdjunto}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.adjuntos = this.adjuntos.filter((a) => a.id !== idAdjunto)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = 'Error al eliminar el adjunto'
                this.result = false
                console.error('Error deleting adjunto: ', error)
            }
        }
    }
})
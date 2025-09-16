import { IPlantilla } from '../interfaces/plantillaInterface'
import { defineStore } from 'pinia'
import api from '../utils/axios'

export const usePlantillaStore = defineStore('plantillaStore', {
    state: () => ({
        plantillas: [] as IPlantilla[],
        plantilla: null as IPlantilla | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchPlantillas() {
            this.loading = true
            this.error = null

            try {
                const response = await api.get('/plantilla')

                const { data: dataPlantillas } = response

                const { result, data } = dataPlantillas

                if (result) {
                    this.result = result
                    this.plantillas = data
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching plantillas: ', error)
            } finally {
                this.loading = false
            }
        },
        async getPlantillasByEvento(idEvento: number) {
            try {
                const response = await api.get(`/plantilla/evento/${idEvento}`)
                const { data: dataPlantillas } = response
                const { result, data } = dataPlantillas

                if (result) {
                    this.result = result
                    this.plantillas = data
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching plantillas: ', error)
            } finally {
                this.loading = false
            }
        },
        async getPlantillasByTipoEventoOrEvento(idEvento: number, idTipoEvento: number) {
            try {
                let listPlantillas: IPlantilla[] = []

                const responseForEvento = await api.get(`/plantilla/evento/${idEvento}`)
                const { data: dataPlantillasForEvento } = responseForEvento
                // console.log({ dataPlantillasForEvento })

                const {
                    result: resultForEvento,
                    data: dataForEvento
                } = dataPlantillasForEvento

                if (resultForEvento) {
                    listPlantillas = dataForEvento as IPlantilla[]
                    if (listPlantillas.length == 0) {
                        const responseForTipoEvento = await api.get(`/plantilla/tipo-evento/${idTipoEvento}`)
                        const { data: dataPlantillasForTipoEvento } = responseForTipoEvento
                        // console.log({ dataPlantillasForTipoEvento })

                        const {
                            result: resultForTipoEvento,
                            data: dataForTipoEvento
                        } = dataPlantillasForTipoEvento

                        if (resultForTipoEvento) {
                            listPlantillas = dataForTipoEvento as IPlantilla[]
                            this.result = resultForTipoEvento
                            this.plantillas = listPlantillas
                        }
                    } else {
                        this.result = resultForEvento
                        this.plantillas = listPlantillas
                    }
                }
            } catch (error) {
                this.result = false
                console.error('Error fetching plantillas: ', error)
            } finally {
                this.loading = false
            }
        }
    }
})
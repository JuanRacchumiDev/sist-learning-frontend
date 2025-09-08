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
        }
    }
})
import { defineStore } from 'pinia'
import api from '../utils/axios'
import { IPersona } from '../interfaces/personaInterface'

export const usePersonaStore = defineStore('personaStore', {
    state: () => ({
        personas: [] as IPersona[],
        persona: null as IPersona | null,
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async getDocumentoInfo(idTipoDocumento: number, numeroDocumento: string) {
            this.error = null

            try {
                const url = `/documento/infodoc/${idTipoDocumento}/numdoc/${numeroDocumento}`
                const response = await api.get(`${url}`)
                const { data } = response
                const { result, message } = data

                if (result) {
                    const persona = data.data
                    this.persona = persona
                    const index = this.personas.findIndex((p) => p.id === persona.id)

                    if (index !== -1) {
                        this.personas[index] = persona
                    } else {
                        this.personas.push(persona)
                    }

                    this.message = message
                    this.result = result
                } else {
                    this.result = result
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = `Error al obtener la persona`
            }
        },
        async getPersonaByTipoDocNumDoc(idTipoDoc: number, numDoc: string) {
            try {
                this.persona = null
                this.message = ""

                const url = `/persona/idtipo/${idTipoDoc}/numdoc/${numDoc}`
                const response = await api.get(`${url}`)

                const { data } = response
                const { result, message } = data

                if (result) {
                    this.persona = data.data
                    this.message = message
                } else {
                    this.persona = null
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al obtener la persona"
                this.persona = null
                this.result = false
            } finally {
                this.loading = false
            }
        },
        async createPersona(persona: IPersona) {
            try {
                const response = await api.post('/persona', persona)
                const { data } = response
                const { result, message } = data

                if (result) {
                    this.result = result
                    this.personas.push(data.data)
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.message = "Error al crear una nueva persona"
                this.result = false
            }
        }
    }
})
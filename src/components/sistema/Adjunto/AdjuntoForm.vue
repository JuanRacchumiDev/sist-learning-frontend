<template>
    <div class="px-6 py-4">
        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
                <div class="mb-1">
                    <label for="id_evento" class="block text-sm font-medium text-gray-700">Evento:
                        <span class="text-red-500">*</span>
                    </label>
                    <select name="id_evento" id="id_evento" v-model="adjunto.id_evento"
                        class="mt-1 p-2 border border-gray-300 rounded w-full">
                        <option value="">- SELECCIONE -</option>
                        <option v-for="evento in eventos" :value="evento.id" :key="evento.id">
                            {{ evento.titulo }}
                        </option>
                    </select>
                    <div v-if="errors.id_evento" class="text-red-600 text-sm mt-1">{{ errors.id_evento }}</div>
                </div>
                <div class="mb-1">
                    <label for="titulo" class="block text-sm font-medium text-gray-700">Título: <span
                            class="text-red-500">*</span></label>
                    <input v-model="adjunto.titulo" type="text" id="titulo" autocomplete="off" maxlength="120"
                        placeholder="Ejm: Marco de trabajo del evento"
                        class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
                    <div v-if="errors.titulo" class="text-red-600 text-sm mt-1">{{ errors.titulo }}</div>
                </div>
                <div class="mb-1">
                    <label class="inline-flex items-center">
                        <input type="checkbox" v-model="adjunto.es_descargable" class="mr-2" />
                        <span class="text-gray-700">Descargable</span>
                    </label>
                </div>
                <div class="mb-1">
                    <label class="inline-flex items-center">
                        <input type="checkbox" v-model="adjunto.es_visible" class="mr-2" />
                        <span class="text-gray-700">Visible</span>
                    </label>
                </div>
                <div class="mb-1">
                    <label for="archivo" class="block text-sm font-medium text-gray-700">Archivo: <span
                            class="text-red-500">*</span></label>
                    <input type="file" @change="handleFile" class="mb-4" />
                    <div v-if="errors.file" class="text-red-600 text-sm mt-1">{{ errors.file }}</div>
                </div>
            </div>
            <div class="flex justify-between">
                <button type="submit"
                    class="flex items-center px-4 py-2 bg-greenwhite-600 text-white rounded-md hover:bg-greenwhite-700 disabled:bg-greenwhite-300 disabled:cursor-not-allowed"
                    :class="{ 'opacity-50 cursor-not-allowed': isDuplicated }" :disabled="isDuplicated || loading">
                    <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 animate-spin" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    </svg>
                    {{
                        loading
                            ? 'Cargando...'
                            : adjunto.id
                                ? 'Actualizar'
                                : 'Registrar'
                    }}
                </button>
                <button type="button"
                    class="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    :disabled="loading" @click="cancelar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useAdjuntoStore, useEventoStore, useToastStore } from '@/stores'
import { useRoute } from 'vue-router'

export default {
    setup() {
        const adjunto = ref({
            id: null,
            id_evento: '',
            titulo: '',
            file: null,
            es_descargable: true,
            es_visible: true
        })

        const file = ref(null)
        const loading = ref(false)
        const isDuplicated = ref(false)
        const errors = ref({})

        const storeAdjunto = useAdjuntoStore()
        const storeEvento = useEventoStore()
        const storeToast = useToastStore()

        const route = useRoute()

        const eventos = computed(() => {
            return [...storeEvento.eventos].sort((a, b) => a.titulo?.localeCompare(b.titulo))
        })

        const MAX_FILE_SIZE = 2 * 1024 * 1024

        const validateForm = () => {
            errors.value = {}

            if (!adjunto.value.id_evento) {
                errors.value.id_evento = 'Seleccione un evento'
            }

            if (!adjunto.value.titulo.trim()) {
                errors.value.titulo = 'El título es obligatorio'
            }

            if (!file.value) {
                errors.value.file = 'Debe seleccionar un archivo'
            } else {
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg']

                if (!allowedTypes.includes(file.value.type)) {
                    errors.value.file = 'Solo se permiten archivos PDF o imágenes JPG/JPEG'
                }

                if (file.value.size > MAX_FILE_SIZE) {
                    errors.value.file = 'El archivo no debe exceder los 2MB'
                }
            }

            return Object.keys(errors.value).length === 0
        }

        onMounted(async () => {
            storeEvento.fetchEventos()

            const adjuntoId = route.params.id

            if (adjuntoId) {
                await storeAdjunto.getAdjuntoById(adjuntoId)
                adjunto.value = storeAdjunto.adjunto || {}
            }

            storeAdjunto.message = ""
        })

        const handleFile = (e) => {
            const selectedFile = e.target.files[0]
            file.value = selectedFile

            if (!selectedFile) {
                errors.value.file = 'Debe seleccionar un archivo'
                return
            }

            const allowedTypes = ['application/pdf', 'image/jpg', 'image/jpeg']

            if (!allowedTypes.includes(selectedFile.type)) {
                errors.value.file = 'Formato no permitido. Use PDF, JPG o JPEG'
                file.value = null
                return
            }

            if (selectedFile.size > MAX_FILE_SIZE) {
                errors.value.file = 'El archivo supera el límite de 2MB'
                file.value = null
                return
            }

            errors.value.file = ''
        }

        const submitForm = async () => {
            if (!validateForm()) return

            const formData = new FormData()

            loading.value = true
            isDuplicated.value = false

            try {
                adjunto.value.file = file.value
                formData.append('id_evento', adjunto.value.id_evento)
                formData.append('titulo', adjunto.value.titulo.trim())
                formData.append('file', file.value)

                adjunto.value.titulo = adjunto.value.titulo.trim()

                if (adjunto.value.id) {
                    await storeAdjunto.updateAdjunto(adjunto.value.id, adjunto.value)
                    const classToast = (storeAdjunto.result) ? 'success' : 'error'
                    storeToast.addToast(storeAdjunto.message, classToast)
                } else {
                    await storeAdjunto.createAdjunto(formData)
                    const classToast = (storeAdjunto.result) ? 'success' : 'error'
                    storeToast.addToast(storeAdjunto.message, classToast)
                    if (storeAdjunto.result) resetForm()
                    isDuplicated.value = false
                }
            } catch (error) {
                storeToast.addToast('Falló al registrar adjunto', 'error')
                isDuplicated.value = false
            } finally {
                loading.value = false
            }
        }

        const cancelar = () => {
            adjunto.value = {
                id_evento: '',
                titulo: '',
                file: null,
                es_descargable: true,
                es_visible: true
            }
            isDuplicated.value = false
        }

        const resetForm = () => {
            adjunto.value = {
                id_evento: '',
                titulo: '',
                file: null,
                es_descargable: true,
                es_visible: true
            }
            isDuplicated.value = false
        }

        return {
            adjunto,
            eventos,
            loading,
            isDuplicated,
            submitForm,
            handleFile,
            errors,
            cancelar,
        }
    }
}

</script>
<template>
    <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
        <!-- Encabezado con búsqueda y botón -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-2/3">
                <!-- Filtro por Evento -->
                <select v-model="selectedEvento" @change="applyFilters"
                    class="w-full sm:w-1/2 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white">
                    <option value="">Evento</option>
                    <option v-for="evento in eventos" :key="evento.id" :value="evento.id">{{ evento.titulo }}</option>
                </select>
                <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Título"
                    class="w-full sm:w-1/2 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
            </div>
            <router-link to="/adjunto/nuevo"
                class="inline-flex items-center gap-2 self-end md:self-auto rounded bg-greenwhite-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-greenwhite-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
                        clip-rule="evenodd" />
                </svg>
                Nuevo
            </router-link>
        </div>
        <!-- Tabla -->
        <div class="flex flex-col">
            <!-- Cabecera -->
            <div class="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 text-center text-xs">
                <!--
                <div class="p-2.5 xl:p-5 text-left sm:text-center">
                    <h5 class="text-xs font-medium uppercase xsm:text-sm">ID</h5>
                </div>
                -->
                <div class="p-2.5 xl:p-5">
                    <h5 class="uppercase">Evento</h5>
                </div>
                <div class="p-2.5 xl:p-5">
                    <h5 class="uppercase">Título</h5>
                </div>
                <div class="p-2.5 xl:p-5">
                    <h5 class="uppercase">Descargar</h5>
                </div>
                <div class="p-2.5 xl:p-5">
                    <h5 class="uppercase">Estado</h5>
                </div>
                <div class="p-2.5 xl:p-5">
                    <h5 class="uppercase">Acciones</h5>
                </div>
            </div>

            <!-- Filas -->
            <div v-if="filteredAdjuntos.length === 0"
                class="flex justify-center py-6 text-xs text-gray-500 dark:text-gray-300">
                No se encontraron adjuntos.
            </div>

            <div v-for="(adjunto, index) in paginatedAdjuntos" :key="adjunto.id"
                :class="`grid grid-cols-5 sm:grid-cols-5 items-center text-xs ${index < paginatedAdjuntos.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
                <!--
                <div class="p-2.5 xl:p-5 text-left sm:text-center text-black dark:text-white">
                    {{ adjunto.id }}
                </div>
                -->
                <div class="p-2.5 xl:p-5 flex items-center justify-start">
                    <p class="text-black dark:text-white">{{ adjunto.evento.titulo }}</p>
                </div>
                <div class="p-2.5 xl:p-5 flex items-center justify-start">
                    <p class="text-black dark:text-white">{{ adjunto.titulo }}</p>
                </div>
                <div class="p-2.5 xl:p-5 flex items-center justify-center">
                    <button @click="downloadAdjunto(adjunto)"
                        class="text-green-500 hover:text-green-700 flex items-center justify-center">
                        <DownloadIcon class="h-6 w-6 text-red-500" />
                    </button>
                </div>
                <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
                    <button @click="requestToggleEstado(adjunto.id)"
                        class="focus:outline-none hover:scale-105 transition-transform">
                        <svg v-if="adjunto.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-2.5 xl:p-5 flex justify-center relative">
                    <div class="relative">
                        <button @click="toggleDropdown(adjunto.id)"
                            class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                            <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6v.01M12 12v.01M12 18v.01" />
                            </svg>
                        </button>

                        <!-- Dropdown -->
                        <div v-if="dropdownVisibleId === adjunto.id"
                            class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
                            <router-link :to="{ name: 'editAdjunto', params: { id: adjunto.id } }"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                Editar
                            </router-link>
                            <button @click="() => { requestDeleteAdjunto(adjunto.id); dropdownVisibleId = null }"
                                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Paginación -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center gap-2 flex-wrap text-xs">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
                class="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                Anterior
            </button>
            <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="[
                'px-3 py-1 border rounded transition-colors duration-200',
                currentPage === page ? 'bg-blue-600 text-white border-blue-600 active' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
                {{ page }}
            </button>
            <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
                class="px-3 py-1 text-sm border rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
                Siguiente
            </button>
        </div>
        <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este adjunto?" @confirmed="deleteadjunto"
            @canceled="isConfirmVisible = false" />
        <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
            message="¿Estás seguro que deseas cambiar el estado de este adjunto?" @confirmed="toggleEstado"
            @canceled="isEstadoConfirmVisible = false" />
        <Notification v-if="notificationMessage" :message="notificationMessage" :duration="4000"
            @hide="notificationMessage = ''"></Notification>
    </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAdjuntoStore, useEventoStore } from '@/stores'
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue"
import Notification from "@/components/Common/Notification.vue"
import { DownloadIcon } from "@heroicons/vue/outline"

export default {
    components: {
        ConfirmDialog,
        Notification,
        DownloadIcon
    },
    setup() {
        const adjuntoStore = useAdjuntoStore()
        const eventoStore = useEventoStore()

        const eventos = computed(() => {
            return [...eventoStore.eventos].sort((a, b) => a.titulo.localeCompare(b.titulo))
        })

        const adjuntos = computed(() => adjuntoStore.adjuntos)
        const message = computed(() => adjuntos.message)

        const searchInput = ref('')
        const searchQuery = ref('')
        const selectedEvento = ref('')
        const dropdownVisibleId = ref(null)
        const currentPage = ref(1)
        const itemsPerPage = 10

        const isConfirmVisible = ref(false)
        const notificationMessage = ref('')
        const adjuntoToDelete = ref(null)

        const isEstadoConfirmVisible = ref(false)
        const adjuntoToToggleEstado = ref(null)

        const filteredAdjuntos = computed(() => {
            return adjuntos.value.filter(adjunto =>
                adjunto.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
                (selectedEvento.value ? adjunto.id_tipoadjunto === parseInt(selectedEvento.value) : true)
            )
        })

        const totalPages = computed(() => Math.ceil(filteredAdjuntos.value.length / itemsPerPage))

        const paginatedAdjuntos = computed(() =>
            filteredAdjuntos.value.slice(
                (currentPage.value - 1) * itemsPerPage,
                currentPage.value * itemsPerPage
            )
        )

        const toggleDropdown = (id) => {
            dropdownVisibleId.value = dropdownVisibleId.value === id ? null : id
        }

        const handleClickOutside = (e) => {
            if (!e.target.closest('.relative')) {
                dropdownVisibleId.value = null
            }
        }

        const requestToggleEstado = (id) => {
            adjuntoToToggleEstado.value = id
            isEstadoConfirmVisible.value = true
        }

        const toggleEstado = async () => {
            const adjunto = adjuntos.value.find(a => a.id === adjuntoToToggleEstado.value)
            const nuevoEstado = !adjunto.estado
            await adjuntoStore.updateEstado(adjuntoToToggleEstado.value, nuevoEstado)
            notificationMessage.value = message
            isEstadoConfirmVisible.value = false
            adjuntoToToggleEstado.value = null
            adjuntoStore.fetchAdjuntos()
        }

        const requestDeleteAdjunto = (id) => {
            adjuntoToDelete.value = id
            isConfirmVisible.value = true
        }

        const deleteAdjunto = async () => {
            if (adjuntoToDelete.value) {
                await adjuntoStore.deleteAdjunto(adjuntoToDelete.value)
                notificationMessage.value = message
                isConfirmVisible.value = false
                adjuntoToDelete.value = null
                adjuntoStore.fetchAdjuntos()
            }
        }

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page
            }
        }

        const applySearch = () => {
            searchQuery.value = searchInput.value.trim()
            currentPage.value = 1
        }

        const applyFilters = () => {
            currentPage.value = 1
        }

        const downloadAdjunto = (adjunto) => {
            adjuntoStore.downloadAdjunto(adjunto.id);
        }

        onMounted(() => {
            adjuntoStore.fetchAdjuntos()
            eventoStore.fetchEventos()
            window.addEventListener('click', handleClickOutside)
        })

        onUnmounted(() => {
            window.removeEventListener('click', handleClickOutside)
        })

        watch(filteredAdjuntos, () => {
            currentPage.value = 1
        })

        return {
            eventos,
            adjuntos,
            requestDeleteAdjunto,
            isConfirmVisible,
            deleteAdjunto,
            notificationMessage,
            totalPages,
            paginatedAdjuntos,
            filteredAdjuntos,
            changePage,
            searchQuery,
            searchInput,
            applySearch,
            applyFilters,
            requestToggleEstado,
            toggleEstado,
            isEstadoConfirmVisible,
            adjuntoToToggleEstado,
            dropdownVisibleId,
            toggleDropdown,
            selectedEvento,
            downloadAdjunto
        }
    }
}
</script>
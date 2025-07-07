<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <!-- Encabezado con búsqueda y botón -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-2/3">
        <!-- Filtro por Tipo de Evento -->
        <select v-model="selectedTipoEvento" @change="applyFilters"
          class="w-full sm:w-1/2 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white">
          <option value="">Tipo de evento</option>
          <option v-for="tipo in tipos" :key="tipo.id" :value="tipo.id">{{ tipo.nombre }}</option>
        </select>

        <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Título"
          class="w-full sm:w-1/2 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
      </div>

      <router-link to="/evento/nuevo"
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
      <div class="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4 text-center text-xs">
        <!--
        <div class="p-2.5 xl:p-5 text-left sm:text-center">
          <h5 class="uppercase">ID</h5>
        </div>
        -->
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Título</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Tipo de evento</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Estado</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Acciones</h5>
        </div>
      </div>

      <!-- Filas -->
      <div v-if="filteredEventos.length === 0"
        class="flex justify-center py-6 text-xs text-gray-500 dark:text-gray-300">
        No se encontraron eventos.
      </div>

      <div v-for="(evento, index) in paginatedEventos" :key="evento.id"
        :class="`grid grid-cols-4 sm:grid-cols-4 items-center text-xs ${index < paginatedEventos.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <!--
        <div class="p-2.5 xl:p-5 text-left sm:text-center text-black dark:text-white">
          {{ evento.id }}
        </div>
        -->
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ evento.titulo }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <p class="text-black dark:text-white text-center w-full">{{ evento.TipoEvento ? evento.TipoEvento.nombre :
            '--' }}</p>
        </div>
        <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
          <button @click="requestToggleEstado(evento.id)"
            class="focus:outline-none hover:scale-105 transition-transform">
            <svg v-if="evento.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-2.5 xl:p-5 flex justify-center relative">
          <div class="relative">
            <button @click="toggleDropdown(evento.id)"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownVisibleId === evento.id"
              class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <router-link :to="{ name: 'editEvento', params: { id: evento.id } }"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Editar
              </router-link>
              <button @click="() => { requestDeleteEvento(evento.id); dropdownVisibleId = null }"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400">
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
      message="¿Estás seguro de que deseas eliminar este evento?" @confirmed="deleteEvento"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este evento?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useTipoEventoStore, useEventoStore, useToastStore } from '@/stores'
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue"
import Notification from "@/components/Common/Notification.vue"

export default {
  components: {
    ConfirmDialog,
    Notification
  },
  setup() {
    const tipoEventoStore = useTipoEventoStore()
    const eventoStore = useEventoStore()
    const storeToast = useToastStore()

    const tipos = computed(() => {
      return [...tipoEventoStore.tipos].sort((a, b) => a.nombre.localeCompare(b.nombre))
    })
    const eventos = computed(() => eventoStore.eventos)
    const message = computed(() => eventoStore.message)

    const searchInput = ref('')
    const searchQuery = ref('')
    const selectedTipoEvento = ref('')
    const dropdownVisibleId = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 10

    const isConfirmVisible = ref(false)
    const eventoToDelete = ref(null)

    const isEstadoConfirmVisible = ref(false)
    const eventoToToggleEstado = ref(null)

    const filteredEventos = computed(() => {
      return eventos.value.filter(evento =>
        evento.titulo.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        (selectedTipoEvento.value ? evento.id_tipoevento === parseInt(selectedTipoEvento.value) : true)
      )
    }
    )

    const totalPages = computed(() => Math.ceil(filteredEventos.value.length / itemsPerPage))

    const paginatedEventos = computed(() =>
      filteredEventos.value.slice(
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
      eventoToToggleEstado.value = id
      isEstadoConfirmVisible.value = true
    }

    const toggleEstado = async () => {
      const evento = eventos.value.find(e => e.id === eventoToToggleEstado.value)
      const nuevoEstado = !evento.estado
      await eventoStore.updateEstado(eventoToToggleEstado.value, nuevoEstado)
      const classToast = (eventoStore.result) ? 'success' : 'false'
      storeToast.addToast(message, classToast)
      isEstadoConfirmVisible.value = false
      eventoToToggleEstado.value = null
      eventoStore.fetchEventos()
    }

    const requestDeleteEvento = (id) => {
      eventoToDelete.value = id
      isConfirmVisible.value = true
    }

    const deleteEvento = async () => {
      if (eventoToDelete.value) {
        await eventoStore.deleteEvento(eventoToDelete.value)
        const classToast = (eventoStore.result) ? 'success' : 'error'
        storeToast.addToast(message, classToast)
        isConfirmVisible.value = false
        eventoToDelete.value = null
        eventoStore.fetchEventos()
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

    onMounted(() => {
      tipoEventoStore.fetchTipoEventos()
      eventoStore.fetchEventos()
      window.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside)
    })

    watch(filteredEventos, () => {
      currentPage.value = 1
    })

    return {
      tipos,
      eventos,
      requestDeleteEvento,
      isConfirmVisible,
      deleteEvento,
      totalPages,
      paginatedEventos,
      filteredEventos,
      changePage,
      searchQuery,
      searchInput,
      applySearch,
      applyFilters,
      requestToggleEstado,
      toggleEstado,
      isEstadoConfirmVisible,
      eventoToToggleEstado,
      selectedTipoEvento,
      dropdownVisibleId,
      toggleDropdown
    }
  }
}
</script>
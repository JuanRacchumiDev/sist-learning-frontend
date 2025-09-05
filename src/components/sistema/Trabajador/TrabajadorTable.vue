<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <!-- Encabezado con búsqueda y botón -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Número de documento"
        class="w-full sm:w-1/3 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
      <router-link to="/trabajador/nuevo"
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
      <div class="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7 text-center text-xs">
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Tipo documento</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Cargo</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Número documento</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Apellidos</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Nombres</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Estado</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Acciones</h5>
        </div>
      </div>

      <!-- Filas -->
      <div v-if="filteredTrabajadores.length === 0"
        class="flex justify-center py-6 text-xs text-gray-500 dark:text-gray-300">
        No se encontraron trabajadores.
      </div>

      <div v-for="(trabajador, index) in paginatedTrabajadores" :key="trabajador.id"
        :class="`grid grid-cols-7 sm:grid-cols-7 items-center text-xs ${index < paginatedTrabajadores.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{ trabajador.tipoDocumento ? trabajador.tipoDocumento.abreviatura : '--' }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{
              trabajador.cargo ? trabajador.cargo.nombre : '--'
            }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{
              trabajador.numero_documento
            }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ trabajador.apellido_paterno }} {{
            trabajador.apellido_materno }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ trabajador.nombres }}</p>
        </div>
        <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
          <button @click="requestToggleEstado(trabajador.id)"
            class="focus:outline-none hover:scale-105 transition-transform">
            <svg v-if="trabajador.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
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
            <button @click="toggleDropdown(trabajador.id)"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownVisibleId === trabajador.id"
              class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <router-link :to="{ name: 'editTrabajador', params: { id: trabajador.id } }"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Editar
              </router-link>
              <button @click="() => { requestDeleteTrabajador(trabajador.id); dropdownVisibleId = null }"
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
        'px-3 py-1 text-sm border rounded transition-colors duration-200',
        currentPage === page ? 'bg-blue-600 text-white border-blue-600 active' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      ]">
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)"
        class="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
        Siguiente
      </button>
    </div>
    <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este trabajador?" @confirmed="deleteTrabajador"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este trabajador?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
    <Notification v-if="notificationMessage" :message="notificationMessage" :duration="4000"
      @hide="notificationMessage = ''"></Notification>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useTrabajadorStore } from '@/stores'
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue"
import Notification from "@/components/Common/Notification.vue"

export default {
  components: {
    ConfirmDialog,
    Notification
  },
  setup() {
    const trabajadorStore = useTrabajadorStore()
    const trabajadores = computed(() => trabajadorStore.trabajadores)
    const message = computed(() => trabajadorStore.message)

    const searchInput = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const dropdownVisibleId = ref(null)
    const itemsPerPage = 10

    const isConfirmVisible = ref(false)
    const notificationMessage = ref('')
    const trabajadorToDelete = ref(null)

    const isEstadoConfirmVisible = ref(false)
    const trabajadorToToggleEstado = ref(null)

    const filteredTrabajadores = computed(() =>
      trabajadores.value.filter(trabajador =>
        trabajador.numero_documento.toLowerCase().includes(searchQuery.value.toLowerCase().trim())
      )
    )

    const totalPages = computed(() => Math.ceil(filteredTrabajadores.value.length / itemsPerPage))

    const paginatedTrabajadores = computed(() =>
      filteredTrabajadores.value.slice(
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
      trabajadorToToggleEstado.value = id
      isEstadoConfirmVisible.value = true
    }

    const toggleEstado = async () => {
      const trabajador = trabajadores.value.find(t => t.id === trabajadorToToggleEstado.value)
      const nuevoEstado = !trabajador.estado
      await trabajadorStore.updateEstado(trabajadorToToggleEstado.value, nuevoEstado)
      notificationMessage.value = message
      isEstadoConfirmVisible.value = false
      trabajadorToToggleEstado.value = null
      trabajadorStore.fetchTrabajadores()
    }

    const requestDeleteTrabajador = (id) => {
      trabajadorToDelete.value = id;
      isConfirmVisible.value = true;
    };

    const deleteTrabajador = async () => {
      if (trabajadorToDelete.value) {
        await trabajadorStore.deleteTrabajador(trabajadorToDelete.value);
        notificationMessage.value = message;
        isConfirmVisible.value = false; // Cerrar el diálogo
        trabajadorToDelete.value = null; // Resetear el ID a eliminar
        trabajadorStore.fetchTrabajadores()
      }
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const applySearch = () => {
      searchQuery.value = searchInput.value.trim()
      currentPage.value = 1
    }

    onMounted(() => {
      trabajadorStore.fetchTrabajadores()
      window.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside)
    })

    watch(filteredTrabajadores, () => {
      currentPage.value = 1
    })

    return {
      trabajadores,
      requestDeleteTrabajador,
      isConfirmVisible,
      deleteTrabajador,
      notificationMessage,
      totalPages,
      paginatedTrabajadores,
      filteredTrabajadores,
      changePage,
      searchQuery,
      searchInput,
      applySearch,
      requestToggleEstado,
      toggleEstado,
      isEstadoConfirmVisible,
      trabajadorToToggleEstado,
      dropdownVisibleId,
      toggleDropdown
    }
  }
}

</script>

<style scoped>
/* Agrega tus estilos aquí si es necesario */
</style>
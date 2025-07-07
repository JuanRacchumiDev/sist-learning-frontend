<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <!-- Encabezado con búsqueda y botón -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Número de documento"
        class="w-full sm:w-1/3 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
      <router-link to="/instructor/nuevo"
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
      <div class="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6 text-center text-xs">
        <!--
        <div class="p-2.5 xl:p-5 text-left sm:text-center">
          <h5 class="uppercase">ID</h5>
        </div>
        -->
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Tipo de documento</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Número de documento</h5>
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
      <div v-if="filteredInstructores.length === 0"
        class="flex justify-center py-6 text-gray-500 dark:text-gray-300 text-xs">
        No se encontraron instructores.
      </div>

      <div v-for="(instructor, index) in paginatedInstructores" :key="instructor.id"
        :class="`grid grid-cols-6 sm:grid-cols-6 items-center text-xs ${index < paginatedInstructores.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <!--
        <div class="p-2.5 xl:p-5 text-left sm:text-center text-black dark:text-white">
          {{ instructor.id }}
        </div>
        -->
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{
              instructor.TipoDocumento ? instructor.TipoDocumento.abreviatura : 'Sin tipo documento'
            }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ instructor.numero_documento }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ instructor.apellido_paterno }} {{
            instructor.apellido_materno }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ instructor.nombres }}</p>
        </div>
        <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
          <button @click="requestToggleEstado(instructor.id)"
            class="focus:outline-none hover:scale-105 transition-transform">
            <svg v-if="instructor.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
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
            <button @click="toggleDropdown(instructor.id)"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownVisibleId === instructor.id"
              class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <router-link :to="{ name: 'editInstructor', params: { id: instructor.id } }"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Editar
              </router-link>
              <button @click="() => { requestDeleteInstructor(instructor.id); dropdownVisibleId = null }"
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
        class="px-3 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">
        Siguiente
      </button>
    </div>
    <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este instructor?" @confirmed="deleteInstructor"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este instructor?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useInstructorStore, useToastStore } from '@/stores'
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue"
import Notification from "@/components/Common/Notification.vue"

export default {
  components: {
    ConfirmDialog,
    Notification
  },
  setup() {
    const instructorStore = useInstructorStore()

    const instructores = computed(() => instructorStore.instructores)
    const message = computed(() => instructorStore.message)
    const storeToast = useToastStore()

    const searchInput = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const dropdownVisibleId = ref(null)
    const itemsPerPage = 10

    const isConfirmVisible = ref(false)
    const instructorToDelete = ref(null)

    const isEstadoConfirmVisible = ref(false)
    const instructorToToggleEstado = ref(null)

    const filteredInstructores = computed(() =>
      instructores.value.filter(instructor =>
        instructor.numero_documento.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )

    const totalPages = computed(() => Math.ceil(filteredInstructores.value.length / itemsPerPage))

    const paginatedInstructores = computed(() =>
      filteredInstructores.value.slice(
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
      instructorToToggleEstado.value = id
      isEstadoConfirmVisible.value = true
    }

    const toggleEstado = async () => {
      const instructor = instructores.value.find(a => a.id === instructorToToggleEstado.value)
      const nuevoEstado = !instructor.estado
      await instructorStore.updateEstado(instructorToToggleEstado.value, nuevoEstado)
      const classToast = (instructorStore) ? 'success' : 'error'
      storeToast.addToast(message, classToast)
      isEstadoConfirmVisible.value = false
      instructorToToggleEstado.value = null
      instructorStore.fetchInstructores()
    }

    const requestDeleteInstructor = (id) => {
      instructorToDelete.value = id;
      isConfirmVisible.value = true;
    };

    const deleteInstructor = async () => {
      if (instructorToDelete.value) {
        await instructorStore.deleteInstructor(instructorToDelete.value);
        const classToast = (instructorStore.result) ? 'success' : 'error'
        storeToast.addToast(message, classToast)
        isConfirmVisible.value = false; // Cerrar el diálogo
        instructorToDelete.value = null; // Resetear el ID a eliminar
        instructorStore.fetchInstructores()
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
      instructorStore.fetchInstructores()
      window.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside)
    })

    watch(filteredInstructores, () => {
      currentPage.value = 1
    })

    return {
      instructores,
      requestDeleteInstructor,
      isConfirmVisible,
      deleteInstructor,
      totalPages,
      paginatedInstructores,
      filteredInstructores,
      changePage,
      searchQuery,
      searchInput,
      applySearch,
      requestToggleEstado,
      toggleEstado,
      isEstadoConfirmVisible,
      instructorToToggleEstado,
      dropdownVisibleId,
      toggleDropdown
    }
  }
}

</script>

<style scoped>
/* Agrega tus estilos aquí si es necesario */
</style>
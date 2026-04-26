<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <!-- Encabezado con búsqueda y botón -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Criterio de búsqueda"
        class="w-full sm:w-1/3 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
      <router-link to="/usuario/nuevo"
        class="inline-flex items-center gap-2 self-end md:self-auto rounded bg-greenwhite-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-greenwhite-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 2a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V3a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Nuevo
      </router-link>
    </div>

    <div class="flex flex-col">
      <div class="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5 text-center text-xs">
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Usuario</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Nombre de Usuario</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Perfil</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Estado</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="text-xs font-medium uppercase xsm:text-sm">Acciones</h5>
        </div>
      </div>

      <div v-if="usuarios.length === 0" class="flex justify-center py-6 text-gray-500 dark:text-gray-300 text-xs">
        No se encontraron usuarios.
      </div>

      <div v-for="(usuario, index) in usuarios" :key="usuario.id"
        :class="`grid grid-cols-5 sm:grid-cols-5 items-center text-xs ${index < usuarios.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p v-if="usuario?.perfil?.nombre === 'Estudiante'" class="text-black dark:text-white">{{
            usuario.alumno.apellido_paterno }} {{
              usuario.alumno.apellido_materno }} {{ usuario.alumno.nombres }}</p>
          <p v-else-if="usuario?.perfil?.nombre === 'Instructor'" class="text-black dark:text-white">{{
            usuario.instructor.apellido_paterno }} {{
              usuario.instructor.apellido_materno }} {{ usuario.instructor.nombres }}</p>
          <p v-else class="text-black dark:text-white">{{ usuario?.trabajador?.apellido_paterno }} {{
            usuario?.trabajador?.apellido_materno }} {{
              usuario?.trabajador?.nombres }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <p class="text-black dark:text-white">{{ usuario.username }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <p class="text-black dark:text-white">{{ usuario?.perfil?.nombre }}</p>
        </div>
        <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
          <button @click="requestToggleEstado(usuario.id)"
            class="focus:outline-none hover:scale-105 transition-transform">
            <svg v-if="usuario.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
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
            <button @click="toggleDropdown(usuario.id)"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownVisibleId === usuario.id"
              class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <router-link :to="{ name: 'editUsuario', params: { id: usuario.id } }"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Editar
              </router-link>
              <button @click="() => { requestDeleteUsuario(usuario.id); dropdownVisibleId = null }"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Paginación -->
    <!--
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
    -->

    <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este usuario?" @confirmed="deleteUsuario"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este usuario?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
    <Notification v-if="notificationMessage" :message="notificationMessage" :duration="4000"
      @hide="notificationMessage = ''"></Notification>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useUsuarioStore, useToastStore } from '@/stores'
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue"
import Notification from "@/components/Common/Notification.vue"

const usuarioStore = useUsuarioStore();
const storeToast = useToastStore();

const usuarios = computed(() => usuarioStore.usuarios)

const searchInput = ref('');
const dropdownVisibleId = ref(null);

const isConfirmVisible = ref(false);
const usuarioToDelete = ref(null);

const isEstadoConfirmVisible = ref(false);
const usuarioToToggleEstado = ref(null);

const fetchUsuarios = async (page = 1, query = '') => {
  await usuarioStore.fetchUsuariosPaginate({ page, query });
};

const applySearch = () => {
  fetchUsuarios(1, searchInput.value.trim());
};

const toggleDropdown = (id) => {
  dropdownVisibleId.value = dropdownVisibleId.value === id ? null : id;
};

const handleClickOutside = (e) => {
  if (!e.target.closest('.relative')) {
    dropdownVisibleId.value = null;
  }
};

const requestToggleEstado = (id) => {
  usuarioToToggleEstado.value = id;
  isEstadoConfirmVisible.value = true;
};

const currentPage = computed(() => usuarioStore.pagination.currentPage);

const toggleEstado = async () => {
  const usuario = usuarios.value.find(a => a.id === usuarioToToggleEstado.value);
  if (usuario) {
    const nuevoEstado = !usuario.estado;
    await usuarioStore.updateEstado(usuarioToToggleEstado.value, nuevoEstado);
    const classToast = usuarioStore.result ? 'success' : 'error';
    storeToast.addToast(usuarioStore.message, classToast);
    isEstadoConfirmVisible.value = false;
    usuarioToToggleEstado.value = null;
    fetchUsuarios(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

const requestDeleteUsuario = (id) => {
  usuarioToDelete.value = id;
  isConfirmVisible.value = true;
};

const deleteUsuario = async () => {
  if (usuarioToDelete.value) {
    await usuarioStore.deleteUsuario(usuarioToDelete.value);
    const classToast = usuarioStore.result ? 'success' : 'error';
    storeToast.addToast(usuarioStore.message, classToast);
    isConfirmVisible.value = false;
    usuarioToDelete.value = null;
    fetchUsuarios(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

/*
export default {
  components: {
    ConfirmDialog,
    Notification
  },
  setup() {
    const usuarioStore = useUsuarioStore()
    const usuarios = computed(() => usuarioStore.usuarios)
    const message = computed(() => usuarioStore.message)

    const searchInput = ref('')
    const searchQuery = ref('')
    const currentPage = ref(1)
    const dropdownVisibleId = ref(null)
    const itemsPerPage = 10

    const isConfirmVisible = ref(false)
    const notificationMessage = ref('')
    const usuarioToDelete = ref(null)

    const isEstadoConfirmVisible = ref(false)
    const usuarioToToggleEstado = ref(null)

    const filteredUsuarios = computed(() =>
      usuarios.value.filter(usuario =>
        usuario.username.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )

    const totalPages = computed(() => Math.ceil(filteredUsuarios.value.length / itemsPerPage))

    const paginatedUsuarios = computed(() =>
      filteredUsuarios.value.slice(
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
      usuarioToToggleEstado.value = id
      isEstadoConfirmVisible.value = true
    }

    const toggleEstado = async () => {
      const usuario = usuarios.value.find(us => us.id === usuarioToToggleEstado.value)
      const nuevoEstado = !usuario.estado
      await usuarioStore.updateEstado(usuarioToToggleEstado.value, nuevoEstado)
      notificationMessage.value = message
      isEstadoConfirmVisible.value = false
      usuarioToToggleEstado.value = null
      usuarioStore.fetchUsuarios()
    }

    const requestDeleteUsuario = (id) => {
      usuarioToDelete.value = id;
      isConfirmVisible.value = true;
    };

    const deleteUsuario = async () => {
      if (usuarioToDelete.value) {
        await usuarioStore.deleteUsuario(usuarioToDelete.value);
        notificationMessage.value = message;
        isConfirmVisible.value = false; // Cerrar el diálogo
        usuarioToDelete.value = null; // Resetear el ID a eliminar
        usuarioStore.fetchUsuarios()
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
      usuarioStore.fetchUsuarios()
      window.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside)
    })

    watch(filteredUsuarios, () => {
      currentPage.value = 1
    })

    return {
      usuarios,
      requestDeleteUsuario,
      isConfirmVisible,
      deleteUsuario,
      notificationMessage,
      totalPages,
      paginatedUsuarios,
      filteredUsuarios,
      changePage,
      searchQuery,
      searchInput,
      applySearch,
      requestToggleEstado,
      toggleEstado,
      isEstadoConfirmVisible,
      usuarioToToggleEstado,
      dropdownVisibleId,
      toggleDropdown
    }
  }
}
*/
</script>

<style scoped>
/* Agrega tus estilos aquí si es necesario */
</style>
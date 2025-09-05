<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Criterio de búsqueda"
        class="w-full sm:w-1/3 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
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

    <div class="flex flex-col">
      <div class="grid grid-cols-6 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6 text-center text-xs">
        <div class="p-2.5 xl:p-5 text-left sm:text-center">
          <h5 class="uppercase">ID</h5>
        </div>
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

      <div v-if="eventos.length === 0" class="flex justify-center py-6 text-gray-500 dark:text-gray-300 text-xs">
        No se encontraron eventos.
      </div>
      <div v-else v-for="(evento, index) in eventos" :key="evento.id"
        :class="`grid grid-cols-6 sm:grid-cols-6 items-center text-xs ${index < eventos.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <div class="p-2.5 xl:p-5 text-left sm:text-center text-black dark:text-white">
          {{ evento.id }}
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">{{ evento.titulo }}</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <p class="text-black dark:text-white text-center w-full">{{ evento.tipoEvento ? evento.tipoEvento.nombre :
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

    <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este evento?" @confirmed="deleteEvento"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este evento?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useEventoStore, useToastStore } from '@/stores';
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";

const eventoStore = useEventoStore();
const storeToast = useToastStore();

const eventos = computed(() => eventoStore.eventos);
const message = computed(() => eventoStore.message);

const searchInput = ref('');
const dropdownVisibleId = ref(null);

const isConfirmVisible = ref(false);
const eventoToDelete = ref(null);

const isEstadoConfirmVisible = ref(false);
const eventoToToggleEstado = ref(null);

const fetchEventos = async (page = 1, query = '') => {
  await eventoStore.fetchEventosPaginate({ page, query });
};

const applySearch = () => {
  fetchEventos(1, searchInput.value.trim());
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
  eventoToToggleEstado.value = id;
  isEstadoConfirmVisible.value = true;
};

const currentPage = computed(() => eventoStore.pagination.currentPage);

const toggleEstado = async () => {
  const evento = eventos.value.find(a => a.id === eventoToToggleEstado.value);
  if (evento) {
    const nuevoEstado = !evento.estado;
    await eventoStore.updateEstado(eventoToToggleEstado.value, nuevoEstado);
    const classToast = eventoStore.result ? 'success' : 'error';
    storeToast.addToast(message, classToast);
    isEstadoConfirmVisible.value = false;
    eventoToToggleEstado.value = null;
    fetchEventos(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

const requestDeleteEvento = (id) => {
  eventoToDelete.value = id;
  isConfirmVisible.value = true;
};

const deleteEvento = async () => {
  if (eventoToDelete.value) {
    await eventoStore.deleteEvento(eventoToDelete.value);
    const classToast = eventoStore.result ? 'success' : 'error';
    storeToast.addToast(message, classToast);
    isConfirmVisible.value = false;
    eventoToDelete.value = null;
    fetchEventos(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
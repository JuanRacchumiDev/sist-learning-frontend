<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="searchInput" @keyup.enter="applySearch" type="text" placeholder="Criterio de búsqueda"
        class="w-full sm:w-1/3 px-4 py-2 text-sm border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" />
      <router-link to="/certificado/nuevo"
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
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Alumno</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Evento</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Fecha Emisión</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Descargar</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="uppercase">Estado</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="text-xs font-medium uppercase xsm:text-sm">Acciones</h5>
        </div>
      </div>

      <div v-if="certificados.length === 0" class="flex justify-center py-6 text-gray-500 dark:text-gray-300 text-xs">
        No se encontraron certificados.
      </div>
      <div v-else v-for="(certificado, index) in certificados" :key="certificado.id"
        :class="`grid grid-cols-6 sm:grid-cols-6 items-center text-xs ${index < certificados.length - 1 ? 'border-b border-stroke dark:border-strokedark' : ''}`">
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{ certificado?.alumno ? certificado?.alumno.apellido_paterno : '' }}
            {{ certificado?.alumno ? certificado?.alumno.apellido_materno : '' }}
            {{ certificado?.alumno ? certificado?.alumno.nombres : '' }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-start">
          <p class="text-black dark:text-white">
            {{ certificado.evento ? certificado.evento.titulo : '--' }}
          </p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <p v-if="certificado.fecha_envio" class="text-black dark:text-white text-center w-full">
            {{ formatDate(certificado.fecha_envio) }}</p>
          <p v-else class="text-black dark:text-white">--</p>
        </div>
        <div class="p-2.5 xl:p-5 flex items-center justify-center">
          <button @click="downloadCertificado(certificado.id_alumno, certificado.id_evento)"
            class="text-green-500 hover:text-green-700 w-full flex items-center justify-center">
            <DownloadIcon class="h-6 w-6 text-red-500" />
          </button>
        </div>
        <div class="items-center justify-center p-2.5 sm:flex xl:p-5">
          <button @click="requestToggleEstado(certificado.id)" :disabled="isEstudiante"
            class="focus:outline-none hover:scale-105 transition-transform">
            <svg v-if="certificado.estado" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none"
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
            <button @click="toggleDropdown(certificado.id)"
              class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
              <svg class="w-5 h-5 text-gray-600 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01" />
              </svg>
            </button>

            <!-- Dropdown -->
            <div v-if="dropdownVisibleId === certificado.id && !isEstudiante"
              class="absolute right-0 z-10 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
              <router-link :to="{ name: 'editCertificado', params: { id: certificado.id } }"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                Editar
              </router-link>

              <!--
              <label for="file-upload"
                class="w-full block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                Subir Certificado
              </label>
              <input type="file" id="file-upload" class="hidden" @change="handleFileUpload($event, certificado)" />
            -->

              <button @click="openUploadModal(certificado)"
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                Subir Certificado
              </button>

              <button @click="() => { requestDeleteCertificado(certificado.id); dropdownVisibleId = null }"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400">
                Eliminar
              </button>
            </div>

            <div v-if="isUploadModalVisible"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div class="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Subir Certificado y Código
                </h3>

                <div class="mb-4">
                  <label for="file-upload-modal" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Archivo PDF *
                  </label>
                  <input type="file" id="file-upload-modal" @change="onFileChange"
                    class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                </div>

                <div class="mb-6">
                  <label for="codigo-certificado-input"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Código de Certificado (Opcional)
                  </label>
                  <input type="text" id="codigo-certificado-input" v-model="uploadForm.codigo"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>

                <div class="flex justify-end gap-2">
                  <button @click="closeUploadModal"
                    class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Cancelar
                  </button>
                  <button @click="uploadAndOpenCertificado" :disabled="!uploadForm.file"
                    class="px-4 py-2 text-sm font-medium text-white rounded-md bg-greenwhite-600 hover:bg-greenwhite-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Subir y Abrir
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <ConfirmDialog :isVisible="isConfirmVisible" title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar este certificado?" @confirmed="deleteCertificado"
      @canceled="isConfirmVisible = false" />
    <ConfirmDialog :isVisible="isEstadoConfirmVisible" title="Confirmar cambio de estado"
      message="¿Estás seguro que deseas cambiar el estado de este certificado?" @confirmed="toggleEstado"
      @canceled="isEstadoConfirmVisible = false" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useCertificadoStore, useToastStore } from '@/stores';
import ConfirmDialog from "@/components/Common/ConfirmDialog.vue";
import { DownloadIcon, UploadIcon } from "@heroicons/vue/outline"
import { formatDate } from '@/utils/date.utils'

const certificadoStore = useCertificadoStore();
const storeToast = useToastStore();

const certificados = computed(() => certificadoStore.certificados);
const message = computed(() => certificadoStore.message);

const searchInput = ref('');
const dropdownVisibleId = ref(null);

const isConfirmVisible = ref(false);
const certificadoToDelete = ref(null);

const isEstadoConfirmVisible = ref(false);
const certificadoToToggleEstado = ref(null);

const isUploadModalVisible = ref(false);
const certificadoToUpload = ref(null);
const uploadForm = ref({
  file: null,
  codigo: ''
});

const openUploadModal = (certificado) => {
  certificadoToUpload.value = certificado;
  isUploadModalVisible.value = true;
  dropdownVisibleId.value = null; // Cierra el dropdown
};

const closeUploadModal = () => {
  isUploadModalVisible.value = false;
  uploadForm.value = { file: null, codigo: '' }; // Limpia el formulario
};

const onFileChange = (event) => {
  uploadForm.value.file = event.target.files[0];
};

const fetchCertificados = async (page = 1, query = '') => {
  await certificadoStore.fetchCertificados({ page, query });
};

const applySearch = () => {
  fetchCertificados(1, searchInput.value.trim());
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
  certificadoToToggleEstado.value = id;
  isEstadoConfirmVisible.value = true;
};

const downloadCertificado = async (id_alumno, id_evento) => {
  await certificadoStore.fetchCertificadoByAlumnoByEvento(id_alumno, id_evento)

  if (certificadoStore.result && certificadoStore.certificado) {
    if (certificadoStore.certificado.file_name) {
      certificadoStore.certificado.filename = certificadoStore.certificado.file_name
    }
    const filename = certificadoStore.certificado.filename
    await certificadoStore.downloadCertificadoByName(filename)
    const classToast = certificadoStore.result ? 'success' : 'error';
    storeToast.addToast(certificadoStore.message, classToast);
  } else {
    const errorMessage = certificadoStore.message || 'Error al obtener los detalles del certificado.';
    storeToast.addToast(errorMessage, 'error');
  }
}

const currentPage = computed(() => certificadoStore.pagination.currentPage);

const toggleEstado = async () => {
  const certificado = certificados.value.find(a => a.id === certificadoToToggleEstado.value);
  if (certificado) {
    const nuevoEstado = !certificado.estado;
    await certificadoStore.updateEstado(certificadoToToggleEstado.value, nuevoEstado);
    const classToast = certificadoStore.result ? 'success' : 'error';
    storeToast.addToast(message, classToast);
    isEstadoConfirmVisible.value = false;
    certificadoToToggleEstado.value = null;
    fetchCertificados(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

const requestDeleteCertificado = (id) => {
  certificadoToDelete.value = id;
  isConfirmVisible.value = true;
};

const deleteCertificado = async () => {
  if (certificadoToDelete.value) {
    await certificadoStore.deleteCertificado(certificadoToDelete.value);
    const classToast = certificadoStore.result ? 'success' : 'error';
    storeToast.addToast(message, classToast);
    isConfirmVisible.value = false;
    certificadoToDelete.value = null;
    fetchCertificados(currentPage.value, searchInput.value.trim()); // Refrescar la tabla con la página actual
  }
};

const uploadAndOpenCertificado = async () => {
  if (!uploadForm.value.file || !certificadoToUpload.value) {
    storeToast.addToast('Por favor, selecciona un archivo PDF.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('file', uploadForm.value.file);
  formData.append('id_alumno', certificadoToUpload.value.id_alumno);
  formData.append('id_evento', certificadoToUpload.value.id_evento);
  formData.append('codigo', uploadForm.value.codigo); // Añade el campo de código

  await certificadoStore.uploadCertificado(formData);

  const classToast = certificadoStore.result ? 'success' : 'error';
  storeToast.addToast(certificadoStore.message, classToast);

  closeUploadModal();
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>
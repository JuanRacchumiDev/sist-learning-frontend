<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-1">
          <label class="block text-sm font-medium text-gray-700">Buscar alumno: <span
              class="text-red-500">*</span></label>
          <input type="text" v-model="searchQueryAlumno" @keyup.enter="filterAlumnos" placeholder="Juan Pérez"
            autocomplete="off" class="mt-1 p-2 border border-gray-300 rounded w-full" />
          <div v-if="filteredAlumnos.length > 0"
            class="mt-2 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
            <ul>
              <li v-for="alumno in filteredAlumnos" :key="alumno.id" @click="selectAlumno(alumno)"
                class="p-2 hover:bg-gray-200 cursor-pointer">
                {{ alumno.nombres }} {{ alumno.apellido_paterno }} {{ alumno.apellido_materno }}
              </li>
            </ul>
          </div>
          <div v-if="errors.id_alumno" class="text-red-600 text-sm mt-1">{{ errors.id_alumno }}</div>
        </div>
        <div class="mb-1">
          <label class="block text-sm font-medium text-gray-700">Nombre (para impresión): <span
              class="text-red-500">*</span></label>
          <input v-model="certificado.nombre_impresion" type="text" placeholder="Ej. Juan Pérez Rodríguez"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            maxlength="100" />
          <div v-if="errors.nombre_impresion" class="text-red-600 text-sm mt-1">{{
            errors.nombre_impresion }}</div>
        </div>
        <div class="mb-1">
          <label class="block text-sm font-medium text-gray-700">Buscar evento: <span
              class="text-red-500">*</span></label>
          <input type="text" v-model="searchQueryEvento" @keyup.enter="filterEventos" placeholder="Ej. Crianza de cuyes"
            class="mt-1 p-2 border border-gray-300 rounded w-full" />
          <div v-if="filteredEventos.length > 0"
            class="mt-2 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
            <ul>
              <li v-for="evento in filteredEventos" :key="evento.id" @click="selectEvento(evento)"
                class="p-2 hover:bg-gray-200 cursor-pointer">
                {{ evento.titulo }} ({{ evento.tipoEvento.nombre }})
              </li>
            </ul>
          </div>
          <div v-if="errors.id_evento" class="text-red-600 text-sm mt-1">{{ errors.id_evento }}</div>
        </div>
        <div class="mb-1">
          <label class="block text-sm font-medium text-gray-700">Evento seleccionado: <span
              class="text-red-500">*</span></label>
          <input v-model="certificado.nombre_evento" type="text" placeholder="Ej. Crianza de cuyes"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            maxlength="100" disabled />
        </div>
        <div class="mb-1">
          <label class="block text-sm font-medium text-gray-700">Fecha de emisión: <span
              class="text-red-500">*</span></label>
          <input v-model="certificado.fecha_envio" type="date"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.fecha_envio" class="text-red-600 text-sm mt-1">{{ errors.fecha_envio }}</div>
        </div>
        <!--
        <div class="mb-1">
          <label for="id_ciudad" class="block text-sm font-medium text-gray-700">Ciudad:</label>
          <select name="id_ciudad" id="id_ciudad" v-model="certificado.id_ciudad"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option value="1">MOQUEGUA</option>
            <option value="2">TACNA</option>
          </select>
        </div>
        -->
        <div class="mb-1">
          <div v-if="certificado.id_evento && plantillas.length > 0">
            <label class="block text-sm font-medium text-gray-700">Seleccionar plantilla: <span
                class="text-red-500">*</span></label>
            <select v-model="certificado.id_plantilla" class="mt-1 p-2 border border-gray-300 rounded w-full">
              <option value="">- SELECCIONE -</option>
              <option v-for="plantilla in plantillas" :value="plantilla.id" :key="plantilla.id">
                {{ plantilla.nombre }}
              </option>
            </select>
            <div v-if="errors.id_plantilla" class="text-red-600 text-sm mt-1">{{ errors.id_plantilla }}</div>
          </div>
        </div>

      </div>
      <div class="flex justify-between mt-2">
        <button type="submit"
          class="flex items-center px-4 py-2 bg-greenwhite-600 text-white rounded-md hover:bg-greenwhite-700 disabled:bg-greenwhite-300 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': isDuplicated }" :disabled="isDuplicated || loading">
          <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 animate-spin" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          </svg>
          {{ loading ? 'Guardando...' : (certificado.id ? 'Actualizar' : 'Registrar') }}
        </button>
        <button type="button"
          class="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
          :disabled="loading" @click="cancelar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from "vue-router"
import {
  useAlumnoStore,
  useEventoStore,
  useCertificadoStore,
  usePlantillaStore,
  useToastStore
} from "@/stores"
import { currentDate, formatDateForInput } from "@/utils/date.utils";

export default {
  setup() {
    const certificado = ref({
      id: null,
      id_ciudad: '',
      id_alumno: '',
      id_evento: '',
      id_plantilla: '',
      nombre_impresion: '',
      nombre_evento: '',
      fecha_envio: currentDate(),
    });

    const idTipoEvento = ref(0)

    const storeCertificado = useCertificadoStore();
    const storeAlumno = useAlumnoStore();
    const storeEvento = useEventoStore();
    const storePlantilla = usePlantillaStore();
    const storeToast = useToastStore();
    const route = useRoute()

    const alumnos = computed(() => storeAlumno.alumnos)

    const eventos = computed(() => storeEvento.eventos)

    const searchQueryAlumno = ref('')

    const searchQueryEvento = ref('')

    const loading = ref(false)

    const isNombreAlumnoDisabled = ref(true)

    const errors = ref({})

    const plantillas = computed(() => storePlantilla.plantillas)

    const showTemplateDropdown = ref(false)

    // Watcher para obtener plantillas cuando se selecciona un evento
    watch(() => certificado.value.id_evento, (newId, oldId) => {
      console.log('---- newId ----')
      console.log({ newId })

      console.log('---- idTipoEvento.value ----')
      console.log(idTipoEvento.value)

      if (newId) {
        storePlantilla.getPlantillasByTipoEventoOrEvento(newId, idTipoEvento.value)
        // if (idTipoEvento.value === 0) {
        //   storePlantilla.getPlantillasByEvento(newId);
        // } else {
        //   storePlantilla.getPlantillasByTipoEventoOrEvento(newId, idTipoEvento.value);
        // }

        showTemplateDropdown.value = true;
      } else {
        // Limpia las plantillas si no hay evento seleccionado
        storePlantilla.plantillas = [];
        certificado.value.id_plantilla = '';
        showTemplateDropdown.value = false;
      }
    });

    const filteredAlumnos = computed(() => {
      return alumnos.value.filter((alumno) => {
        return `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
          .toLowerCase()
          .includes(searchQueryAlumno.value.toLowerCase().trim());
      });
    });

    const filteredEventos = computed(() => {
      return eventos.value.filter((evento) => {
        return `${evento.titulo}`
          .toLowerCase()
          .includes(searchQueryEvento.value.toLowerCase().trim());
      });
    });

    const validateForm = () => {
      errors.value = {}

      if (!certificado.value.id_alumno) {
        errors.value.id_alumno = 'Seleccione un alumno'
      }

      if (!certificado.value.id_evento) {
        errors.value.id_evento = 'Seleccione un evento'
      }

      if (!certificado.value.nombre_impresion || certificado.value.nombre_impresion.trim() === '') {
        errors.value.nombre_impresion = 'El nombre de impresión es obligatorio'
      }

      if (!certificado.value.fecha_envio) {
        errors.value.fecha_envio = 'Seleccione una fecha'
      }

      if (certificado.value.id_evento && !certificado.value.id_plantilla) {
        errors.value.id_plantilla = 'Seleccione una plantilla'
      }

      return Object.keys(errors.value).length === 0
    }

    const loadAlumnos = () => {
      filteredAlumnos.value = alumnos.value;
    };

    const loadEventos = () => {
      filteredEventos.value = eventos.value
    }

    const filterAlumnos = () => {
      if (searchQueryAlumno.value.trim() === '') {
        filteredAlumnos.value = alumnos.value;
      } else {
        filteredAlumnos.value = alumnos.value.filter((alumno) => {
          `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
            .toLowerCase()
            .includes(searchQueryAlumno.value.toLowerCase().trim());
        });
      }
    };

    const filterEventos = () => {
      if (searchQueryEvento.value.trim() === '') {
        filteredEventos.value = eventos.value;
      } else {
        filteredEventos.value = eventos.value.filter((evento) => {
          `${evento.titulo}`.toLowerCase().includes(searchQueryEvento.value.toLowerCase().trim());
        });
      }
    };

    const selectAlumno = (alumno) => {
      certificado.value.id_alumno = alumno.id;
      certificado.value.nombre_impresion = `${alumno.nombres.trim()} ${alumno.apellido_paterno.trim()} ${alumno.apellido_materno.trim()}`;
      searchQueryAlumno.value = ''; // Limpiar la búsqueda
    };

    const selectEvento = (evento) => {
      // console.log({ evento })
      certificado.value.id_evento = evento.id;
      certificado.value.nombre_evento = evento.titulo;
      idTipoEvento.value = evento.id_tipoevento
      searchQueryEvento.value = ''; // Limpiar la búsqueda
    };

    onMounted(async () => {
      storeAlumno.fetchAlumnos();
      storeEvento.fetchEventos();

      loadAlumnos();
      loadEventos();

      storeCertificado.message = ""

      const certificadoId = route.params.id

      if (certificadoId) {
        await storeCertificado.fetchCertificadoById(certificadoId)

        if (storeCertificado.certificado) {
          certificado.value = storeCertificado.certificado
          const nombreEvento = storeCertificado.certificado.evento.titulo
          certificado.value.nombre_evento = nombreEvento

          const { fecha_envio } = storeCertificado.certificado

          if (fecha_envio) {
            certificado.value.fecha_envio = formatDateForInput(fecha_envio)
          }
        }
      }
    })

    const submitForm = async () => {
      if (!validateForm()) return

      try {
        loading.value = true; // Activar el spinner

        certificado.value.nombre_impresion = certificado.value.nombre_impresion.trim()

        if (certificado.value.id) {
          await storeCertificado.updateCertificado(
            certificado.value.id,
            certificado.value
          );

          const classToast = (storeCertificado.result) ? 'success' : 'error'

          storeToast.addToast(storeCertificado.message, classToast)
        } else {
          await storeCertificado.createCertificado(certificado.value)
          const classToast = (storeCertificado.result) ? 'success' : 'error'
          storeToast.addToast(storeCertificado.message, classToast)
          if (storeCertificado.result) resetForm()
        }
      } catch (error) {
        console.error('error creating certificado', error);
        storeToast.addToast(storeAlumno.message, 'error')
      } finally {
        loading.value = false; // Desactivar el spinner
      }
    };

    const cancelar = () => {
      certificado.value = {
        id_alumno: '',
        id_evento: '',
        id_plantilla: '',
        nombre_impresion: '',
        fecha_envio: currentDate()
      };

      isNombreAlumnoDisabled.value = true;
    }

    const resetForm = () => {
      certificado.value = {
        id: null,
        id_alumno: '',
        id_evento: '',
        id_plantilla: '',
        nombre_impresion: '',
        fecha_envio: currentDate()
      };

      isNombreAlumnoDisabled.value = true;
    };

    return {
      alumnos,
      eventos,
      certificado,
      submitForm,
      isNombreAlumnoDisabled,
      loading,
      searchQueryAlumno,
      searchQueryEvento,
      filteredAlumnos,
      filterAlumnos,
      selectAlumno,
      filteredEventos,
      filterEventos,
      selectEvento,
      cancelar,
      errors,
      plantillas,
      showTemplateDropdown
    }
  }
}
</script>
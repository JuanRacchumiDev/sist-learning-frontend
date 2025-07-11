<template>
  <div class="px-6 py-8">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <!-- Buscar alumno -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Buscar alumno: <span
                class="text-red-500">*</span></label>
            <input type="text" v-model="searchQuery" @keyup.enter="filterAlumnos" placeholder="Ej. Juan Pérez"
              class="mt-1 p-2 border border-gray-300 rounded w-full" />
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

          <!-- Buscar evento -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Seleccionar evento: <span
                class="text-red-500">*</span></label>
            <select v-model="certificado.id_evento" class="mt-1 p-2 border border-gray-300 rounded w-full">
              <option value="">- SELECCIONE -</option>
              <option v-for="evento in eventos" :value="evento.id" :key="evento.id">
                {{ evento.titulo }}
              </option>
            </select>
            <div v-if="errors.id_evento" class="text-red-600 text-sm mt-1">{{ errors.id_evento }}</div>
          </div>
        </div>

        <!-- Columna derecha: información adicional -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre alumno (para impresión): <span
                class="text-red-500">*</span></label>
            <input v-model="certificado.nombre_alumno_impresion" type="text" placeholder="Ej. Juan Pérez Rodríguez"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
              maxlength="100" />
            <div v-if="errors.nombre_alumno_impresion" class="text-red-600 text-sm mt-1">{{
              errors.nombre_alumno_impresion }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Fecha de emisión: <span
                class="text-red-500">*</span></label>
            <input v-model="certificado.fecha_envio" type="date"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
            <div v-if="errors.fecha_envio" class="text-red-600 text-sm mt-1">{{ errors.fecha_envio }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Firmado PERUAGRO:</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="certificado.firmado" value="FIRMADO" class="form-radio text-green-600">
                <span class="ml-2">Firmado</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="certificado.firmado" value="NO FIRMADO" class="form-radio text-red-600">
                <span class="ml-2">No Firmado</span>
              </label>
            </div>
            <div v-if="errors.firmado" class="text-red-600 text-sm mt-1">{{ errors.firmado }}</div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex justify-between mt-8">
        <button type="submit"
          class="flex items-center px-4 py-2 bg-greenwhite-600 text-white rounded-md hover:bg-greenwhite-700 disabled:bg-greenwhite-300 disabled:cursor-not-allowed"
          :disabled="loading">
          <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 animate-spin" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          </svg>
          {{ loading ? 'Guardando...' : (certificado.id ? 'Actualizar' : 'Registrar') }}
        </button>

        <button type="button"
          class="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4"
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
import { onMounted, ref, computed } from 'vue';
import { useRoute } from "vue-router"
import {
  useAlumnoStore,
  useEventoStore,
  useCertificadoStore,
  useToastStore
} from "@/stores"
import { currentDate } from "@/utils/date.utils";

export default {
  setup() {
    const certificado = ref({
      id: null,
      id_alumno: '',
      nombre_alumno_impresion: '',
      id_evento: '',
      fecha_envio: currentDate(),
      firmado: "FIRMADO"
    });

    const storeCertificado = useCertificadoStore();
    const storeAlumno = useAlumnoStore();
    const storeEvento = useEventoStore();
    const storeToast = useToastStore();
    const route = useRoute()

    const alumnos = computed(() => storeAlumno.alumnos)

    const eventos = computed(() => {
      return [...storeEvento.eventos].sort((a, b) => a.titulo.localeCompare(b.titulo))
    })

    const searchQuery = ref('')
    const loading = ref(false)
    const isNombreAlumnoDisabled = ref(true)
    const errors = ref({})

    const templateError = ref(false);

    const filteredAlumnos = computed(() => {
      return alumnos.value.filter((alumno) => {
        return `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase().trim());
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

      if (!certificado.value.nombre_alumno_impresion || certificado.value.nombre_alumno_impresion.trim() === '') {
        errors.value.nombre_alumno_impresion = 'El nombre del alumno es obligatorio'
      }

      if (!certificado.value.fecha_envio) {
        errors.value.fecha_envio = 'Seleccione una fecha'
      }

      if (!certificado.value.firmado || certificado.value.firmado.trim() === '') {
        errors.value.firmado = 'Seleccione una opción de firma'
      }

      return Object.keys(errors.value).length === 0
    }

    const loadAlumnos = () => {
      filteredAlumnos.value = alumnos.value;
    };

    const filterAlumnos = () => {
      if (searchQuery.value.trim() === '') {
        filteredAlumnos.value = alumnos.value;
      } else {
        filteredAlumnos.value = alumnos.value.filter((alumno) => {
          `${alumno.nombres} ${alumno.apellido_paterno} ${alumno.apellido_materno}`
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase().trim());
        });
      }
    };

    const selectAlumno = (alumno) => {
      certificado.value.id_alumno = alumno.id;
      certificado.value.nombre_alumno_impresion = `${alumno.nombres.trim()} ${alumno.apellido_paterno.trim()} ${alumno.apellido_materno.trim()}`;
      searchQuery.value = ''; // Limpiar la búsqueda
    };

    onMounted(async () => {
      storeAlumno.fetchAlumnos();
      storeEvento.fetchEventos();
      loadAlumnos();
      storeCertificado.message = ""

      const certificadoId = route.params.id

      if (certificadoId) {
        await storeCertificado.getCertificadoById(certificadoId)
        certificado.value = storeCertificado.certificado || {}

        if (certificado.value) {
          const partFecha = certificado.value.fecha_envio.split("T")
          certificado.value.fecha_envio = partFecha[0]
        }
        storeCertificado.message = ""
      }
    })

    const submitForm = async () => {
      if (!validateForm()) return

      try {
        templateError.value = false;
        loading.value = true; // Activar el spinner

        certificado.value.nombre_alumno_impresion = certificado.value.nombre_alumno_impresion.trim()
        certificado.value.firmado = (certificado.value.firmado === 'FIRMADO') ? true : false
        console.log('certificado.value', certificado.value)
        console.log('certificado.value.firmado', certificado.value.firmado)

        if (certificado.value.id) {
          await storeCertificado.updateCertificado(
            certificado.value.id,
            certificado.value
          );

          const classToast = (storeCertificado.result) ? 'success' : 'error'

          storeToast.addToast(storeCertificado.message, classToast)
        } else {
          await storeAlumno.getAlumnoById(
            certificado.value.id_alumno
          );

          if (storeAlumno.alumno) {
            certificado.value.alumno = storeAlumno.alumno
            await storeCertificado.createCertificado(certificado.value)
            const classToast = (storeCertificado.result) ? 'success' : 'error'
            storeToast.addToast(storeCertificado.message, classToast)
            if (storeCertificado.result) resetForm()
          } else {
            storeToast.addToast(storeAlumno.message, 'error')
          }
        }
      } catch (error) {
        console.log('error creating certificado', error);
        storeToast.addToast(storeAlumno.message, 'error')
      } finally {
        loading.value = false; // Desactivar el spinner
      }
    };

    const cancelar = () => {
      certificado.value = {
        id_alumno: '',
        nombre_alumno_impresion: '',
        id_evento: '',
        fecha_envio: currentDate(),
        firmado: "FIRMADO"
      };

      isNombreAlumnoDisabled.value = true;
    }

    const resetForm = () => {
      certificado.value = {
        id: null,
        id_alumno: '',
        nombre_alumno_impresion: '',
        id_evento: '',
        fecha_envio: currentDate(),
        firmado: "FIRMADO"
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
      searchQuery,
      filteredAlumnos,
      filterAlumnos,
      selectAlumno,
      templateError,
      cancelar,
      errors
    }
  }
}
</script>
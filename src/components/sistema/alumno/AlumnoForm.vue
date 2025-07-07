<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-1">
          <label for="id_tipodocumento" class="block text-sm font-medium text-gray-700">Tipo de documento: <span
              class="text-red-500">*</span></label>
          <select name="id_tipodocumento" id="id_tipodocumento" v-model="alumno.id_tipodocumento"
            class="mt-1 p-2 border border-gray-300 rounded w-full" :disabled="isReadOnly">
            <option value="">- SELECCIONE -</option>
            <option v-for="tipo in tipos" :value="tipo.id" :key="tipo.id">
              {{ tipo.abreviatura }}
            </option>
          </select>
          <div v-if="errors.id_tipodocumento" class="text-red-600 text-sm mt-1">{{ errors.id_tipodocumento }}</div>
        </div>
        <div class="mb-1">
          <label for="numero_documento" class="block text-sm font-medium text-gray-700">Número de documento: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.numero_documento" type="text" id="numero_documento"
            @keydown.enter.prevent="fetchPersona" autocomplete="off" maxlength="13" placeholder="Ejm: 44995533"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            :disabled="isReadOnly" />
          <div v-if="errors.numero_documento" class="text-red-600 text-sm mt-1">{{ errors.numero_documento }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_paterno" class="block text-sm font-medium text-gray-700">Apellido paterno: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.apellido_paterno" @input="alumno.nombres = alumno.nombres.toUpperCase()" type="text"
            id="apellido_paterno" autocomplete="off" maxlength="20" placeholder="PÉREZ"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 uppercase" />
          <div v-if="errors.apellido_paterno" class="text-red-600 text-sm mt-1">{{ errors.apellido_paterno }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_materno" class="block text-sm font-medium text-gray-700">Apellido materno: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.apellido_materno"
            @input="alumno.apellido_materno = alumno.apellido_materno.toUpperCase()" type="text" id="apellido_materno"
            autocomplete="off" maxlength="20" placeholder="PÉREZ"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 uppercase" />
          <div v-if="errors.apellido_materno" class="text-red-600 text-sm mt-1">{{ errors.apellido_materno }}</div>
        </div>
        <div class="mb-1">
          <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.nombres" @input="alumno.nombres = alumno.nombres.toUpperCase()" type="text"
            id="nombres" autocomplete="off" maxlength="40" placeholder="JOSÉ CARLO"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 uppercase" />
          <div v-if="errors.nombres" class="text-red-600 text-sm mt-1">{{ errors.nombres }}</div>
        </div>
        <div class="mb-1">
          <label for="fecha_nacimiento" class="block text-sm font-medium text-gray-700">Fecha de Nacimiento: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.fecha_nacimiento" type="date" id="fecha_nacimiento" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.fecha_nacimiento" class="text-red-600 text-sm mt-1">{{ errors.fecha_nacimiento }}</div>
        </div>
        <div class="mb-1">
          <label for="sexo" class="block text-sm font-medium text-gray-700">Sexo: <span
              class="text-red-500">*</span></label>
          <select name="sexo" id="sexo" v-model="alumno.sexo" class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <div v-if="errors.sexo" class="text-red-600 text-sm mt-1">{{ errors.sexo }}</div>
        </div>
        <div class="mb-1">
          <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono: <span
              class="text-red-500">*</span></label>
          <input v-model="alumno.telefono" type="text" id="telefono" autocomplete="off" maxlength="10"
            placeholder="Ejm: 995511224"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.telefono" class="text-red-600 text-sm mt-1">{{ errors.telefono }}</div>
        </div>
        <div class="mb-1" v-if="showPais">
          <label for="id_pais" class="block text-sm font-medium text-gray-700">País: <span
              class="text-red-500">*</span></label>
          <select id="id_pais" v-model="alumno.id_pais" class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option v-for="pais in paises" :key="pais.id" :value="pais.id">{{ pais.nombre }}</option>
          </select>
          <div v-if="errors.pais" class="text-red-600 text-sm mt-1">{{ errors.pais }}</div>
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
          {{
            loading
              ? notificationAction
              : alumno.id
                ? 'Actualizar'
                : 'Registrar'
          }}
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
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute } from "vue-router"
import { useAlumnoStore, useTipoDocumentoStore, usePersonaStore, useToastStore, usePaisStore } from '@/stores'
import { IPais } from "@/interfaces/paisInterface"
import { IAlumno } from "@/interfaces/alumnoInterface"

export default {
  setup() {
    const alumno = ref({
      id: null,
      id_tipodocumento: '',
      numero_documento: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      telefono: '',
      fecha_nacimiento: null,
      sexo: '',
      id_pais: null
    });

    const storePais = usePaisStore()
    const storeAlumno = useAlumnoStore();
    const storeTipoDocumento = useTipoDocumentoStore();
    const storePersona = usePersonaStore();
    const storeToast = useToastStore()
    const route = useRoute()

    const tipos = computed(() => storeTipoDocumento.tipos);

    const paises = computed(() => storePais.paises)

    const loading = ref(false);
    const isDuplicated = ref(false);
    const errors = ref({})
    const notificationAction = ref("")

    const registerAlumno = ref(false)
    const registerPersona = ref(false)

    const isReadOnly = ref(false)

    const showPais = ref(false)

    watch(() => alumno.value.id_tipodocumento, (nuevoTipo) => {
      const tiposEspeciales = ['CE', 'OTROS']

      // Mostrar o no el select de país
      const tipoDocSeleccionado = tipos.value.find(t => t.id === nuevoTipo)
      if (tipoDocSeleccionado) {
        const { abreviatura } = tipoDocSeleccionado
        showPais.value = tiposEspeciales.includes(abreviatura || '')
      }
    })

    const validateForm = () => {
      errors.value = {}

      if (!alumno.value.id_tipodocumento) {
        errors.value.id_tipodocumento = 'Seleccione un tipo de documento'
      }

      if (!alumno.value.numero_documento || alumno.value.numero_documento.trim() === '') {
        errors.value.numero_documento = 'El número de documento es obligatorio'
      }

      if (!alumno.value.apellido_paterno || alumno.value.apellido_paterno.trim() === '') {
        errors.value.apellido_paterno = 'El apellido paterno es obligatorio'
      }

      if (!alumno.value.apellido_materno || alumno.value.apellido_materno.trim() === '') {
        errors.value.apellido_materno = 'El apellido materno es obligatorio'
      }

      if (!alumno.value.nombres || alumno.value.nombres.trim() === '') {
        errors.value.nombres = 'El nombre es obligatorio'
      }

      if (!alumno.value.fecha_nacimiento) {
        errors.value.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
      }

      if (!alumno.value.sexo) {
        errors.value.sexo = 'El sexo es obligatorio'
      }

      if (!alumno.value.telefono || alumno.value.telefono.trim() === '') {
        errors.value.telefono = 'El teléfono es obligatorio'
      }

      if (showPais.value && !alumno.value.id_pais) {
        errors.value.pais = 'El país es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleResult = (result, message) => {
      if (result) {
        storeToast.addToast(message, 'success')
        isDuplicated.value = false
        resetForm()
      } else {
        storeToast.addToast(message || 'Ocurrió un error', "error")
        isDuplicated.value = false
      }
    }

    const submitForm = async () => {
      if (!validateForm()) return;

      loading.value = true
      notificationAction.value = "Cargando..."
      isDuplicated.value = false

      try {
        const { value } = alumno

        const {
          id,
          id_tipodocumento,
          numero_documento,
          apellido_paterno,
          apellido_materno,
          nombres,
          fecha_nacimiento,
          sexo,
          telefono,
          id_pais
        } = value

        value.numero_documento = value.numero_documento.trim()
        value.apellido_paterno = value.apellido_paterno.trim()
        value.apellido_materno = value.apellido_materno.trim()
        value.nombres = value.nombres.trim()
        value.telefono = value.telefono.trim()

        if (id) {
          // Actualización del alumno existente
          await storeAlumno.updateAlumno(id, value)
          const { result, message } = storeAlumno
          const classToast = result ? 'success' : 'error'
          storeToast.addToast(message, classToast)
        } else {
          const nombreCompleto = `${apellido_paterno.trim()} ${apellido_materno.trim()} ${nombres.trim()}`

          // Registrar nuevo alumno
          if (registerAlumno.value && !registerPersona.value) {
            await storeAlumno.createAlumno(value)
            const { result, message } = storeAlumno
            handleResult(result, message)
          }

          // Registrar nueva persona
          if (!registerAlumno.value && registerPersona.value) {
            const dataPersona = {
              id_tipodocumento,
              numero: numero_documento.trim(),
              nombres: nombres.trim(),
              apellido_paterno: apellido_paterno.trim(),
              apellido_materno: apellido_materno.trim(),
              fecha_nacimiento,
              sexo,
              nombre_completo: nombreCompleto,
              origen: 'Web'
            }

            await storePersona.createPersona(dataPersona)
            const { result } = storePersona
            handleResult(result, result ? 'Alumno registrado exitosamente' : 'No se pudo registrar al alumno')
          }

          // Crear alumno
          if (!registerAlumno.value && !registerPersona.value) {
            let dataAlumno = { ...value }

            if (id_pais) {
              await storePais.getPaisById(id_pais)

              const { result, pais } = storePais

              if (result && pais) {
                const { nombre } = pais
                dataAlumno.nombre_pais = nombre
              }
            }

            await storeAlumno.createAlumno(dataAlumno);

            handleResult(storeAlumno.result, storeAlumno.message);
          }
        }
      } catch (error) {
        console.error(error)
        storeToast.addToast('Falló al registrar alumno', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false
      }
    }

    const fetchPersona = async () => {
      loading.value = true;
      notificationAction.value = 'Buscar persona...';
      isDuplicated.value = false;

      try {
        const { value } = alumno

        const { id_tipodocumento, numero_documento } = value

        if (!id_tipodocumento || !numero_documento) return;

        await Promise.all([
          storePersona.getPersonaByTipoDocNumDoc(id_tipodocumento, numero_documento),
          storeAlumno.getAlumnoByTipoDocNumDoc(id_tipodocumento, numero_documento)
        ]);

        const persona = storePersona.persona;
        const alumnoData = storeAlumno.alumno;

        const setAlumnoFields = (data, fechaFormato = 'T') => {
          if (!data) return;

          const fecha = data.fecha_nacimiento
          let fecha_nacimiento = ''

          if (fecha) {
            const base = fechaFormato === 'T' ? fecha.split('T')[0] : fecha;
            const parts = base.split(fechaFormato === 'T' ? '-' : '/');
            fecha_nacimiento = fechaFormato === 'T'
              ? `${parts[0]}-${parts[1]}-${parts[2]}`
              : `${parts[2]}-${parts[1]}-${parts[0]}`;
          }

          Object.assign(alumno.value, {
            nombres: data.nombres.trim() || '',
            apellido_paterno: data.apellido_paterno.trim() || '',
            apellido_materno: data.apellido_materno.trim() || '',
            fecha_nacimiento,
            sexo: data.sexo || '',
            telefono: data.telefono ?? alumno.value.telefono.trim()
          });
        }

        if (persona && alumnoData) {
          setAlumnoFields(alumnoData, 'T');
          storeToast.addToast(storeAlumno.message, 'warning');
          isDuplicated.value = true;
          registerAlumno.value = false;
          registerPersona.value = false;
        } else if (persona && !alumnoData) {
          setAlumnoFields(persona, '/');
          isDuplicated.value = false;
          registerAlumno.value = true;
          registerPersona.value = false;
        } else if (!persona && alumnoData) {
          setAlumnoFields(alumnoData, '/');
          storeToast.addToast(storeAlumno.message, 'warning');
          isDuplicated.value = true;
          registerAlumno.value = false;
          registerPersona.value = true;
        } else {
          await storePersona.getDocumentoInfo(id_tipodocumento, numero_documento);
          const extraPersona = storePersona.persona;

          if (extraPersona) {
            setAlumnoFields(extraPersona, '/');
            storeToast.addToast(storePersona.message, 'success');
            isDuplicated.value = false;
            registerAlumno.value = true;
            registerPersona.value = false;
          } else {
            storeToast.addToast(storePersona.message, 'waning');
            isDuplicated.value = false;
            registerAlumno.value = false;
            registerPersona.value = false;
          }
        }

      } catch (error) {
        console.error(error);
        storeToast.addToast('Falló al buscar persona', 'error');
        isDuplicated.value = false;
        registerAlumno.value = false;
        registerPersona.value = false;
      } finally {
        loading.value = false
      }
    }

    const cancelar = () => {
      alumno.value = {
        id_tipodocumento: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        fecha_nacimiento: null,
        sexo: '',
        id_pais: ''
      }
      isDuplicated.value = false
      showPais.value = false
    }

    const resetForm = () => {
      alumno.value = {
        id: null,
        id_tipodocumento: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        fecha_nacimiento: null,
        sexo: '',
        id_pais: ''
      };
      showPais.value = false
    };

    onMounted(async () => {
      storeTipoDocumento.fetchTiposPorCategoria('persona')
      storePais.fetchPaises()

      const alumnoId = route.params.id

      if (alumnoId) {
        await storeAlumno.getAlumnoById(alumnoId)
        alumno.value = storeAlumno.alumno || {}

        if (alumno.value.fecha_nacimiento) {
          const partFecha = alumno.value.fecha_nacimiento.split("T")
          alumno.value.fecha_nacimiento = partFecha[0]
          isReadOnly.value = true
        }
      }

      storeAlumno.message = ""
    })

    return {
      tipos,
      paises,
      alumno,
      submitForm,
      fetchPersona,
      isDuplicated,
      loading,
      cancelar,
      errors,
      notificationAction,
      isReadOnly,
      showPais
    }
  }
}
</script>
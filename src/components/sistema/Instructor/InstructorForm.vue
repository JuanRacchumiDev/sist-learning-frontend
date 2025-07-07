<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-1">
          <label for="id_tipodocumento" class="block text-sm font-medium text-gray-700">Tipo de documento: <span
              class="text-red-500">*</span></label>
          <select name="id_tipodocumento" id="id_tipodocumento" v-model="instructor.id_tipodocumento"
            class="mt-1 p-2 border border-gray-300 rounded w-full" :disabled="isReadonly">
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
          <input v-model="instructor.numero_documento" type="text" id="numero_documento"
            @keydown.enter.prevent="fetchPersona" autocomplete="off" maxlength="13" placeholder="Ejm: 44995533"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            :disabled="isReadonly" />
          <div v-if="errors.numero_documento" class="text-red-600 text-sm mt-1">{{ errors.numero_documento }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_paterno" class="block text-sm font-medium text-gray-700">Apellido paterno: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.apellido_paterno" type="text" id="apellido_paterno" autocomplete="off"
            maxlength="30" placeholder="Ejm: Pérez"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.apellido_paterno" class="text-red-600 text-sm mt-1">{{ errors.apellido_paterno }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_materno" class="block text-sm font-medium text-gray-700">Apellido materno: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.apellido_materno" type="text" id="apellido_materno" autocomplete="off"
            maxlength="30" placeholder="Ejm: Pérez"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.apellido_materno" class="text-red-600 text-sm mt-1">{{ errors.apellido_materno }}</div>
        </div>
        <div class="mb-1">
          <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.nombres" type="text" id="nombres" autocomplete="off" maxlength="40"
            placeholder="Ejm: José Carlos"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.nombres" class="text-red-600 text-sm mt-1">{{ errors.nombres }}</div>
        </div>
        <div class="mb-1">
          <label for="fecha_nacimiento" class="block text-sm font-medium text-gray-700">Fecha de Nacimiento: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.fecha_nacimiento" type="date" id="fecha_nacimiento" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.fecha_nacimiento" class="text-red-600 text-sm mt-1">{{ errors.fecha_nacimiento }}</div>
        </div>
        <div class="mb-1">
          <label for="sexo" class="block text-sm font-medium text-gray-700">Sexo: <span
              class="text-red-500">*</span></label>
          <select name="sexo" id="sexo" v-model="instructor.sexo"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <div v-if="errors.sexo" class="text-red-600 text-sm mt-1">{{ errors.sexo }}</div>
        </div>
        <div class="mb-1">
          <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.telefono" type="text" id="telefono" autocomplete="off" maxlength="10"
            placeholder="Ejm: 995511224"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.telefono" class="text-red-600 text-sm mt-1">{{ errors.telefono }}</div>
        </div>
        <div class="mb-1">
          <label for="id_pais" class="block text-sm font-medium text-gray-700">País: <span
              class="text-red-500">*</span></label>
          <select name="id_pais" id="id_pais" v-model="instructor.id_pais"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option v-for="pais in paises" :value="pais.id" :key="pais.id">
              {{ pais.nombre }}
            </option>
          </select>
          <div v-if="errors.id_pais" class="text-red-600 text-sm mt-1">{{ errors.id_pais }}</div>
        </div>
        <div class="mb-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email: <span
              class="text-red-500">*</span></label>
          <input v-model="instructor.email" type="text" id="email" autocomplete="off" maxlength="50"
            placeholder="Ejm: jose.perez@email.com"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</div>
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
              : instructor.id
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
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  useInstructorStore,
  useTipoDocumentoStore,
  usePersonaStore,
  usePaisStore,
  useToastStore
} from '@/stores'

export default {
  setup() {
    const instructor = ref({
      id: null,
      id_tipodocumento: '',
      id_pais: '',
      numero_documento: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      telefono: '',
      email: '',
      fecha_nacimiento: null,
      sexo: ''
    });

    const storeInstructor = useInstructorStore();
    const storeTipoDocumento = useTipoDocumentoStore();
    const storePersona = usePersonaStore();
    const storePais = usePaisStore();
    const storeToast = useToastStore()
    const route = useRoute()

    const tipos = computed(() => storeTipoDocumento.tipos);

    const paises = computed(() => storePais.paises)

    const loading = ref(false);
    const isDuplicated = ref(false);
    const errors = ref({})
    const notificationAction = ref("")

    const registerInstructor = ref(false)
    const registerPersona = ref(false)

    const isReadonly = ref(false)

    const validateForm = () => {
      errors.value = {}

      if (!instructor.value.id_tipodocumento) {
        errors.value.id_tipodocumento = 'Seleccione un tipo de documento'
      }

      if (!instructor.value.id_pais) {
        errors.value.id_pais = 'Seleccione un país'
      }

      if (!instructor.value.numero_documento || instructor.value.numero_documento.trim() === '') {
        errors.value.numero_documento = 'El número de documento es obligatorio'
      }

      if (!instructor.value.apellido_paterno || instructor.value.apellido_paterno.trim() === '') {
        errors.value.apellido_paterno = 'El apellido paterno es obligatorio'
      }

      if (!instructor.value.apellido_materno || instructor.value.apellido_materno.trim() === '') {
        errors.value.apellido_materno = 'El apellido materno es obligatorio'
      }

      if (!instructor.value.nombres || instructor.value.nombres.trim() === '') {
        errors.value.nombres = 'El nombre es obligatorio'
      }

      if (!instructor.value.telefono || instructor.value.telefono.trim() === '') {
        errors.value.telefono = 'El teléfono es obligatorio'
      }

      if (!instructor.value.email || instructor.value.email.trim() === '') {
        errors.value.email = 'El email es obligatorio'
      }

      if (!instructor.value.fecha_nacimiento) {
        errors.value.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
      }

      if (!instructor.value.sexo) {
        errors.value.sexo = 'El sexo es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return

      loading.value = true
      notificationAction.value = 'Cargando...'
      isDuplicated.value = false

      try {
        instructor.value.apellido_paterno = instructor.value.apellido_paterno.trim()
        instructor.value.apellido_materno = instructor.value.apellido_materno.trim()
        instructor.value.nombres = instructor.value.nombres.trim()
        instructor.value.telefono = instructor.value.telefono.trim()
        instructor.value.email = instructor.value.email.trim()

        if (instructor.value.id) {
          await storeInstructor.updateInstructor(instructor.value.id, instructor.value)
          const classToast = (storeInstructor.result) ? 'success' : 'error'
          storeToast.addToast(storeInstructor.message, classToast)
          isDuplicated.value = false
        } else {
          if (registerInstructor.value && !registerPersona.value) {

            await storeInstructor.createInstructor(instructor.value)

            if (storeInstructor.result) {
              storeToast.addToast(storeInstructor.message, 'success')
              isDuplicated.value = false
              resetForm()
            } else {
              storeToast.addToast('No se pudo registrar al instructor', 'error')
              isDuplicated.value = false
              return
            }
          }

          if (!registerInstructor.value && registerPersona.value) {
            const nombreCompleto = `${instructor.value.apellido_paterno.trim()} ${instructor.value.apellido_materno.trim()}, ${instructor.value.nombres.trim()}`

            const dataInstructor = {
              id_tipodocumento: instructor.value.id_tipodocumento,
              numero: instructor.value.numero_documento,
              nombres: instructor.value.nombres,
              apellido_paterno: instructor.value.apellido_paterno,
              apellido_materno: instructor.value.apellido_materno,
              fecha_nacimiento: instructor.value.fecha_nacimiento,
              sexo: instructor.value.sexo,
              nombre_completo: nombreCompleto,
              origen: 'Web'
            }

            await storeInstructor.createInstructor(dataInstructor)

            if (storeInstructor.result) {
              storeToast.addToast('Instructor registrado exitosamente', 'success')
              isDuplicated.value = false
              resetForm()
            } else {
              storeToast.addToast('No se pudo registrar al instructor', 'error')
              isDuplicated.value = false
              return
            }
          }
        }
      } catch (error) {
        storeToast.addToast('Falló al registrar instructor', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false; // Desactivar el spinner
      }
    }

    const fetchPersona = async () => {
      loading.value = true; // Activa el estado de carga
      notificationAction.value = "Buscar persona..."
      isDuplicated.value = false

      try {
        if (instructor.value.id_tipodocumento && instructor.value.numero_documento.trim()) {
          const idTipoDoc = instructor.value.id_tipodocumento
          const numDoc = instructor.value.numero_documento.trim()

          await storePersona.getPersonaByTipoDocNumDoc(idTipoDoc, numDoc)
          await storeInstructor.getInstructorByTipoDocNumDoc(idTipoDoc, numDoc)

          const getPersona = storePersona.persona
          const getInstructor = storeInstructor.instructor

          if (getPersona && getInstructor) {
            let fechaNacimiento = '';

            if (getInstructor.fecha_nacimiento) {
              const partsFechaNacimiento = getInstructor.fecha_nacimiento.split('T');
              const partsFecha = partsFechaNacimiento[0].split("-")
              fechaNacimiento = `${partsFecha[0]}-${partsFecha[1]}-${partsFecha[2]}`;
            }

            instructor.value.nombres = getInstructor.nombres.trim() || '';
            instructor.value.apellido_paterno = getInstructor.apellido_paterno.trim() || '';
            instructor.value.apellido_materno = getInstructor.apellido_materno.trim() || '';
            instructor.value.fecha_nacimiento = fechaNacimiento;
            instructor.value.sexo = getInstructor.sexo || '';
            instructor.value.telefono = getInstructor.telefono.trim() || ''

            storeToast.addToast(storeInstructor.message, 'warning')
            isDuplicated.value = true

            registerInstructor.value = false
            registerPersona.value = false
          } else if (!getInstructor && getPersona) {
            let fechaNacimiento = '';

            if (getPersona.fecha_nacimiento) {
              const partsFechaNacimiento = getPersona.fecha_nacimiento.split('/');
              fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`;
            }

            instructor.value.nombres = getPersona.nombres.trim() || '';
            instructor.value.apellido_paterno = getPersona.apellido_paterno.trim() || '';
            instructor.value.apellido_materno = getPersona.apellido_materno.trim() || '';
            instructor.value.fecha_nacimiento = fechaNacimiento;
            instructor.value.sexo = getPersona.sexo || '';

            isDuplicated.value = false

            registerInstructor.value = true
            registerPersona.value = false
          } else if (getInstructor && !getPersona) {
            let fechaNacimiento = '';

            if (getInstructor.fecha_nacimiento) {
              const partsFechaNacimiento = getInstructor.fecha_nacimiento.split('/');
              fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`;
            }

            instructor.value.nombres = getInstructor.nombres.trim() || '';
            instructor.value.apellido_paterno = getInstructor.apellido_paterno.trim() || '';
            instructor.value.apellido_materno = getInstructor.apellido_materno.trim() || '';
            instructor.value.fecha_nacimiento = fechaNacimiento;
            instructor.value.sexo = getInstructor.sexo || '';
            instructor.value.telefono = getInstructor.telefono.trim || '';

            storeToast.addToast(storeInstructor.message, 'warning')
            isDuplicated.value = true

            registerInstructor.value = false
            registerPersona.value = true
          } else {
            await storePersona.getDocumentoInfo(idTipoDoc, numDoc);

            const persona = storePersona.persona;

            if (persona) {
              let fechaNacimiento = '';

              if (persona.fecha_nacimiento) {
                const partsFechaNacimiento = persona.fecha_nacimiento.split('/');
                fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`;
              }

              instructor.value.nombres = persona.nombres.trim() || '';
              instructor.value.apellido_paterno = persona.apellido_paterno.trim() || '';
              instructor.value.apellido_materno = persona.apellido_materno.trim() || '';
              instructor.value.fecha_nacimiento = fechaNacimiento;
              instructor.value.sexo = persona.sexo || '';

              storeToast.addToast(storePersona.message, 'success')
              isDuplicated.value = false

              registerInstructor.value = true
              registerPersona.value = false
            } else {
              storeToast.addToast(storePersona.message, 'error')
              isDuplicated.value = false

              registerInstructor.value = false
              registerPersona.value = false
            }
          }
        }
      } catch (error) {
        console.error(error);
        storeToast.addToast('Falló al buscar persona', 'error')
        isDuplicated.value = false

        registerInstructor.value = false
        registerPersona.value = false
      } finally {
        loading.value = false
      }
    }

    const cancelar = () => {
      instructor.value = {
        id_tipodocumento: '',
        id_pais: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        email: '',
        fecha_nacimiento: null,
        sexo: '',
      }
      isDuplicated.value = false
    }

    const resetForm = () => {
      instructor.value = {
        id: null,
        id_tipodocumento: '',
        id_pais: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        email: '',
        fecha_nacimiento: null,
        sexo: '',
      };
      isDuplicated.value = false;
    };

    onMounted(async () => {
      storeTipoDocumento.fetchTiposPorCategoria('persona')
      storePais.fetchPaises()

      const instructorId = route.params.id
      if (instructorId) {
        await storeInstructor.getInstructorById(instructorId)
        instructor.value = storeInstructor.instructor || {}
        if (instructor.value.fecha_nacimiento) {
          const partFecha = instructor.value.fecha_nacimiento.split("T")
          instructor.value.fecha_nacimiento = partFecha[0]
          isReadonly.value = true
        }
      }
      storeInstructor.message = ""
    })

    return {
      tipos,
      paises,
      instructor,
      submitForm,
      fetchPersona,
      isDuplicated,
      loading,
      cancelar,
      errors,
      notificationAction,
      isReadonly
    }
  }
}
</script>
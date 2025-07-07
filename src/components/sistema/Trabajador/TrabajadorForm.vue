<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-1">
          <label for="id_tipodocumento" class="block text-sm font-medium text-gray-700">Tipo de documento: <span
              class="text-red-500">*</span></label>
          <select name="id_tipodocumento" id="id_tipodocumento" v-model="trabajador.id_tipodocumento"
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
          <input v-model="trabajador.numero_documento" type="text" id="numero_documento"
            @keydown.enter.prevent="fetchPersona" autocomplete="off" maxlength="13" placeholder="Ejm: 44995533"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            :disabled="isReadOnly" />
          <div v-if="errors.numero_documento" class="text-red-600 text-sm mt-1">{{ errors.numero_documento }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_paterno" class="block text-sm font-medium text-gray-700">Apellido paterno: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.apellido_paterno" type="text" id="apellido_paterno" autocomplete="off"
            maxlength="30" placeholder="Ejm: Pérez"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.apellido_paterno" class="text-red-600 text-sm mt-1">{{ errors.apellido_paterno }}</div>
        </div>
        <div class="mb-1">
          <label for="apellido_materno" class="block text-sm font-medium text-gray-700">Apellido materno: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.apellido_materno" type="text" id="apellido_materno" autocomplete="off"
            maxlength="30" placeholder="Ejm: Pérez"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.apellido_materno" class="text-red-600 text-sm mt-1">{{ errors.apellido_materno }}</div>
        </div>
        <div class="mb-1">
          <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.nombres" type="text" id="nombres" autocomplete="off" maxlength="30"
            placeholder="Ejm: José Carlos"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.nombres" class="text-red-600 text-sm mt-1">{{ errors.nombres }}</div>
        </div>
        <div class="mb-1">
          <label for="fecha_nacimiento" class="block text-sm font-medium text-gray-700">Fecha de Nacimiento: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.fecha_nacimiento" type="date" id="fecha_nacimiento" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.fecha_nacimiento" class="text-red-600 text-sm mt-1">{{ errors.fecha_nacimiento }}</div>
        </div>
        <div class="mb-1">
          <label for="sexo" class="block text-sm font-medium text-gray-700">Sexo: <span
              class="text-red-500">*</span></label>
          <select name="sexo" id="sexo" v-model="trabajador.sexo"
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
          <input v-model="trabajador.telefono" type="text" id="telefono" autocomplete="off" maxlength="10"
            placeholder="Ejm: 995511224"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.telefono" class="text-red-600 text-sm mt-1">{{ errors.telefono }}</div>
        </div>
        <div class="mb-1">
          <label for="direccion" class="block text-sm font-medium text-gray-700">Dirección: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.direccion" type="text" id="direccion" autocomplete="off" maxlength="50"
            placeholder="La Molina 293"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.direccion" class="text-red-600 text-sm mt-1">{{ errors.direccion }}</div>
        </div>
        <div class="mb-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email: <span
              class="text-red-500">*</span></label>
          <input v-model="trabajador.email" type="text" id="email" autocomplete="off" maxlength="50"
            placeholder="nombre@email.com"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</div>
        </div>
        <div class="mb-1">
          <label for="id_cargo" class="block text-sm font-medium text-gray-700">Cargo: <span
              class="text-red-500">*</span></label>
          <select name="id_cargo" id="id_cargo" v-model="trabajador.id_cargo"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE -</option>
            <option v-for="cargo in cargos" :value="cargo.id" :key="cargo.id">
              {{ cargo.nombre }}
            </option>
          </select>
          <div v-if="errors.id_cargo" class="text-red-600 text-sm mt-1">{{ errors.id_cargo }}</div>
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
              : trabajador.id
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
import { useRoute } from "vue-router"
import {
  useTrabajadorStore,
  useTipoDocumentoStore,
  usePersonaStore,
  useCargoStore,
  useToastStore
} from '@/stores'

export default {
  setup() {
    const trabajador = ref({
      id: null,
      id_cargo: '',
      id_tipodocumento: '',
      numero_documento: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombres: '',
      telefono: '',
      direccion: '',
      email: '',
      fecha_nacimiento: null,
      sexo: '',

    });

    const storeTrabajador = useTrabajadorStore()
    const storeTipoDocumento = useTipoDocumentoStore()
    const storePersona = usePersonaStore()
    const storeCargo = useCargoStore()
    const storeToast = useToastStore()
    const route = useRoute()

    const tipos = computed(() => storeTipoDocumento.tipos);

    const cargos = computed(() => storeCargo.cargos);

    const loading = ref(false);
    const isDuplicated = ref(false);
    const errors = ref({})
    const notificationAction = ref("")

    const registerTrabajador = ref(false)
    const registerPersona = ref(false)

    const isReadOnly = ref(false)

    const validateForm = () => {
      errors.value = {}

      if (!trabajador.value.id_cargo) {
        errors.value.id_cargo = 'Seleccione un cargo'
      }

      if (!trabajador.value.id_tipodocumento) {
        errors.value.id_tipodocumento = 'Seleccione un tipo de documento'
      }

      if (!trabajador.value.numero_documento || trabajador.value.numero_documento.trim() === '') {
        errors.value.numero_documento = 'El número de documento es obligatorio'
      }

      if (!trabajador.value.apellido_paterno || trabajador.value.apellido_paterno.trim() === '') {
        errors.value.apellido_paterno = 'El apellido paterno es obligatorio'
      }

      if (!trabajador.value.apellido_materno || trabajador.value.apellido_materno.trim() === '') {
        errors.value.apellido_materno = 'El apellido materno es obligatorio'
      }

      if (!trabajador.value.nombres || trabajador.value.nombres.trim() === '') {
        errors.value.nombres = 'El nombre es obligatorio'
      }

      if (!trabajador.value.fecha_nacimiento) {
        errors.value.fecha_nacimiento = 'La fecha de nacimiento es obligatoria'
      }

      if (!trabajador.value.sexo) {
        errors.value.sexo = 'El sexo es obligatorio'
      }

      if (!trabajador.value.telefono || trabajador.value.telefono.trim() === '') {
        errors.value.telefono = 'El teléfono es obligatorio'
      }

      if (!trabajador.value.direccion || trabajador.value.direccion.trim() === '') {
        errors.value.direccion = 'La dirección es obligatoria'
      }

      if (!trabajador.value.email || trabajador.value.email.trim() === '') {
        errors.value.email = 'El email es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return

      loading.value = true
      notificationAction.value = 'Cargando...'
      isDuplicated.value = false

      try {
        trabajador.value.numero_documento = trabajador.value.numero_documento.trim()
        trabajador.value.apellido_paterno = trabajador.value.apellido_paterno.trim()
        trabajador.value.apellido_materno = trabajador.value.apellido_materno.trim()
        trabajador.value.nombres = trabajador.value.nombres.trim()
        trabajador.value.telefono = trabajador.value.telefono.trim()
        trabajador.value.direccion = trabajador.value.direccion.trim()
        trabajador.value.email = trabajador.value.email.trim()

        if (trabajador.value.id) {
          await storeTrabajador.updateTrabajador(trabajador.value.id, trabajador.value)
          const classToast = (storeTrabajador.result) ? 'success' : 'error'
          storeToast.addToast(storeTrabajador.message, classToast)
          isDuplicated.value = false
        } else {
          if (registerTrabajador.value && !registerPersona.value) {

            await storeTrabajador.createTrabajador(trabajador.value);

            if (storeTrabajador.result) {
              storeToast.addToast(storeTrabajador.message, 'success')
              isDuplicated.value = false
              resetForm()
            } else {
              storeToast.addToast('No se pudo registrar al trabajador', 'error')
              isDuplicated.value = false
              return
            }
          }

          if (!registerTrabajador.value && registerPersona.value) {
            const nombreCompleto = `${trabajador.value.apellido_paterno.trim()} ${trabajador.value.apellido_materno.trim()}, ${trabajador.value.nombres.trim()}`

            const dataPersona = {
              id_tipodocumento: trabajador.value.id_tipodocumento,
              numero: trabajador.value.numero_documento,
              nombres: trabajador.value.nombres,
              apellido_paterno: trabajador.value.apellido_paterno,
              apellido_materno: trabajador.value.apellido_materno,
              fecha_nacimiento: trabajador.value.fecha_nacimiento,
              sexo: trabajador.value.sexo,
              nombre_completo: nombreCompleto,
              origen: 'Web'
            }

            await storePersona.createPersona(dataPersona)

            if (storePersona.result) {
              storeToast.addToast('Trabajador registrado exitosamente', 'success')
              isDuplicated.value = false
              resetForm()
            } else {
              storeToast.addToast('No se pudo registrar al trabajador', 'error')
              isDuplicated.value = false
              return
            }
          }
        }
      } catch (error) {
        storeToast.addToast('Falló al registrar trabajador', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false; // Desactivar el spinner
      }
    }

    const fetchPersona = async () => {
      loading.value = true; // Activa el estado de carga
      notificationAction.value = 'Buscar persona...'
      isDuplicated.value = false

      try {
        if (trabajador.value.id_tipodocumento && trabajador.value.numero_documento.trim()) {
          const idTipoDoc = trabajador.value.id_tipodocumento
          const numDoc = trabajador.value.numero_documento.trim()

          await storePersona.getPersonaByTipoDocNumDoc(idTipoDoc, numDoc)
          await storeTrabajador.getTrabajadorByTipoDocNumDoc(idTipoDoc, numDoc)

          const getPersona = storePersona.persona
          const getTrabajador = storeTrabajador.trabajador

          if (getPersona && getTrabajador) {
            let fechaNacimiento = '';

            if (getTrabajador.fecha_nacimiento) {
              const partsFechaNacimiento = getTrabajador.fecha_nacimiento.split('T');
              const partsFecha = partsFechaNacimiento[0].split("-")
              fechaNacimiento = `${partsFecha[0]}-${partsFecha[1]}-${partsFecha[2]}`;
            }

            trabajador.value.nombres = getTrabajador.nombres.trim() || '';
            trabajador.value.apellido_paterno = getTrabajador.apellido_paterno.trim() || '';
            trabajador.value.apellido_materno = getTrabajador.apellido_materno.trim() || '';
            trabajador.value.fecha_nacimiento = fechaNacimiento;
            trabajador.value.sexo = getTrabajador.sexo || '';
            trabajador.value.telefono = getTrabajador.telefono.trim() || '';

            storeToast.addToast(storeTrabajador.message, 'warning')
            isDuplicated.value = true

            registerTrabajador.value = false
            registerPersona.value = false
          } else if (!getTrabajador && getPersona) {
            let fechaNacimiento = '';

            if (getPersona.fecha_nacimiento) {
              const partsFechaNacimiento = getPersona.fecha_nacimiento.split('/');
              fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`;
            }

            trabajador.value.nombres = getPersona.nombres.trim() || '';
            trabajador.value.apellido_paterno = getPersona.apellido_paterno.trim() || '';
            trabajador.value.apellido_materno = getPersona.apellido_materno.trim() || '';
            trabajador.value.fecha_nacimiento = fechaNacimiento;
            trabajador.value.sexo = getPersona.sexo || '';

            isDuplicated.value = false

            registerTrabajador.value = true
            registerPersona.value = false
          } else if (getTrabajador && !getPersona) {
            let fechaNacimiento = '';

            if (getTrabajador.fecha_nacimiento) {
              const partsFechaNacimiento = getTrabajador.fecha_nacimiento.split('/');
              fechaNacimiento = `${partsFechaNacimiento[2]}-${partsFechaNacimiento[1]}-${partsFechaNacimiento[0]}`;
            }

            trabajador.value.nombres = getTrabajador.nombres.trim() || '';
            trabajador.value.apellido_paterno = getTrabajador.apellido_paterno.trim() || '';
            trabajador.value.apellido_materno = getTrabajador.apellido_materno.trim() || '';
            trabajador.value.fecha_nacimiento = fechaNacimiento;
            trabajador.value.sexo = getTrabajador.sexo || '';
            trabajador.value.telefono = getTrabajador.telefono.trim() || '';

            storeToast.addToast(storeTrabajador.message, 'warning')
            isDuplicated.value = true

            registerTrabajador.value = false
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

              trabajador.value.nombres = persona.nombres.trim() || '';
              trabajador.value.apellido_paterno = persona.apellido_paterno.trim() || '';
              trabajador.value.apellido_materno = persona.apellido_materno.trim() || '';
              trabajador.value.fecha_nacimiento = fechaNacimiento;
              trabajador.value.sexo = persona.sexo || '';

              storeToast.addToast(storePersona.message, 'success')
              isDuplicated.value = false

              registerTrabajador.value = true
              registerPersona.value = false
            } else {
              storeToast.addToast(storePersona.message, 'error')
              isDuplicated.value = false

              registerTrabajador.value = false
              registerPersona.value = false
            }
          }
        }
      } catch (error) {
        console.error(error);
        storeToast.addToast('Falló al buscar persona', 'error')
        isDuplicated.value = false

        registerTrabajador.value = false
        registerPersona.value = false
      } finally {
        loading.value = false; // Desactiva el estado de carga
      }
    }

    const cancelar = () => {
      trabajador.value = {
        id_cargo: '',
        id_tipodocumento: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        direccion: '',
        email: '',
        fecha_nacimiento: null,
        sexo: '',
      }
      isDuplicated.value = false
    }

    const resetForm = () => {
      trabajador.value = {
        id: null,
        id_cargo: '',
        id_tipodocumento: '',
        numero_documento: '',
        apellido_paterno: '',
        apellido_materno: '',
        nombres: '',
        telefono: '',
        direccion: '',
        email: '',
        fecha_nacimiento: null,
        sexo: '',
      };
    };

    onMounted(async () => {
      storeTipoDocumento.fetchTiposPorCategoria('persona')
      storeCargo.fetchCargos()

      const trabajadorId = route.params.id

      if (trabajadorId) {
        await storeTrabajador.getTrabajadorById(trabajadorId)
        trabajador.value = storeTrabajador.trabajador || {}

        if (trabajador.value.fecha_nacimiento) {
          const partFecha = trabajador.value.fecha_nacimiento.split("T")
          trabajador.value.fecha_nacimiento = partFecha[0]
          isReadOnly.value = true
        }
      }

      storeTrabajador.message = ""
    })

    return {
      tipos,
      cargos,
      trabajador,
      submitForm,
      fetchPersona,
      isDuplicated,
      loading,
      cancelar,
      errors,
      notificationAction,
      isReadOnly
    }
  }
}
</script>
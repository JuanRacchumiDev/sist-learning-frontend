<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="grid grid-cols-2 gap-4">
        <div class="mb-1">
          <label for="id_tipoevento" class="block text-sm font-medium text-gray-700">Tipo de evento: <span
              class="text-red-500">*</span></label>
          <select name="id_tipoevento" id="id_tipoevento" v-model="evento.id_tipoevento"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE --</option>
            <option v-for="tipo in tipos" :value="tipo.id" :key="tipo.id">
              {{ tipo.nombre }}
            </option>
          </select>
          <div v-if="errors.id_tipoevento" class="text-red-600 text-sm mt-1">{{ errors.id_tipoevento }}</div>
        </div>
        <div class="mb-1">
          <label for="titulo" class="block text-sm font-medium text-gray-700">Nombre: <span
              class="text-red-500">*</span></label>
          <input v-model="evento.titulo" type="text" id="titulo" autocomplete="off" maxlength="120"
            placeholder="Ejm: Crianza de ganado"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.titulo" class="text-red-600 text-sm mt-1">{{ errors.titulo }}</div>
        </div>
        <div class="mb-1">
          <label for="id_instructor" class="block text-sm font-medium text-gray-700">Instructor:</label>
          <select name="id_instructor" id="id_instructor" v-model="evento.id_instructor"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="">- SELECCIONE --</option>
            <option v-for="inst in instructores" :value="inst.id" :key="inst.id">
              {{ inst.apellido_paterno }} {{ inst.apellido_materno }} {{ inst.nombres }}
            </option>
          </select>
        </div>
        <div class="mb-1">
          <label for="duracion" class="block text-sm font-medium text-gray-700">Duración: <span
              class="text-red-500">*</span></label>
          <input v-model="evento.duracion" type="text" id="duracion" autocomplete="off" placeholder="80 horas"
            maxlength="10"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.duracion" class="text-red-600 text-sm mt-1">{{ errors.duracion }}</div>
        </div>
        <div class="mb-1">
          <label for="fecha_inicio" class="block text-sm font-medium text-gray-700">Fecha Inicio: <span
              class="text-red-500">*</span></label>
          <input v-model="evento.fecha_inicio" type="date" id="fecha_inicio" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          <div v-if="errors.fecha_inicio" class="text-red-600 text-sm mt-1">{{ errors.fecha_inicio }}</div>
        </div>
        <div class="mb-1">
          <label for="fecha_fin" class="block text-sm font-medium text-gray-700">Fecha Final:</label>
          <input v-model="evento.fecha_fin" type="date" id="fecha_fin" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
        </div>
        <div class="mb-1">
          <label for="modalidad" class="block text-sm font-medium text-gray-700">Modalidad:</label>
          <select name="modalidad" id="modalidad" v-model="evento.modalidad"
            class="mt-1 p-2 border border-gray-300 rounded w-full">
            <option value="Presencial">PRESENCIAL</option>
            <option value="Virtual">VIRTUAL</option>
            <option value="Mixto">MIXTO</option>
          </select>
        </div>
        <div class="mb-1 col-span-2">
          <label for="temario" class="block text-sm font-medium text-gray-700">Temario: <span
              class="text-red-500">*</span></label>
          <textarea v-model="evento.temario" id="temario" autocomplete="off"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300 h-32"></textarea>
          <div v-if="errors.temario" class="text-red-600 text-sm mt-1">{{ errors.temario }}</div>
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
              ? 'Cargando...'
              : evento.id
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
import { onMounted, ref, computed } from 'vue';
import { useRoute } from "vue-router"
import {
  useEventoStore,
  useTipoEventoStore,
  useToastStore,
  useInstructorStore
} from '@/stores';

export default {
  setup() {
    const evento = ref({
      id: null,
      id_tipoevento: '',
      id_instructor: '',
      titulo: '',
      temario: '',
      fecha_inicio: null,
      fecha_fin: null,
      duracion: '',
      modalidad: 'Virtual',
    })

    const loading = ref(false)
    const isDuplicated = ref(false)
    const errors = ref({})

    const storeEvento = useEventoStore()
    const storeTipoEvento = useTipoEventoStore()
    const storeInstructor = useInstructorStore()
    const storeToast = useToastStore()

    const route = useRoute()

    const tipos = computed(() => {
      return [...storeTipoEvento.tipos]
    })

    const instructores = computed(() => {
      return [...storeInstructor.instructores]
    })

    const validateForm = () => {
      errors.value = {}

      if (!evento.value.id_tipoevento) {
        errors.value.id_tipoevento = 'Seleccione un tipo de evento'
      }

      if (!evento.value.titulo || evento.value.titulo.trim() === '') {
        errors.value.titulo = 'El título es obligatorio'
      }

      if (!evento.value.fecha_inicio) {
        errors.value.fecha_inicio = 'La fecha de inicio es obligatoria'
      }

      if (!evento.value.duracion || evento.value.duracion.trim() === '') {
        errors.value.duracion = 'La duración es obligatoria'
      }

      if (!evento.value.temario || evento.value.temario.trim() === '') {
        errors.value.temario = 'El temario es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return

      loading.value = true
      isDuplicated.value = false

      try {

        await storeEvento.getEventoByTitulo(evento.value.titulo.trim())

        if (storeEvento.evento) {
          storeToast.addToast('El evento ya existe', 'warning')
          isDuplicated.value = false
          return
        }

        evento.value.titulo = evento.value.titulo.trim()
        evento.value.duracion = evento.value.duracion.trim()
        evento.value.temario = evento.value.temario.trim()

        if (evento.value.id) {
          await storeEvento.updateEvento(evento.value.id, evento.value)

          const classToast = (storeEvento.result) ? 'success' : 'error'
          storeToast.addToast(storeEvento.message, classToast)

          isDuplicated.value = false
        } else {
          await storeEvento.createEvento(evento.value);

          const classToast = (storeEvento.result) ? 'success' : 'error'
          storeToast.addToast(storeEvento.message, classToast)
          if (storeEvento.result) resetForm()

          isDuplicated.value = false
        }
      } catch (error) {
        console.error('error creating evento', error);
        storeToast.addToast('Falló al registrar el evento', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false; // Desactivar el spinner
      }
    }

    const cancelar = () => {
      evento.value = {
        id_tipoevento: '',
        titulo: '',
        temario: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion: '',
        modalidad: 'Virtual',
        plantilla_certificado: null
      }
      isDuplicated.value = false
    }

    const resetForm = () => {
      evento.value = {
        id: null,
        id_tipoevento: '',
        titulo: '',
        temario: '',
        fecha_inicio: null,
        fecha_fin: 'null',
        duracion: '',
        modalidad: 'Virtual',
      };

      isDuplicated.value = false
    };

    onMounted(async () => {
      storeTipoEvento.fetchTipoEventos()

      storeInstructor.fetchInstructores()

      const eventoId = route.params.id

      if (eventoId) {

        await storeEvento.getEventoById(eventoId)

        evento.value = storeEvento.evento || {}

        if (evento.value) {

          const partFecha = evento.value.fecha_inicio.split("T")

          evento.value.fecha = partFecha[0]
        }
      }
      storeEvento.message = ""
    })

    return {
      tipos,
      evento,
      loading,
      submitForm,
      cancelar,
      errors,
      isDuplicated,
      instructores
    }
  }
}
</script>
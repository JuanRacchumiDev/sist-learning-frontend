<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="mb-1">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre: <span
            class="text-red-500">*</span></label>
        <input v-model="tipoEvento.nombre" type="text" id="nombre" autocomplete="off" placeholder="Ejm: Capacitación"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          maxlength="40" />
        <div v-if="errors.nombre" class="text-red-600 text-sm mt-1">{{ errors.nombre }}</div>
      </div>
      <div class="mb-1">
        <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción:</label>
        <textarea v-model="tipoEvento.descripcion" id="descripcion" placeholder="Ejm: Tipo de eventos de corta duración"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"></textarea>
      </div>
      <div class="flex justify-between mt-2">
        <button type="submit"
          class="flex items-center px-4 py-2 bg-greenwhite-600 text-white rounded-md hover:bg-greenwhite-700 disabled:bg-greenwhite-300 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': isDuplicated }" :disabled="isDuplicated || loading">
          <svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="animate-spin h-5 w-5 mr-2" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          </svg>
          {{
            loading
              ? 'Cargando...'
              : tipoEvento.id
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"
import { useTipoEventoStore, useToastStore } from '@/stores';

export default {
  setup() {
    const tipoEvento = ref({
      id: null,
      nombre: '',
      descripcion: ''
    })

    const storeTipoEvento = useTipoEventoStore();
    const storeToast = useToastStore();

    const loading = ref(false);
    const isDuplicated = ref(false)
    const errors = ref({})

    const route = useRoute()

    const validateForm = () => {
      errors.value = {}

      if (!tipoEvento.value.nombre || tipoEvento.value.nombre.trim() === '') {
        errors.value.nombre = 'El nombre es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    onMounted(async () => {
      const tipoEventoId = route.params.id

      if (tipoEventoId) {
        await storeTipoEvento.getTipoEventoById(tipoEventoId)
        tipoEvento.value = storeTipoEvento.tipoEvento || {}
      }

      storeTipoEvento.message = ""
    })

    const submitForm = async () => {
      if (!validateForm()) return

      try {
        loading.value = true;
        isDuplicated.value = false

        await storeTipoEvento.getTipoEventoByNombre(tipoEvento.value.nombre.trim())

        if (storeTipoEvento.tipoEvento) {
          storeToast.addToast('Tipo de evento ya existe', 'warning')
          isDuplicated.value = false
          return
        }

        tipoEvento.value.nombre = tipoEvento.value.nombre.trim()

        if (tipoEvento.value.id) {
          await storeTipoEvento.updateTipoEvento(tipoEvento.value.id, tipoEvento.value);

          const classToast = (storeTipoEvento.result) ? 'success' : 'error'
          storeToast.addToast(storeTipoEvento.message, classToast)

          isDuplicated.value = false
        } else {
          await storeTipoEvento.createTipoEvento(tipoEvento.value);

          const classToast = (storeTipoEvento.result) ? 'success' : 'error'
          storeToast.addToast(storeTipoEvento.message, classToast)
          if (storeTipoEvento.result) resetForm()
          isDuplicated.value = false
        }
      } catch (error) {
        storeToast.addToast('Falló al registrar el tipo de evento', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false;
      }
    };

    const cancelar = () => {
      tipoEvento.value = {
        nombre: '',
        descripcion: ''
      }
      isDuplicated.value = false
    }

    const resetForm = () => {
      tipoEvento.value = {
        id: null,
        nombre: '',
        descripcion: '',
      };
      isDuplicated.value = false
    };

    return {
      tipoEvento,
      loading,
      submitForm,
      cancelar,
      errors,
      isDuplicated
    }
  }
}
</script>
<template>
  <div class="px-6 py-4">
    <form @submit.prevent="submitForm">
      <div class="mb-1">
        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre: <span
            class="text-red-500">*</span></label>
        <input v-model="cargo.nombre" type="text" id="nombre" autocomplete="off" placeholder="Ejm: Capacitación"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          maxlength="50" />
        <div v-if="errors.nombre" class="text-red-600 text-sm mt-1">{{ errors.nombre }}</div>
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
              : cargo.id
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
import { useCargoStore, useToastStore } from '@/stores';

export default {
  setup() {
    const cargo = ref({
      id: null,
      nombre: ''
    })

    const storeCargo = useCargoStore();
    const storeToast = useToastStore();

    const loading = ref(false);
    const isDuplicated = ref(false)
    const errors = ref({})

    const route = useRoute()

    const validateForm = () => {
      errors.value = {}

      if (!cargo.value.nombre || cargo.value.nombre.trim() === '') {
        errors.value.nombre = 'El nombre es obligatorio'
      }

      return Object.keys(errors.value).length === 0
    }

    onMounted(async () => {
      const cargoId = route.params.id

      if (cargoId) {
        await storeCargo.getCargoById(cargoId)
        cargo.value = storeCargo.cargo || {}
      }

      storeCargo.message = ""
    })

    const submitForm = async () => {
      if (!validateForm()) return

      try {
        loading.value = true;
        isDuplicated.value = false

        await storeCargo.getCargoByNombre(cargo.value.nombre.trim())

        if (storeCargo.cargo) {
          storeToast.addToast('Cargo ya existe', 'warning')
          isDuplicated.value = false
          return
        }

        cargo.value.nombre = cargo.value.nombre.trim()

        if (cargo.value.id) {
          await storeCargo.updateCargo(cargo.value.id, cargo.value);

          const classToast = (storeCargo.result) ? 'success' : 'error'
          storeToast.addToast(storeCargo.message, classToast)

          isDuplicated.value = false
        } else {
          await storeCargo.createCargo(cargo.value);

          const classToast = (storeCargo.result) ? 'success' : 'error'
          storeToast.addToast(storeCargo.message, classToast)
          if (storeCargo.result) resetForm()
          isDuplicated.value = false
        }
      } catch (error) {
        storeToast.addToast('Falló al registrar el cargo', 'error')
        isDuplicated.value = false
      } finally {
        loading.value = false;
      }
    };

    const cancelar = () => {
      cargo.value = {
        nombre: ''
      }
      isDuplicated.value = false
    }

    const resetForm = () => {
      cargo.value = {
        id: null,
        nombre: '',
      };
      isDuplicated.value = false
    };

    return {
      cargo,
      loading,
      submitForm,
      cancelar,
      errors,
      isDuplicated
    }
  }
}
</script>
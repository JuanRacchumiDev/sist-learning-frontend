<template>
  <div class="card m-3">
    <h4 class="card-header">Register</h4>
    <div class="card-body">
      <form @submit.prevent="register">
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" autocomplete="off" required v-model="usuario.username"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="text" id="password" autocomplete="off" required v-model="usuario.password"
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
          </div>
        </div>
        <div class="flex justify-between">
          <button type="submit"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
            <!-- Spinner para el estado de carga -->
            <span class="mr-2">
              <svg class="animate-spin h-5 w-5 border-t-2 border-white rounded-full" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke-width="4" />
              </svg> </span>Registrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useUsuarioStore } from '@/stores';
import { router } from '@/router';

export default {
  setup() {
    const usuarioStore = useUsuarioStore();

    const register = async () => {
      try {
        const response = await usuarioStore.register(
          username.value,
          password.value
        );
        await router.push('/account/login');
      } catch (error) {
        console.error('error creating usuario', error);
      }
    };

    return {
      register
    }
  },
};
</script>

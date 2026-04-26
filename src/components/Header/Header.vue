<template>
    <header class="flex items-center justify-end bg-white px-4 py-2 shadow dark:bg-gray-800">
        <div class="relative">
            <div class="flex items-center gap-3 cursor-pointer select-none" @click="toggleDropdown">
                <div class="hidden sm:flex flex-col text-right">
                    <span class="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                        {{ userInfo.nombre || 'Usuario' }}
                    </span>

                    <div class="h-[1px] w-full bg-gray-200 dark:bg-gray-700 my-0.5"></div>

                    <span
                        class="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold leading-none">
                        {{ userInfo.perfil || 'Perfil' }}
                    </span>
                </div>

                <div v-if="userInfo.imagen" class="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600">
                    <img :src="userInfo.imagen" alt="User" class="h-full w-full rounded-full object-cover" />
                </div>
                <div v-else
                    class="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                    <span class="text-xs font-bold">{{ userInfo.iniciales }}</span>
                </div>
            </div>

            <div v-if="dropdownOpen"
                class="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-gray-700 z-50">
                <div class="px-4 py-2 border-b dark:border-gray-600 sm:hidden">
                    <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ userInfo.nombre }}</p>
                    <p class="text-[10px] text-blue-500 font-semibold">{{ userInfo.perfil }}</p>
                </div>
                <ul class="py-1">
                    <li>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600 flex items-center gap-2"
                            @click="logout">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Cerrar sesión</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script>
import { ref, computed, onMounted } from "vue"
import { useAuthStore } from "@/stores"

export default {
    name: 'Header',
    setup() {
        const dropdownOpen = ref(false)
        const usuarioData = ref(null)
        const authStore = useAuthStore()

        const loadUserData = () => {
            const authStr = localStorage.getItem('auth')

            if (authStr) {
                try {
                    const authObj = JSON.parse(authStr)
                    usuarioData.value = authObj.usuario
                } catch (e) {
                    console.error("Error parseando auth de localStorage", e)
                }
            }
        }

        onMounted(loadUserData)

        const toggleDropdown = () => {
            dropdownOpen.value = !dropdownOpen.value
        }

        const logout = () => {
            dropdownOpen.value = false
            authStore.logout()
        }

        // Propiedad computada unificada para la información del usuario
        const userInfo = computed(() => {
            const data = usuarioData.value

            if (!data) return { iniciales: 'U', nombre: '', perfil: '', imagen: null }

            // Generar iniciales desde nombre_persona (ej: "Pastor Quiñonez" -> "PQ")
            const parts = data.nombre_persona?.split(' ') || []
            const first = parts[0]?.charAt(0) || ''
            const last = parts[1]?.charAt(0) || '' // Cambiado a charAt(0) para inicial correcta

            return {
                nombre: data.nombre_persona,
                perfil: data.nombre_perfil,
                iniciales: `${first}${last}`.toUpperCase(),
                imagen: data.imagen || null
            }
        })

        return {
            dropdownOpen,
            toggleDropdown,
            logout,
            userInfo
        }
    }
}

</script>
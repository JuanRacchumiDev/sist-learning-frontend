<template>
    <div class="px-6 py-4">
        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
                <div class="mb-1">
                    <fieldset class="mb-4 border border-gray-300 rounded p-4">
                        <legend class="text-sm font-semibold text-blue-700 px-2">Búsqueda de usuario</legend>
                        <label for="id_cargo" class="block text-sm font-medium text-gray-700">Cargos: <span
                                class="text-red-500">*</span></label>
                        <select name="id_cargo" id="id_cargo" v-model="usuario.id_cargo"
                            class="mt-1 p-2 border border-gray-300 rounded w-full">
                            <option value="">- SELECCIONE --</option>
                            <option v-for="cargo in cargos" :value="cargo.id" :key="cargo.id">
                                {{ cargo.nombre }}
                            </option>
                            <option value="i">Instructor</option>
                            <option value="e">Estudiante</option>
                        </select>
                        <div v-if="errors.id_cargo" class="text-red-600 text-sm mt-1">{{ errors.id_cargo }}</div>

                        <div v-if="personas.length > 0" class="mt-2">
                            <label for="id_persona" class="block text-sm font-medium text-gray-700">Buscar persona:
                                <span class="text-red-500">*</span></label>
                            <input type="text" v-model="search" id="id_persona" placeholder="Buscar por nombre..."
                                class="mt-2 mb-2 block w-full p-2 border border-gray-300 rounded-md"
                                @keyup.enter.prevent="filtrarPersonas" />
                            <div class="mt-2 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
                                <ul>
                                    <li v-for="p in personasFiltradas" :key="p.id"
                                        class="p-2 hover:bg-gray-200 cursor-pointer" @click="seleccionarPersona(p)">
                                        {{ p.nombres }} {{ p.apellido_paterno }} {{ p.apellido_materno }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="mb-1">
                    <fieldset class="border border-blue-300 rounded p-4">
                        <legend class="text-sm font-semibold text-blue-700 px-2">{{ tipoCargoSeleccionado }}
                            seleccionada (o)</legend>
                        <div v-if="personaSeleccionada" class="mt-2">
                            <p class="text-sm text-gray-700">
                                <strong>Nombre: </strong>
                                {{ personaSeleccionada.nombres }} {{ personaSeleccionada.apellido_paterno }} {{
                                    personaSeleccionada.apellido_materno }}
                            </p>
                        </div>

                        <label for="username" class="block text-sm font-medium text-gray-700 mt-2">Nombre de usuario:
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="usuario.username" type="text" id="username" autocomplete="off" maxlength="70"
                            placeholder="Ejm: juan.jose" disabled
                            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
                        <div v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</div>

                        <label for="password" class="block text-sm font-medium text-gray-700 mt-2">Contraseña:
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="usuario.password" type="password" id="password" autocomplete="off"
                            maxlength="70" placeholder="Ejm: juan.jose" disabled
                            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300" />
                        <div v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</div>

                        <label for="id_perfil" class="block text-sm font-medium text-gray-700 mt-2">Perfil: <span
                                class="text-red-500">*</span></label>
                        <select name="id_perfil" id="id_perfil" v-model="usuario.id_perfil"
                            class="mt-1 p-2 border border-gray-300 rounded w-full">
                            <option value="">- SELECCIONE --</option>
                            <option v-for="perfil in perfiles" :value="perfil.id" :key="perfil.id">
                                {{ perfil.nombre }}
                            </option>
                        </select>
                    </fieldset>
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
                            : usuario.id
                                ? 'Actualizar'
                                : 'Registrar'
                    }}
                </button>
                <button type="button"
                    class="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ml-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    :disabled="loading" @click="cancelar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
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
    useUsuarioStore,
    usePerfilStore,
    useInstructorStore,
    useAlumnoStore,
    useCargoStore,
    useTrabajadorStore,
    useToastStore
} from '@/stores';

export default {
    setup() {
        const PASSWORD_DEFAULT = '123456'

        const usuario = ref({
            id: null,
            id_cargo: '',
            id_perfil: '',
            username: '',
            password: '',
            id_persona: '',
            id_trabajador: null,
            id_instructor: null,
            id_alumno: null
        })

        const loading = ref(false)
        const isDuplicated = ref(false)
        const errors = ref({})

        const search = ref("")
        const personas = ref([])
        const personasFiltradas = ref([])
        const personaSeleccionada = ref(null)

        const storeUsuario = useUsuarioStore()
        const storePerfil = usePerfilStore()
        const storeInstructor = useInstructorStore()
        const storeAlumno = useAlumnoStore()
        const storeCargo = useCargoStore()
        const storeTrabajador = useTrabajadorStore()
        const storeToast = useToastStore()

        const route = useRoute()

        const cargos = computed(() => {
            return [...storeCargo.cargos].sort((a, b) => a.nombre.localeCompare(b.nombre))
        })

        const perfiles = computed(() => {
            return [...storePerfil.perfiles].sort((a, b) => a.nombre.localeCompare(b.nombre))
        })

        const tipoCargoSeleccionado = computed(() => {
            let nombreCargo = 'Persona'
            const idCargo = usuario.value.id_cargo

            if (idCargo) {
                if (typeof idCargo === 'string' && idCargo === 'i') {
                    nombreCargo = 'Instructor'
                } else if (typeof idCargo === 'string' && idCargo === 'e') {
                    nombreCargo = 'Estudiante'
                } else {
                    nombreCargo = 'Trabajador'
                }
            }
            return nombreCargo
        })

        const filtrarPersonas = () => {
            if (!search.value.trim()) {
                personasFiltradas.value = personas.value
                return
            }

            const termino = search.value.toLowerCase().trim()
            personasFiltradas.value = personas.value.filter(
                p => `${p.nombres} ${p.apellido_paterno} ${p.apellido_materno}`.toLowerCase().includes(termino)
            )
        }

        const seleccionarPersona = (persona) => {
            personaSeleccionada.value = persona
            usuario.value.id_persona = persona.id

            if (usuario.value.id_cargo === 'i') {
                usuario.value.id_instructor = persona.id
            } else if (usuario.value.id_cargo === 'e') {
                usuario.value.id_alumno = persona.id
            } else {
                usuario.value.id_trabajador = persona.id
            }

            usuario.value.username = persona.numero_documento.trim()
            usuario.value.password = PASSWORD_DEFAULT
        }

        const validateForm = () => {
            errors.value = {}

            if (!usuario.value.id_cargo) {
                errors.value.id_cargo = 'Seleccione un cargo'
            }

            if (!usuario.value.id_perfil) {
                errors.value.id_perfil = 'Seleccione un perfil'
            }

            if (!usuario.value.username || usuario.value.username.trim() === '') {
                errors.value.username = 'El nombre de usuario es obligatorio'
            }

            if (!usuario.value.id_persona) {
                errors.value.id_persona = 'Seleccione una persona'
            }

            if (!usuario.value.password || usuario.value.password.trim() === '') {
                errors.value.password = 'La contraseña es obligatoria'
            }

            return Object.keys(errors.value).length === 0
        }

        onMounted(async () => {
            storeCargo.fetchCargos()
            storePerfil.fetchPerfiles()

            const usuarioId = route.params.id

            if (usuarioId) {
                await storeUsuario.getEventoById(usuarioId)
                usuario.value = storeUsuario.usuario || {}
            }
            storeUsuario.message = ""
        })

        const submitForm = async () => {
            if (!validateForm()) return

            loading.value = true
            isDuplicated.value = false

            try {
                usuario.value.username = usuario.value.username.trim()
                usuario.value.password = usuario.value.password.trim()

                if (usuario.value.id) {
                    await storeUsuario.updateUsuario(usuario.value.id, usuario.value)
                    const classToast = (storeUsuario.result) ? 'success' : 'error'
                    storeToast.addToast(storeUsuario.message, classToast)
                } else {
                    await storeUsuario.createUsuario(usuario.value)
                    const classToast = (storeUsuario.result) ? 'success' : 'error'
                    storeToast.addToast(storeUsuario.message, classToast)
                    if (storeUsuario.result) resetForm()
                }

                isDuplicated.value = false
                personaSeleccionada.value = null
                search.value = ""
            } catch (error) {
                storeToast.addToast('Falló al registrar usuario', 'error')
                isDuplicated.value = false
            } finally {
                loading.value = false; // Desactivar el spinner
            }
        }

        const resetForm = () => {
            usuario.value = {
                id: null,
                id_cargo: '',
                id_perfil: '',
                username: '',
                password: '',
                id_persona: ''
            };
            isDuplicated.value = false
            search.value = ""
        }

        const cancelar = () => resetForm()

        // Detectar cambios en el perfil seleccionado
        watch(() => usuario.value.id_cargo, async (nuevoCargoId) => {
            if (!nuevoCargoId) {
                personas.value = []
                return
            }

            if (nuevoCargoId === 'i') {
                await storeInstructor.fetchInstructores()
                personas.value = storeInstructor.instructores
            } else if (nuevoCargoId === 'e') {
                await storeAlumno.fetchAlumnos()
                personas.value = storeAlumno.alumnos
            } else {
                await storeTrabajador.fetchTrabajadores()
                personas.value = storeTrabajador.trabajadores
            }

            personasFiltradas.value = personas.value
            personaSeleccionada.value = null
            usuario.value.id_persona = ""
            usuario.value.username = ""
        })

        return {
            cargos,
            perfiles,
            usuario,
            loading,
            submitForm,
            cancelar,
            errors,
            isDuplicated,
            search,
            personas,
            personasFiltradas,
            filtrarPersonas,
            personaSeleccionada,
            seleccionarPersona,
            tipoCargoSeleccionado
        }
    }
}
</script>
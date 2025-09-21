<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full max-w-3xl">
                <DefaultCard :cardTitle="cardTitle">
                    <AlumnoForm />
                </DefaultCard>
            </div>
        </div>
    </DefaultLayout>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import DefaultCard from "@/components/Common/DefaultCard.vue"
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue"
import AlumnoForm from "@/components/Sistema/Alumno/AlumnoForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        AlumnoForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo alumno")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/alumno',
                    'title': 'Alumno'
                }
            ]
        )

        onMounted(() => {
            const alumnoId = route.params.id
            if (alumnoId) {
                pageTitle.value = "Editar alumno",
                    cardTitle.value = "Formulario de actualización"
            }
        })

        return {
            pageTitle,
            urlCurrentName,
            cardTitle,
            options
        }
    }
}
</script>
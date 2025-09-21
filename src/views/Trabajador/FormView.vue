<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full max-w-3xl">
                <DefaultCard :cardTitle="cardTitle">
                    <TrabajadorForm />
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
import TrabajadorForm from "@/components/Sistema/Trabajador/TrabajadorForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        TrabajadorForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo trabajador")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/trabajador',
                    'title': 'Trabajador'
                }
            ]
        )

        onMounted(() => {
            const trabajadorId = route.params.id
            if (trabajadorId) {
                pageTitle.value = "Editar trabajador",
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
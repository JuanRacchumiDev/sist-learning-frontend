<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full max-w-3xl">
                <DefaultCard :cardTitle="cardTitle">
                    <TipoEventoForm />
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
import TipoEventoForm from "@/components/Sistema/TipoEvento/TipoEventoForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        TipoEventoForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo tipo de evento")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/dashboard',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/tipo-evento',
                    'title': 'Tipo de evento'
                }
            ]
        )

        onMounted(() => {
            const tipoEventoId = route.params.id
            if (tipoEventoId) {
                pageTitle.value = "Editar tipo de evento",
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
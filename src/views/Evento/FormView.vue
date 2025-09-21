<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full max-w-3xl">
                <DefaultCard :cardTitle="cardTitle">
                    <EventoForm />
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
import EventoForm from "@/components/Sistema/Evento/EventoForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        EventoForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo evento")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/evento',
                    'title': 'Evento'
                }
            ]
        )

        onMounted(() => {
            const eventoId = route.params.id
            if (eventoId) {
                pageTitle.value = "Editar evento",
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
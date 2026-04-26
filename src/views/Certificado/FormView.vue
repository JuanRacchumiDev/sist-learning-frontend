<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full">
                <DefaultCard :cardTitle="cardTitle">
                    <CertificadoForm />
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
import CertificadoForm from "@/components/Sistema/Certificado/CertificadoForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        CertificadoForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo certificado")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/certificado',
                    'title': 'Certificado'
                }
            ]
        )

        onMounted(() => {
            const certificadoId = route.params.id
            if (certificadoId) {
                pageTitle.value = "Editar certificado",
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
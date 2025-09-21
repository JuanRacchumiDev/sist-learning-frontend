<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" :options="options" />
        <div class="flex justify-center items-center">
            <div class="w-full max-w-3xl">
                <DefaultCard :cardTitle="cardTitle">
                    <CargoForm />
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
import CargoForm from "@/components/Sistema/Cargo/CargoForm.vue"

export default {
    name: 'FormView',
    components: {
        DefaultLayout,
        DefaultCard,
        BreadcrumbDefault,
        CargoForm
    },
    setup() {
        const pageTitle = ref("")
        const urlCurrentName = ref("Nuevo cargo")

        const cardTitle = ref("Formulario de registro")
        const route = useRoute()

        const options = ref(
            [
                // {
                //     'url': '/',
                //     'title': 'Dashboard'
                // },
                {
                    'url': '/cargo',
                    'title': 'Cargo'
                }
            ]
        )

        onMounted(() => {
            const cargoId = route.params.id
            if (cargoId) {
                pageTitle.value = "Editar cargo",
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
<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" />
        <div class="flex flex-col gap-10">
            <EventoTable />
            <Pagination :currentPage="pagination.currentPage" :totalItems="pagination.totalItems"
                :limit="pagination.limit" @page-changed="handlePageChange" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import EventoTable from "@/components/Sistema/Evento/EventoTable.vue"
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue"
import Pagination from "@/components/Common/Pagination.vue"
import { useEventoStore } from "@/stores"

const eventoStore = useEventoStore()

const pageTitle = ref("Listado")
const urlCurrentName = ref("Evento")

const pagination = computed(() => eventoStore.pagination)

const handlePageChange = (page) => {
    eventoStore.fetchEventosPaginate({ page: page })
}

onMounted(() => {
    eventoStore.currentQuery = ""
    eventoStore.fetchEventosPaginate({})
})
</script>
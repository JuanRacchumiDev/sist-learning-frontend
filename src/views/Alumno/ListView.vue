<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" />
        <div class="flex flex-col gap-10">
            <AlumnoTable />
            <Pagination :currentPage="pagination.currentPage" :totalItems="pagination.totalItems"
                :limit="pagination.limit" @page-changed="handlePageChange" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import AlumnoTable from "@/components/Sistema/Alumno/AlumnoTable.vue"
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue"
import Pagination from "@/components/Common/Pagination.vue"
import { useAlumnoStore } from "@/stores"

const alumnoStore = useAlumnoStore()

const pageTitle = ref("Listado")
const urlCurrentName = ref("Alumno")

const pagination = computed(() => alumnoStore.pagination)

const handlePageChange = (page) => {
    alumnoStore.fetchAlumnosPaginate({ page: page })
}

onMounted(() => {
    alumnoStore.currentQuery = ""
    alumnoStore.fetchAlumnosPaginate({})
})
</script>
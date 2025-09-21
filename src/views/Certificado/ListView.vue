<template>
    <DefaultLayout>
        <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" />
        <div class="flex flex-col gap-10">
            <CertificadoTable />
            <Pagination :currentPage="pagination.currentPage" :totalItems="pagination.totalItems"
                :limit="pagination.limit" @page-changed="handlePageChange" />
        </div>
    </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import CertificadoTable from "@/components/Sistema/Certificado/CertificadoTable.vue"
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue"
import Pagination from "@/components/Common/Pagination.vue"
import { useCertificadoStore } from "@/stores"

const certificadorStore = useCertificadoStore()

const pageTitle = ref("Listado")
const urlCurrentName = ref("Certificado")

const pagination = computed(() => certificadorStore.pagination)

const handlePageChange = (page) => {
    certificadorStore.fetchCertificados({ page: page })
}

onMounted(() => {
    certificadorStore.currentQuery = ""
    certificadorStore.fetchCertificados({})
})
</script>
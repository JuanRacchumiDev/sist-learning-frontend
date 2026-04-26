<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" :urlCurrentName="urlCurrentName" />
    <div class="flex flex-col gap-10">
      <UsuarioTable />
      <Pagination :currentPage="pagination.currentPage" :totalItems="pagination.totalItems" :limit="pagination.limit"
        @page-changed="handlePageChange" />
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import UsuarioTable from "@/components/Sistema/Usuario/UsuarioTable.vue"
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue"
import Pagination from "@/components/Common/Pagination.vue"
import { useUsuarioStore } from "@/stores"

const usuarioStore = useUsuarioStore()

const pageTitle = ref("Listado")
const urlCurrentName = ref("Usuario")

const pagination = computed(() => usuarioStore.pagination)

const handlePageChange = (page) => {
  usuarioStore.fetchUsuariosPaginate({ page: page })
}

onMounted(() => {
  usuarioStore.currentQuery = ""
  usuarioStore.fetchUsuariosPaginate({})
})
</script>
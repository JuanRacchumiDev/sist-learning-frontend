<template>
  <div>
    <h2>Detalle del Certificado: {{ codigo }}</h2>
    <div v-if="certificado">
      <p>{{ certificado }}</p>
    </div>
    <div v-else>
      <p>Cargando certificado...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCertificadoStore } from '@/stores/certificadoStore'

export default {
  setup() {
    const route = new useRoute()
    const codigo = route.params.codigo
    const certificado = ref(null)
    const certificadoStore = useCertificadoStore()

    const fetchCertificado = () => {
      certificadoStore.fetchCertificadoByCodigo(codigo)
      certificado.value = certificadoStore.certificado
    }

    onMounted(() => {
      fetchCertificado()
    })

    return {
      certificado
    }
  }
}
</script>

<style>
/* Estilos opcionales */
</style>
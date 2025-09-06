import ListView from "@/views/TipoEvento/ListView.vue"
import FormView from "@/views/TipoEvento/FormView.vue"

export default [
    {
        path: '/tipo-evento',
        name: 'List TipoEvento',
        component: ListView,
        meta: { title: 'Tipo de Evento' }
    }
]
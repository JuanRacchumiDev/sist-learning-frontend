import { ITipoEvento } from "./tipoEventoInterface"
import { IInstructor } from './instructorInterface'

export interface IEvento {
    id?: number
    id_parent?: number
    id_tipoevento?: number
    id_instructor?: number
    titulo?: string
    titulo_url?: string
    descripcion?: string
    temario?: string
    plantilla_certificado?: string
    fecha_inicio?: string
    fecha_fin?: string
    modalidad?: string
    precio?: number
    duracion?: string
    capacidad_maxima?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    tipoEvento?: ITipoEvento
    instructor?: IInstructor
}
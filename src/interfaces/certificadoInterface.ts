import { IAlumno } from "./alumnoInterface"
import { IEvento } from "./eventoInterface"

export interface ICertificado {
    id?: number
    id_alumno?: number
    id_evento?: number
    id_plantilla?: number
    codigo?: string
    codigo_qr?: string
    ruta?: string
    filename?: string
    nombre_impresion?: string
    fecha_registro?: Date
    fecha_descarga?: Date
    fecha_envio?: Date
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado?: boolean
    alumno?: IAlumno
    evento?: IEvento
}
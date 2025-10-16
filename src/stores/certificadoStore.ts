import { defineStore } from 'pinia'
import api from '../utils/axios'
import { ICertificado } from '../interfaces/certificadoInterface';
import { sanitizeFileName } from '@/utils/string.utils'
import { IAlumno } from '../interfaces/alumnoInterface'
import { useAlumnoStore } from './alumnoStore'
import { TQuery } from '../types/TQuery';

export const useCertificadoStore = defineStore('certificadoStore', {
    state: () => ({
        certificados: [] as ICertificado[],
        certificado: null as ICertificado | null,
        pagination: {
            currentPage: 1,
            limit: 10,
            totalPages: 1,
            totalItems: 0,
            nextPage: null,
            previousPage: null
        },
        currentQuery: '',
        loading: false,
        error: null as string | null,
        message: '',
        result: false
    }),
    actions: {
        async fetchCertificados({ page = 1, query = '', limit = 10 }: TQuery) {
            this.loading = true
            this.error = null

            const finalQuery = (query !== undefined && query.length > 0) ? query : this.currentQuery

            if (query !== undefined) {
                this.currentQuery = finalQuery
            }

            try {
                const response = await api.get('/certificado/paginate', {
                    params: {
                        page,
                        limit,
                        busqueda: finalQuery
                    }
                })

                const { data } = response

                const { result, data: certificadosData, pagination, message } = data

                if (result) {
                    this.certificados = certificadosData
                    this.pagination = pagination
                    this.result = result
                    this.message = message || "Certificados cargados exitosamente"
                } else {
                    this.certificados = []
                    this.pagination = { ...this.pagination, totalItems: 0, totalPages: 1, currentPage: 1 }
                    this.result = false;
                    this.message = message || 'No se pudieron cargar los certificados';
                }
            } catch (error) {
                this.result = false;
                this.message = 'Error al cargar los certificados';
                console.error('Error fetching certificados: ', error);
            } finally {
                this.loading = false
            }
        },
        async fetchCertificadosByAlumno() {
            this.loading = true
            this.error = null

            try {
                let idLogueado: number | null = null

                const auth = JSON.parse(localStorage.getItem('auth') || '{}')

                const { usuario } = auth

                const { id_alumno, id_instructor, id_trabajador, id_perfil } = usuario

                if (id_perfil === 2) {
                    idLogueado = id_alumno
                } else if (id_perfil === 3) {
                    idLogueado = id_instructor
                }

                const response = await api.get(`/certificado/alumno`, {
                    params: {
                        id_alumno: idLogueado
                    }
                })

                const { data: dataCertificados } = response

                const { result, data, message } = dataCertificados

                if (result) {
                    this.certificados = data.map((c: any) => ({
                        ...c,
                        alumno: c.Alumno,
                        evento: c.Evento
                    }))

                    this.result = result
                    this.message = 'Certificados obtenidos correctamente'
                } else {
                    this.result = false
                    this.message = message || 'Error al obtener certificados'
                }

            } catch (error) {
                this.result = false
                this.message = 'Error al obtener certificados por alumno'
                console.error('Error fetching certificados by alumno', error)
            } finally {
                this.loading = false
            }
        },
        async fetchCertificadoByAlumnoByEvento(id_alumno: number, id_evento: number) {
            this.loading = true
            this.error = null

            try {
                const responseCertificadoUpload = await api.get('/certificado-upload/busqueda', {
                    params: {
                        id_alumno,
                        id_evento
                    }
                })

                const { data: dataCertificadoUpload } = responseCertificadoUpload

                const {
                    result: resultUpload,
                    data: dataUpload,
                    message: messageUpload,
                } = dataCertificadoUpload

                if (resultUpload && dataUpload) {
                    this.certificado = dataUpload as ICertificado
                    this.message = messageUpload || "Certificado subido obtenido correctamente"
                    this.result = true
                } else {
                    const response = await api.get('/certificado/busqueda', {
                        params: {
                            id_alumno,
                            id_evento
                        }
                    })

                    const { data: dataCertificado } = response

                    const {
                        result,
                        data,
                        message,
                        error
                    } = dataCertificado

                    if (result && data) {
                        this.certificado = data as ICertificado
                        this.message = message || "Certificado obtenido correctamente"
                        this.result = true
                    } else {
                        this.message = message || error || 'Error desconocido'
                        this.certificado = null
                        this.result = false
                    }
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el certificado subido"
                this.error = error instanceof Error ? error.message : 'Error desconocido'
                console.error('Error fetching certificado subido metadata:', error);
            }
        },
        async fetchCertificadoById(id: number) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get(`/certificado/${id}`)

                const { data: dataCertificado } = response

                const { data, message, result, status, error } = dataCertificado

                if (result && status === 200) {
                    this.certificado = data as ICertificado
                    this.message = message || "Certificado obtenido correctamente"
                    this.result = true
                } else {
                    this.message = message || error || 'Error desconocido'
                    this.certificado = null
                    this.result = false
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el certificado"
                this.error = error instanceof Error ? error.message : 'Error desconocido'
                console.error('Error fetching certificado metadata:', error);
            }
        },
        async fetchCertificadoByCodigo(codigo: string) {
            this.loading = true
            this.error = null

            try {
                const response = await api.get(`/certificado/codigo/${codigo}`)

                const { data: dataCertificado } = response

                const { data, message, result, status, error } = dataCertificado

                if (result && status === 200) {
                    this.certificado = data as ICertificado
                    this.message = message || "Certificado obtenido correctamente"
                    this.result = true
                } else {
                    this.message = message || error || 'Error desconocido'
                    this.certificado = null
                    this.result = false
                }
            } catch (error) {
                this.result = false
                this.message = "Error al obtener el certificado"
                this.error = error instanceof Error ? error.message : 'Error desconocido'
                console.error('Error fetching certificado metadata:', error);
            }
        },
        async downloadCertificadoUploadByName(filename: string) {
            this.loading = true
            this.error = null

            try {
                const urlApi = `/certificado-upload/download/name/${filename}`;

                const response = await api.get(urlApi, {
                    responseType: 'blob'
                });

                const { status, data } = response;

                if (status === 200) {
                    this.result = true;
                    this.message = 'Certificado descargado correctamente';

                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else {
                    this.result = false;
                    this.message = 'Error al descargar el certificado';
                }
            } catch (error) {
                this.result = false;
                this.message = 'Error al descargar el certificado';
                console.error('Error downloading certificate by name:', error);
            } finally {
                this.loading = false;
            }
        },
        async downloadCertificadoByName(filename: string) {
            this.loading = true
            this.error = null

            try {
                const urlApi = `/certificado/download/name/${filename}`;

                const response = await api.get(urlApi, {
                    responseType: 'blob'
                });

                const { status, data } = response;

                if (status === 200) {
                    this.result = true;
                    this.message = 'Certificado descargado correctamente';

                    const url = window.URL.createObjectURL(new Blob([data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else {
                    this.result = false;
                    this.message = 'Error al descargar el certificado';
                }
            } catch (error) {
                this.result = false;
                this.message = 'Error al descargar el certificado';
                console.error('Error downloading certificate by name:', error);
            } finally {
                this.loading = false;
            }
        },
        async createCertificado(certificado: ICertificado) {
            this.loading = true;
            this.message = '';
            this.result = false;
            try {
                const { id_alumno } = certificado

                const response = await api.post(`/certificado`, certificado, {
                    responseType: 'blob'
                })

                const { status, data } = response

                if (status === 200) {
                    // Crear una URL temporal para el blob y forzar la descarga
                    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));

                    // Obtener alumno
                    const response = await api.get(`/alumno/${id_alumno}`)

                    const { data: dataAlumno } = response

                    const { data: { nombre_capitalized } } = dataAlumno;

                    const nombreCompleto = nombre_capitalized as string;

                    const sanitizedAlumno = sanitizeFileName(nombreCompleto);

                    const fileName = `certificado_${sanitizedAlumno}.pdf`;

                    const link = document.createElement('a');

                    link.href = url;

                    link.setAttribute('download', fileName);

                    document.body.appendChild(link);

                    link.click();

                    link.remove();

                    // Liberar la URL del blob para ahorrar memoria
                    window.URL.revokeObjectURL(url);

                    this.result = true
                    this.message = 'Certificado generado correctamente'
                } else {
                    this.result = false
                    this.message = 'Error al crear el certificado'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al crear el certificado"
                console.error('Error creating certificado', error)
            }
        },
        async updateCertificado(idCertificado: number, certificado: ICertificado) {
            try {
                const response = await api.patch(`/certificado/${idCertificado}`, certificado, {
                    responseType: 'blob'
                })

                const { status, data } = response

                if (status == 200) {
                    this.result = true

                    this.message = "Certificado actualizado con éxito"

                    this.certificados.push(certificado)

                    const storeAlumno = useAlumnoStore()

                    await storeAlumno.getAlumnoById(certificado.id_alumno as number)

                    const alumno = storeAlumno.alumno as IAlumno | null

                    const nombreCompleto = alumno?.nombre_capitalized as string

                    const sanitizedAlumno = sanitizeFileName(nombreCompleto)

                    const fileName = `certificado_${sanitizedAlumno}.pdf`

                    const url = window.URL.createObjectURL(new Blob([data]))

                    const link = document.createElement('a')

                    link.href = url

                    link.setAttribute('download', fileName)

                    document.body.appendChild(link)

                    link.click()

                    link.remove()
                } else {
                    this.result = false
                    this.message = "Error al actualizar el certificado"
                }
            } catch (error) {
                this.result = false
                this.message = "Error al actualizar el certificado"
                console.error('Error updating certificado: ', error)
            }
        },
        async updateEstado(idCertificado: number, newEstado: boolean) {
            try {
                const response = await api.patch(`/certificado/cambiar-estado/${idCertificado}`, {
                    estado: newEstado
                })

                const { data: dataCertificado } = response

                const { result, message, error } = dataCertificado

                if (result) {
                    this.result = result
                    this.message = message
                    this.fetchCertificados({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false

                this.message = "Error al actualizar el estado"

                console.error('Error updating certificado: ', error)
            }
        },
        async deleteCertificado(idCertificado: number) {
            try {
                const response = await api.delete(`/certificado/${idCertificado}`)

                const { data } = response

                // console.log({ data })

                const { result, message, error } = data

                // console.log({ result })

                // console.log({ message })

                // console.log({ error })

                if (result) {
                    this.result = result

                    this.message = message || "Certificado eliminado correctamente"

                    this.fetchCertificados({
                        page: this.pagination.currentPage,
                        query: this.currentQuery,
                        limit: this.pagination.limit
                    })
                } else {
                    this.message = message || error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false

                this.message = 'Error al eliminar el certificado'

                console.error('Error deleting certificado: ', error)
            }
        },
        async uploadCertificado(file: FormData) {
            this.loading = true
            this.result = false
            this.message = ""

            try {
                const response = await api.post('/certificado-upload', file, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                const { data } = response

                const { result, message } = data

                if (result) {
                    this.result = result
                    this.message = message
                } else {
                    this.message = message || data.error || 'Error desconocido'
                }
            } catch (error) {
                this.result = false
                this.message = "Error al crear el certificado"
                console.error('Error creating certificado', error)
            }
        }
    }
})
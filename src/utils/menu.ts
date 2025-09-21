import {
    HomeIcon,
    DocumentIcon,
    PaperClipIcon,
    UserGroupIcon,
    BookOpenIcon,
    CalendarIcon,
    ClipboardCheckIcon,
    UserAddIcon,
    TableIcon

} from "@heroicons/vue/outline"

export const MENU_ITEMS = [
    // { label: 'Dashboard', icon: HomeIcon, route: '/dashboard', roles: ['administrador'] },
    { label: 'Cargo', icon: HomeIcon, route: '/cargo', roles: ['administrador'] },
    { label: 'Alumno', icon: BookOpenIcon, route: '/alumno', roles: ['administrador'] },
    { label: 'Instructor', icon: UserGroupIcon, route: '/instructor', roles: ['administrador'] },
    { label: 'Trabajador', icon: UserGroupIcon, route: '/trabajador', roles: ['administrador'] },
    { label: 'Tipo de Evento', icon: ClipboardCheckIcon, route: '/tipo-evento', roles: ['administrador'] },
    { label: 'Evento', icon: CalendarIcon, route: '/evento', roles: ['administrador'] },
    { label: 'Certificado', icon: DocumentIcon, route: '/certificado', roles: ['estudiante', 'instructor', 'administrador'] },
    // { label: 'Adjunto', icon: PaperClipIcon, route: '/adjunto', roles: ['administrador'] },
    { label: 'Usuario', icon: UserAddIcon, route: '/usuario', roles: ['administrador'] },
    // { label: 'Reporte', icon: TableIcon, route: '/reporte', roles: ['administrador'] }
]
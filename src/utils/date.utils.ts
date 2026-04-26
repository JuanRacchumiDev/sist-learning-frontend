export const formatDate = (dateParam: string): string => {
    const date = dateParam.split("T")
    const partsDate = date[0]
    const fielsDate = partsDate.split("-")
    const year = fielsDate[0]
    const month = fielsDate[1]
    const day = fielsDate[2]
    return `${day}/${month}/${year}`
}

export const currentDate = (): string => {
    const date = new Date();

    // Usamos Intl para formatear la fecha específicamente para la zona horaria de Perú
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA retorna YYYY-MM-DD
    return formatter.format(date);

    // const today = new Date().toISOString().split('T')[0];
    // return `${today}`
}

export const formatDateForInput = (dateString: string): string => {
    if (!dateString) {
        return ''
    }
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}
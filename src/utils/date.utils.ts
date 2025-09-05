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
    const today = new Date().toISOString().split('T')[0];

    return `${today}`
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
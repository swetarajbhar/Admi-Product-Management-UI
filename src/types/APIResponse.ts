type TAPIResponse = {
    status: number,
    error: string,
    data?: Array<{[key: string]: string | number | undefined | null}>
}

export default TAPIResponse;
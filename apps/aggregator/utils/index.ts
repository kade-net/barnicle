

export function getSequenceNumber(int: number) {
    const str = `000000000${int}`
    return str.slice(-9)
}


export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
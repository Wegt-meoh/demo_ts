export default function deBouncing(func: (...args: any[]) => any, delay: number) {
    let timer: NodeJS.Timeout | null = null
    return function () {
        if (timer !== null) clearTimeout(timer)
        timer = setTimeout(func, delay)
    }
}
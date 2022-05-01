export default function throtting(func: (...args: any[]) => any, delay: number, maxWaitTime: number) {
    let timer: NodeJS.Timeout | null = null
    let startTime = Date.now()
    return function () {
        if (timer !== null) clearTimeout(timer)
        const waitTime = Date.now() - startTime
        if (waitTime >= maxWaitTime) {
            func()
            startTime =Date.now()
        } else {
            timer = setTimeout(func, delay)
        }
    }
}
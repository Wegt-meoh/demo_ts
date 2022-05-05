import { useEffect } from "react"

export default function useResize(func: (...args: any[]) => any): void {
    return useEffect(() => {
        window.addEventListener('resize', func)
        return () => {
            window.removeEventListener('resize', func)
        }
    }, [])
}
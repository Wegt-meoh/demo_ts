import { useEffect } from "react"

export default function useScroll(func: (...args: any[]) => any): void {  
    return useEffect(() => {
        window.addEventListener('scroll', func)
        return () => {
            window.removeEventListener('scroll', func)
        }
    }, [])
}
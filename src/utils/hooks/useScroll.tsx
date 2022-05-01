import { useEffect, useRef } from "react"

export default function useScroll(window: Window, func: (...args: any[]) => any): void {  
    return useEffect(() => {
        window.addEventListener('scroll', func)
        return () => {
            window.removeEventListener('scroll', func)
        }
    }, [])
}
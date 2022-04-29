import { useEffect, useRef } from "react"

export default function useScroll(window: Window, func: (args?: any) => any): void {
    let flag=useRef<boolean>(true)    
    return useEffect(() => {
        window.addEventListener('scroll', func)
        return () => {
            window.removeEventListener('scroll', func)
        }
    }, [])
}
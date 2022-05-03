import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const data: Array<string> = ['sdf', 'sd', 'ttt', 'ff', 'fff']

type HeaderArrayType = Array<{ id: string, isActive: boolean, offsetTop: number }>

export default function Know() {
    const [state, setState] = useState(() => {
        const res: HeaderArrayType = []
        data.forEach((i) => {
            res.push({ id: i, isActive: false, offsetTop: Infinity })
        })
        return res
    })
    const [offsetTopArray, updateOffsetArray] = useState<Array<{ [index: string]: number }>>([])

    const location = useLocation()

    useEffect(() => {
        const hash = location.hash
        const id = hash.slice(1)
        state.forEach((i) => {
            if (i.id === id) {
                i.isActive = true
            } else {
                i.isActive = false
            }
        })
        setState([...state])
    }, [location.hash])

    function throtting(func: (...args: any[]) => any, delay: number, maxWaitTime: number) {
        let startTime = Date.now()
        let timer: NodeJS.Timeout | null = null
        return function () {
            if (timer !== null) clearTimeout(timer)
            const waitTime = Date.now() - startTime
            if (waitTime >= maxWaitTime) {
                func()
                startTime = Date.now()
            } else {
                timer = setTimeout(func, delay)
            }
        }
    }

    function handleScroll() {
        console.log('handle scroll')
        const offsetTop = window.scrollY
        let targetIndex: number = -1
        for (let i = 0; i < state.length; i++) {
            if (state[i].offsetTop <= offsetTop) {
                targetIndex = i
            } else {
                break
            }
        }
        for (let i = 0; i < state.length; i++) {
            state[i].isActive = false
        }
        if (targetIndex === -1) return
        state[targetIndex].isActive = true
        setState([...state])
    }

    useEffect(() => {
        for (let i = 0; i < state.length; i++) {
            const top = document.getElementById(state[i].id)?.offsetTop
            state[i].offsetTop = top === undefined ? Infinity : top
        }
        window.addEventListener('scroll', handleScroll)

        // window.addEventListener('scroll',throtting(handleScroll,500,1000))
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const remover=useMemo(()=>{
        function logOut(){
            console.log('1')
        }
        console.log('add listener')
        window.addEventListener('scroll',logOut)
        return ()=>{
            console.log('remove listener')
            window.removeEventListener('scroll',logOut)
        }
    },[])

    const handleClick = () => {
        console.log('handle click')
        remover()
    }

    return (
        <>
            <div style={{ position: 'fixed', left: '0', top: '0' }}>
                <button onClick={handleClick}>remove</button>
                <ul>
                    {state.map((i) => {
                        return <li key={i.id}><a href={'#' + i.id} style={{ color: i.isActive ? 'red' : '' }}>{i.id}</a></li>
                    })}
                </ul>
            </div>
            <div style={{ position: 'relative', left: '300px' }}>
                {state.map((i) => {
                    return <div key={i.id} id={i.id} style={{ width: '100px', height: '400px' }}>{i.id}</div>
                })}
            </div>
        </>
    )
}

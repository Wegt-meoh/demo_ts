import React, { ReactNode, useEffect, useState } from 'react'

interface DocsfyHeaderLinkProps {
    size: 'h1' | 'h2' | 'h3',
    title: string,
    register: Function,
    state: any,
    children?: ReactNode
}

export function DocsfyHeaderLink({ children, size, title, register, state }: DocsfyHeaderLinkProps) {
    let [headerId, setHeaderId] = useState<string>(title)
    let [hrefHash, setHrefHash] = useState<string>('#' + encodeURI(title))
    let sizeStyle = { h3: 'ReviewForCollegeClass-content-artical-h3', h2: 'ReviewForCollegeClass-content-artical-h2', h1: 'ReviewForCollegeClass-content-artical-h1' }
    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    useEffect(() => {
        if (state[hrefHash] === undefined) {
            register(hrefHash)
        } else {
            let index = 1
            while (state[hrefHash + '-' + index] !== undefined) {
                index++
            }
            setHeaderId(headerId + '-' + index)
            setHrefHash(hrefHash + '-' + index)
            register(hrefHash)
        }
    }, [])
    return (
        <>
            <h1 id={headerId} className={sizeStyle[size]}>
                <a href={hrefHash}>
                    {title}
                </a>
            </h1>
            {children}
        </>
    )
}

interface DocsifyLinkProps {
    state: any
    href: string
    title: string
}

export function DocsifyLink({ state, href, title }: DocsifyLinkProps) {
    return (
        <li className={state[href] ? '.ReviewForCollegeClass-sider-nav-li-active' : ''}>
            <a href="#html">{title}</a>
        </li>
    )
}

export function DocsifyContainer(props: ReactNode) {
    return (
        <div className='ReviewForCollegeClass'>
            <div className='ReviewForCollegeClass-sider'>
                <div className='ReviewForCollegeClass-sider-nav'>

                </div>
            </div>
            <div className='ReviewForCollegeClass-content'>
                <div className="ReviewForCollegeClass-content-artical">
                    {props}
                </div>
            </div>
        </div>
    )
}

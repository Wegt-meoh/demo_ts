import React, { useEffect, useState } from 'react'

interface DocsfyHeaderLinkProps {
    size: 'h1' | 'h2' | 'h3',
    title: string,
    register: Function,
    state: any
}


export function DocsfyHeaderLink({ size, title, register, state }: DocsfyHeaderLinkProps) {
    let [headerId,setHeaderId]=useState<string>(title)
    let [hrefHash,setHrefHash]=useState<string>('#'+encodeURI(title))
    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    useEffect(() => {
        if (state[hrefHash] === undefined) {
            register(hrefHash)
        } else {
            let index = 1
            while (state[hrefHash+ '-' + index] !== undefined) {
                index++
            }
            setHeaderId(headerId+'-'+index)
            setHrefHash(hrefHash+'-'+index)
            register(hrefHash)
        }
    }, [])
    if (size === 'h1') {
        return (
            <h1 id={headerId}>
                <a href={hrefHash}>
                    {title}
                </a>
            </h1>
        )
    } else if (size === 'h2') {
        return (
            <h2 id={headerId}>
                <a href={hrefHash}>
                    {title}
                </a>
            </h2>
        )
    } else {
        return (
            <h3 id={headerId}>
                <a href={hrefHash}>
                    {title}
                </a>
            </h3>
        )
    }
}

interface DocsifyLinkProps {
    state: any
    href: string
    title:string
}

export function DocsifyLink({ state, href ,title}: DocsifyLinkProps) {
    return (
        <li className={state[href]?'.ReviewForCollegeClass-sider-nav-li-active':''}>
            <a href="#html">{title}</a>
        </li>
    )
}

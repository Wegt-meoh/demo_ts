import React, { useEffect, useState } from 'react'

interface DocsfyHeaderLinkProps {
    size: 'h1' | 'h2' | 'h3',
    children: string,
    register: Function,
    state: any
}


export function DocsfyHeaderLink({ size, children, register, state }: DocsfyHeaderLinkProps) {
    let [headerId,setHeaderId]=useState<string>(children)
    let [hrefHash,setHrefHash]=useState<string>('#'+encodeURI(children))
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
    }, [children])
    if (size === 'h1') {
        return (
            <h1 id={headerId}>
                <a href={hrefHash}>
                    {children}
                </a>
            </h1>
        )
    } else if (size === 'h2') {
        return (
            <h2 id={headerId}>
                <a href={hrefHash}>
                    {children}
                </a>
            </h2>
        )
    } else {
        return (
            <h3 id={headerId}>
                <a href={hrefHash}>
                    {children}
                </a>
            </h3>
        )
    }
}

interface DocsifyLinkProps {
    className: string
    children: string | undefined
}

export function DocsifyLink({ className, children }: DocsifyLinkProps) {
    return (
        <li className={className}>
            <a href="#html">{children}</a>
        </li>
    )
}

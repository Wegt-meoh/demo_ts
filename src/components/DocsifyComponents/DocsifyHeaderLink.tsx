import { useEffect, useState } from "react"
import { HeaderProps } from "./Header"

interface DocsifyHeaderLinkProps extends HeaderProps {
    headerId: string
    href: string
}

const sizeStyle = { h3: 'Docsify-content-artical-h3', h2: 'Docsify-content-artical-h2', h1: 'Docsify-content-artical-h1' }

export default function DocsifyHeaderLink(props: DocsifyHeaderLinkProps) {
    const {
        size = 'h1',
        title,
        headerId,
        children,
        href
    } = props



    return (
        <>
            <h1 id={headerId} className={sizeStyle[size]}>
                <a href={href}>
                    {title}
                </a>
            </h1>
            {children}
        </>
    )
}
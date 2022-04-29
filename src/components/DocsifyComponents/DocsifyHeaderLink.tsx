import { useEffect, useState } from "react"
import { HeaderProps } from "./Header"

interface DocsifyHeaderLinkProps extends HeaderProps {
    register: (x: string) => boolean
}

export default function DocsifyHeaderLink(props: DocsifyHeaderLinkProps) {

    const {
        size = 'h1',
        title,
        children,
        register,
    } = props

    const [headerId, setHeaderId] = useState<string>(title)
    const [hrefHash, setHrefHash] = useState<string>('#?id=' + encodeURI(title))
    const sizeStyle = { h3: 'Docsify-content-artical-h3', h2: 'Docsify-content-artical-h2', h1: 'Docsify-content-artical-h1' }

    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    // register href here
    useEffect(() => {
        if (register(encodeURI(headerId)) === false) {
            let index = 1
            while (register(encodeURI(headerId + '-' + index)) === false) index++
            //then you need rerender the component
            setHeaderId(headerId + '-' + index)
            setHrefHash('#?id=' + encodeURI(headerId + '-' + index))
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
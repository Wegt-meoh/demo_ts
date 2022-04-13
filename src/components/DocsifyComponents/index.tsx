import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'


type Key = string | number

interface DocsifyHeaderLinkProps extends Header {
    size: 'h1' | 'h2' | 'h3',
    register: Function,
    state: any,
    key?: Key
    children?: DocsifyElement | (DocsifyElement | undefined)[]
}

export function DocsfyHeaderLink({ children, size, title, register, state }: DocsifyHeaderLinkProps) {
    let [headerId, setHeaderId] = useState<string>(title)
    let [hrefHash, setHrefHash] = useState<string>('#' + encodeURI(title))
    let sizeStyle = { h3: 'ReviewForCollegeClass-content-artical-h3', h2: 'ReviewForCollegeClass-content-artical-h2', h1: 'ReviewForCollegeClass-content-artical-h1' }
    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    useEffect(() => {
        if (state[hrefHash] !== undefined) {
            //handle repeative name here
            let index = 1
            while (state[hrefHash + '-' + index] !== undefined) {
                index++
            }
            //then you need rerender the component
            setHeaderId(headerId + '-' + index)
            setHrefHash(hrefHash + '-' + index)
        }
        register(hrefHash)
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

interface Header {
    title: string
    children?: any
}

interface CodeProps {
    key?: Key
    children?: string
}

export function H1(props: Header) {
    return (<></>)
}
export function H2(props: Header) {
    return (<></>)
}
export function H3(props: Header) {
    return (<></>)
}

export function Code(props: CodeProps) {
    return <p>{props.children}</p>
}

interface CheckHashHref {
    [index: string]: boolean
}
interface DocsifyElement extends Omit<JSX.Element, 'type' | 'props'> {
    type: Function
    // props: { title: string, key?: Key, children?: DocsifyElement | (DocsifyElement | undefined)[] }
    props: DocsifyHeaderLinkProps & CodeProps
}




interface DocsifyContainerProps {
    children: DocsifyElement
}

export function DocsifyContainer({ children }: DocsifyContainerProps) {
    let [state, setState] = useState<CheckHashHref>({})
    let [artical, setArtical] = useState<DocsifyElement | undefined>(<h1>init date</h1>)
    let hashId = useLocation()




    //used for unique key in function getArticalElements
    let keyCount: number = 0

    //this function allow H1,H2... p,string type for children(param) 
    //but any other type will be seemed as <></>
    function getArticalElements(children: DocsifyElement | undefined): DocsifyElement | undefined {
        if (children === undefined) {
            return undefined
        } else {
            if (children.type === undefined) {
                return undefined
            } else {
                let t
                if (Array.isArray(children.props.children)) {
                    t = []
                    for (let i in children.props.children) {
                        let p = getArticalElements(children.props.children[i])
                        if (p !== undefined) {
                            t.push(p)
                        }

                    }
                } else {
                    if(typeof children.props.children==='string'){
                        t=children.props.children
                    }else{
                        t = getArticalElements(children.props.children)
                    }                    
                }
                switch (children.type) {
                    case H3:
                        return <DocsfyHeaderLink size={'h3'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={children.props.title}
                            children={t} />
                    case H2:
                        return <DocsfyHeaderLink size={'h2'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={children.props.title}
                            children={t} />
                    case H1:
                        return <DocsfyHeaderLink size={'h1'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={children.props.title}
                            children={t} />
                    case Code:
                        console.log(t)
                        return <Code key={keyCount++} children={t as unknown as string} />
                    case React.Fragment:
                        return <>{t}</>
                    default:
                        return undefined
                }
            }
        }
    }

    //init artical part
    useEffect(() => {
        let t: DocsifyElement | undefined|string = getArticalElements(children)
        setArtical(t)
    }, [])

    useEffect(() => {
        console.log('artical', artical)
    }, [artical])


    let registerLinkState = (linkHash: string) => {
        //you need to ensure the linkHash(param) is not repeative in state
        state[linkHash] = false
    }

    useEffect(() => {
        function linkHighlight(hash: string) {
            if (state[hash] === undefined) return
            let newState = { ...state }
            for (let i in newState) {
                if (i !== hash) {
                    newState[i] = false
                } else {
                    newState[i] = true
                }
            }
            setState({ ...newState })
        }
        linkHighlight(hashId.hash)
    }, [hashId.hash])


    return (
        <div className='ReviewForCollegeClass'>
            <div className='ReviewForCollegeClass-sider'>
                <div className='ReviewForCollegeClass-sider-nav'>
                    <ul>
                        <DocsifyLink
                            title='html'
                            href='#html'
                            state={state} />
                        <ul>
                            <li className={state[encodeURI('#a标签')] ? 'ReviewForCollegeClass-sider-nav-li-active' : ''}>
                                <a href="#a标签">a标签</a>
                            </li>
                            <li className={state[encodeURI('#h1标签')] ? 'ReviewForCollegeClass-sider-nav-li-active' : ''}>
                                <a href="#h1标签">h1标签</a>
                            </li>
                        </ul>
                        <li>
                            <a href="#css">css</a>
                        </li>
                        <ul>
                            <li><a href="">width</a></li>
                            <li><a href="">scoll bar</a></li>
                        </ul>
                        <li>
                            <a href="">typescript</a>
                        </li>
                        <ul>
                            <li><a href="">type</a></li>
                            <li><a href="">interface</a></li>
                        </ul>
                    </ul>
                </div>
            </div>
            <div className='ReviewForCollegeClass-content'>
                <div className="ReviewForCollegeClass-content-artical">
                    {artical}
                </div>
            </div>
        </div>
    )
}

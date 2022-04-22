import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './index.css'


type Key = string | number


interface HeaderProps {
    title: string
    children?: DocsifyContainerElement | string | (DocsifyContainerElement | string)[]
}

type HeaderConstructor = (props: HeaderProps) => JSX.Element

export function H1(props: HeaderProps) {
    return (<></>)
}
export function H2(props: HeaderProps) {
    return (<></>)
}
export function H3(props: HeaderProps) {
    return (<></>)
}

interface CodeProps {
    children?: string
}

type CodeConstructor = (props: CodeProps) => JSX.Element

export function Code({ children }: CodeProps) {
    let res: string[] = []
    //format code string here
    if (children !== undefined) {
        let line = ''
        for (let i = 0; i < children.length; i++) {
            if (children[i] === '&') {
                res.push(line)
                line = ''
            } else if (children[i] === '@') {
                line += ' '
            } else {
                line += children[i]
            }
        }
        if (line.length !== 0) res.push(line)
    }


    return (
        <p>
            {
                res.map((i, index) => {
                    // console.log(i)
                    return <React.Fragment key={index}>{i}<br /></React.Fragment>
                })
            }
        </p>
    )
}

interface DocsifyHeaderLinkProps extends HeaderProps {
    size: 'h1' | 'h2' | 'h3'
    register: Function
    state: CheckHashHref
}

type DocsifyHeaderLink = (props: DocsifyHeaderLinkProps) => JSX.Element

function DocsifyHeaderLink({ children, size, title, register, state }: DocsifyHeaderLinkProps) {
    let [headerId, setHeaderId] = useState<string>(title)
    let [hrefHash, setHrefHash] = useState<string>('#' + encodeURI(title))
    let sizeStyle = { h3: 'Docsify-content-artical-h3', h2: 'Docsify-content-artical-h2', h1: 'Docsify-content-artical-h1' }

    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    // register href here
    useEffect(() => {
        if (state[hrefHash] !== undefined) {
            //handle repeative name here
            let index = 1
            while (state[hrefHash + '-' + index] !== undefined) {
                index++
            }
            hrefHash = hrefHash + '-' + index
            headerId = headerId + '-' + index
            //then you need rerender the component
            setHeaderId(headerId)
            setHrefHash(hrefHash)

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


interface DocsifyNavLinkProps {
    // state?: CheckHashHref
    isActive?: boolean
    href: string  // 指向某一个锚点的地址
    title: string // 展示给用户的内容
}

type DocsifyNavLinkConstructor = (props: DocsifyNavLinkProps) => JSX.Element

function DocsifyNavLink({ isActive, href, title }: DocsifyNavLinkProps) {
    if (isActive === undefined) isActive = false
    return (
        <li className={isActive ? 'Docsify-sider-nav-li-active' : ''}>
            <a href={href}>{title}</a>
        </li>
    )
}

interface DocsifyNavFrameProps {
    hidden: boolean
    children?: DocsifyNavElement | DocsifyNavElement[]
}

type DocsifyNavFrameConstructor = (props: DocsifyNavFrameProps) => JSX.Element

function DocsifyNavFrame({ children, hidden }: DocsifyNavFrameProps) {
    return <ul hidden={hidden}>{children}</ul>
}

interface DocsifyNavElement {
    type: DocsifyNavLinkConstructor | DocsifyNavFrameConstructor
    props: DocsifyNavFrameProps | DocsifyNavLinkProps
}

interface CheckHashHref {
    [index: string]: { isFoucus: boolean, haveGotten: boolean }
}

interface DocsifyContainerElement {
    type: HeaderConstructor | CodeConstructor
    props: CodeProps | HeaderProps
}

interface DocsifyContainerProps {
    children: DocsifyContainerElement
}

/**
 * notice its children should be H1, H2, H3, Code or <></> and other Component will be seemed as <div/>
 * 
 */
export function DocsifyContainer({ children }: DocsifyContainerProps) {
    let [state, setState] = useState<CheckHashHref>({})
    let [artical, setArtical] = useState<DocsifyContainerElement | undefined>()
    let [navBar, setNavBar] = useState<DocsifyNavElement | undefined>()
    let [browserWidth, setBrowserWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
    let [close, SetClose] = useState(false)
    const hashId = useLocation()



    //used for unique key to avoid warning
    let keyCount = 0



    //init artical part after did mount
    useEffect(() => {
        //NOTE: Any other type will return undefined and     
        //not to handle it children, details see following code
        function getArticalElements(content?: DocsifyContainerElement): DocsifyContainerElement | undefined {
            if (content === undefined) {
                return undefined
            } else {
                //这里递归处理children.props.children,并把返回值传给变量t
                //NOTE: children.props.children 不一定是DocsifyElement
                let t: string | (string | DocsifyContainerElement)[] | DocsifyContainerElement | undefined
                let props = content.props
                if (Array.isArray(props.children)) {
                    t = []
                    props.children.forEach((i) => {
                        t = t as (string | DocsifyContainerElement)[]
                        let p: string | DocsifyContainerElement | undefined
                        if (typeof i === 'string') {
                            p = i
                        } else {
                            p = getArticalElements(i)
                        }
                        if (p !== undefined) {
                            t.push(p)
                        }
                    })
                    if (t.length === 0) {
                        t = undefined
                    } else if (t.length === 1) {
                        t = t[0]
                    }
                } else {
                    if (typeof props.children === 'string') {
                        t = props.children
                    } else {
                        t = getArticalElements(props.children)
                    }
                }

                //这里定义如何处理输入的组件
                switch (content.type) {
                    case H3:
                        props = props as HeaderProps
                        return <DocsifyHeaderLink size={'h3'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={props.title}
                            children={t} />
                    case H2:
                        props = props as HeaderProps
                        return <DocsifyHeaderLink size={'h2'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={props.title}
                            children={t} />
                    case H1:
                        props = props as HeaderProps
                        return <DocsifyHeaderLink size={'h1'}
                            register={registerLinkState}
                            state={state}
                            key={keyCount++}
                            title={props.title}
                            children={t} />
                    case Code:
                        props = props as CodeProps
                        return <Code key={keyCount++} children={t as string} />
                    case React.Fragment:
                        return <React.Fragment key={keyCount++}>
                            {t}
                        </React.Fragment>
                    default:
                        return (
                            <div key={keyCount++}>
                                {t}
                            </div>
                        )
                }

            }
        }
        setArtical(getArticalElements(children))
    }, [])

    //init nav part after artical changed and update link highlight
    useEffect(() => {
        function getNavElement(floor: number, content?: DocsifyContainerElement): DocsifyNavElement | undefined {
            if (floor > 5) return undefined
            if (content === undefined) {
                return undefined
            } else {
                let t: DocsifyNavElement | DocsifyNavElement[] | undefined
                let props = content.props
                if (Array.isArray(props.children)) {
                    t = []
                    props.children.forEach((i) => {
                        t = t as DocsifyNavElement[]
                        if (typeof i !== 'string') {
                            let p
                            if (content.type === H1 || content.type === H2 || content.type === H3) {
                                p = getNavElement(floor + 1, i)
                            } else {
                                p = getNavElement(floor, i)
                            }

                            if (p !== undefined) {
                                t.push(p)
                            }
                        }
                    })
                    if (t.length === 0) {
                        t = undefined
                    } else if (t.length === 1) {
                        t = t[0]
                    }
                } else if (typeof props.children === 'string') {
                    t = undefined
                } else {
                    if (content.type === H1 || content.type === H2 || content.type === H3) {
                        t = getNavElement(floor + 1, props.children)
                    } else {
                        t = getNavElement(floor, props.children)
                    }
                }

                switch (content.type) {
                    case H3:
                    case H2:
                    case H1:

                        //according to title calculate the value of _href from state
                        props = props as HeaderProps
                        let title = props.title
                        let isActive = false
                        let _index = 1, _href = '#' + encodeURI(title)
                        if (state[_href] === undefined) {
                            // console.log('@@state[_href]===undefined')
                            _href = '#'
                        } else if (state[_href].haveGotten === true) {
                            //handle same href here
                            while (state[_href + '-' + _index] !== undefined && state[_href + '-' + _index].haveGotten === true) {
                                _index++
                            }
                            if (state[_href + '-' + _index] === undefined) {
                                // console.log('@@state[_href+-+_index]===undefined')
                                _href = '#'
                            } else {
                                // console.log('@@successful')
                                _href = _href + '-' + _index
                                state[_href].haveGotten = true
                                isActive = state[_href].isFoucus
                            }
                        } else {
                            // console.log('@@state[_href] first meet')
                            state[_href].haveGotten = true
                            isActive = state[_href].isFoucus
                        }
                        //according to is having children return different components
                        if (t === undefined) {
                            return (
                                <DocsifyNavLink isActive={isActive} key={keyCount++} href={_href} title={floor % 2 === 0 ? '- ' + title : title} />
                            )
                        } else {
                            return (
                                <React.Fragment key={keyCount++}>
                                    <DocsifyNavLink isActive={isActive} href={_href} title={floor % 2 === 0 ? '- ' + title : title} />
                                    <DocsifyNavFrame hidden={false}>{t}</DocsifyNavFrame>
                                </React.Fragment>
                            )
                        }

                    case React.Fragment:
                        return (
                            <React.Fragment key={keyCount++}>
                                {t}
                            </React.Fragment>
                        )
                    default:
                        return undefined

                }
            }
        }

        Object.getOwnPropertyNames(state).forEach((i) => {
            state[i].haveGotten = false
        })

        setNavBar(getNavElement(1, children))
    }, [artical, state])


    useEffect(() => {
        function update(content?: DocsifyNavElement): DocsifyNavElement | undefined {
            if (content === undefined) {
                return undefined
            } else {
                let t


                switch (content.type) {
                    case DocsifyNavFrame:
                        break
                    case DocsifyNavLink:
                        break
                    case React.Fragment:

                        break
                    default:
                        return undefined
                }
            }
        }
        if (navBar !== undefined) {
            // console.log('@@navBar=', navBar)
            // update(navBar)
        }
    }, [state])

    let registerLinkState = (linkHash: string) => {
        //you need to ensure the linkHash(param) is not repeative in state
        let t = { isFoucus: false, haveGotten: false }
        state[linkHash] = t
    }

    //处理导航栏link高亮，当地址栏的hash改变
    useEffect(() => {
        function linkHighlight(hash: string) {
            if (state[hash] === undefined) return
            let newState = { ...state }
            for (let i in newState) {
                if (i !== hash) {
                    newState[i].isFoucus = false
                } else {
                    newState[i].isFoucus = true
                }
            }
            setState({ ...newState })
        }
        // console.log('@@link high light ', hashId.hash, state)
        linkHighlight(hashId.hash)
    }, [hashId.hash])

    window.addEventListener('resize', function () {
        let newBrowserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (newBrowserWidth - browserWidth > 0) {
            if (newBrowserWidth > 700 && browserWidth < 700) {
                SetClose(false)
            }
        } else {
            if (newBrowserWidth < 700 && browserWidth >= 700) {
                SetClose(true)
            }
        }
        setBrowserWidth(newBrowserWidth)
    })

    function handleClose() {
        SetClose(!close)
    }

    return (
        <div className='Docsify'>
            <button onClick={handleClose}
                className={close ? 'Docsify-sider-toggle Docsify-sider-toggle-close' : 'Docsify-sider-toggle'}>
                <div>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <div
                className={close ? 'Docsify-sider Docsify-sider-close' : 'Docsify-sider'}>
                <div className='Docsify-sider-nav'>
                    <ul>{navBar}</ul>
                </div>
            </div>
            <div className={close ? 'Docsify-content Docsify-content-close' : 'Docsify-content'}>
                <div className="Docsify-content-artical">
                    {artical}
                </div>
            </div>
        </div>
    )
}

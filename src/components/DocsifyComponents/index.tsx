import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './index.css'


type Key = string | number


interface HeaderProps {
    title: string
    children?: DocsifyContainerElement | string | (DocsifyContainerElement | string)[]
}

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

export function Code({ children }: CodeProps) {
    let res:string[]=[]
    //format code string here
    if(children!==undefined){        
        let line=''
        for(let i=0;i<children.length;i++){
            if(children[i]==='&'){
                res.push(line)
                line=''                
            }else if(children[i]==='@'){
                line+=' '
            }else{                
                line+=children[i]
            }
        }
        if(line.length!==0) res.push(line)
    }

    
    return (
        <p>
            {
                res.map((i,index)=>{
                    console.log(i)
                    return <React.Fragment key={index}>{i}<br/></React.Fragment>
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

export function DocsifyHeaderLink({ children, size, title, register, state }: DocsifyHeaderLinkProps) {
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
    isActive?:boolean
    href: string  // 指向某一个锚点的地址
    title: string // 展示给用户的内容
}

export function DocsifyNavLink({ isActive, href, title }: DocsifyNavLinkProps) {
    if(isActive===undefined) isActive=false  
    return (
        <li className={isActive ? 'Docsify-sider-nav-li-active' : ''}>
            <a href={href}>{title}</a>
        </li>
    )
}


interface DocsifyNavFrameProps {
    children?: DocsifyNavElement | DocsifyNavElement[]
}

export function DocsifyNavFrame({ children }: DocsifyNavFrameProps) {
    return <ul>{children}</ul>
}

//the type of function getNavElements return
interface DocsifyNavElement {
    type: (props: DocsifyNavFrameProps & DocsifyNavLinkProps) => JSX.Element
    props: DocsifyNavFrameProps | DocsifyNavLinkProps
}

interface CheckHashHref {
    [index: string]: { isFoucus: boolean, haveGotten: boolean }
}

//DocsifyContainer子元素的类型
interface DocsifyContainerElement {
    type: (props: CodeProps & HeaderProps) => JSX.Element
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
    let hashId = useLocation()

    //used for unique key to avoid warning
    let keyCount = 0



    //init artical part after did mount
    useEffect(() => {
        //NOTE: Any other type will return undefined and     
        //not to handle it children, details see following code
        function getArticalElements(children?: DocsifyContainerElement): DocsifyContainerElement | undefined {
            if (children === undefined) {
                return undefined
            } else {
                if (children.type === undefined) {
                    return undefined
                } else {
                    //这里递归处理children.props.children,并把返回值传给变量t
                    //NOTE: children.props.children 不一定是DocsifyElement
                    let t: string | (string | DocsifyContainerElement)[] | DocsifyContainerElement | undefined
                    let props = children.props
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
                    switch (children.type) {
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

                        default:
                            //other element will be ignored
                            return (
                                <div key={keyCount++}>
                                    {t}
                                </div>
                            )
                    }
                }
            }
        }
        setArtical(getArticalElements(children))
    }, [])


    //init nav part after artical changed
    useEffect(() => {
        function getNavElement(children?: DocsifyContainerElement): DocsifyNavElement | undefined {
            // return { type: DocsifyNavFrame, props: {children:<DocsifyNavFrame/>,ti`tle:'ds'} }
            if (children === undefined) {
                return undefined
            } else {
                if (children.type === undefined) {
                    return undefined
                } else {
                    let t: DocsifyNavElement | DocsifyNavElement[] | undefined
                    let props = children.props
                    if (Array.isArray(props.children)) {
                        t = []
                        props.children.forEach((i) => {
                            t = t as DocsifyNavElement[]
                            if (typeof i !== 'string') {
                                let p = getNavElement(i)
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
                        t = getNavElement(props.children)
                    }

                    switch (children.type) {
                        case H3:
                        case H2:
                        case H1:

                            //according to title calculate the value of _href from state
                            props = props as HeaderProps
                            let title = props.title
                            let isActive=false
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
                                    isActive=state[_href].isFoucus
                                }
                            } else {
                                // console.log('@@state[_href] first meet')
                                state[_href].haveGotten = true
                                isActive=state[_href].isFoucus
                            }
                            //according to is having children return different components
                            if (t === undefined) {
                                return (
                                    <DocsifyNavLink isActive={isActive} key={keyCount++} href={_href} title={title} />
                                )
                            } else {
                                return (
                                    <React.Fragment key={keyCount++}>
                                        <DocsifyNavLink isActive={isActive} href={_href} title={title} />
                                        <DocsifyNavFrame>{t}</DocsifyNavFrame>
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
        }

        Object.getOwnPropertyNames(state).forEach((i)=>{
            state[i].haveGotten=false
        })

        setNavBar(getNavElement(children))
    }, [artical,state])

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



    return (
        <div className='Docsify'>
            <div className='Docsify-sider'>
                <div className='Docsify-sider-nav'>
                    <ul>{navBar}</ul>
                </div>
            </div>
            <div className='Docsify-content'>
                <div className="Docsify-content-artical">
                    {artical}
                </div>
            </div>
        </div>
    )
}

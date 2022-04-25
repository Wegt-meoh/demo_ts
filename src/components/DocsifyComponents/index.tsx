import React, { HtmlHTMLAttributes, useEffect, useState } from 'react'
import { MouseEventHandler } from 'react'
import { useLocation } from 'react-router-dom'
import './index.css'

type HeaderSize = 'h1' | 'h2' | 'h3'

interface HeaderProps {
    size?: HeaderSize
    title: string
    children?: React.ReactChild | null | React.ReactChild[]
}

export function Header(props: HeaderProps) {
    return null
}

interface CodeProps {
    children: string
}

export function Code({ children }: CodeProps) {
    let res: string[] = []
    //format code string here
    if (children !== undefined) {
        // console.log('1@', children)
        children = children.replace(/&[ ]*/g, '\n')
        // console.log('2@',res)       
        // res=res.map((i)=>{
        //     return i.replace(/-/g,'\u00A0')
        // })
        // console.log('3@',res)
    }

    return (
        <p>
            {children}
        </p>
    )
}

interface DocsifyHeaderLinkProps extends HeaderProps {
    register: (x: string) => boolean
}

function DocsifyHeaderLink(props: DocsifyHeaderLinkProps) {

    const {
        size,
        title,
        children,
        register,
    } = props

    const [headerId, setHeaderId] = useState<string>(title)
    const [hrefHash, setHrefHash] = useState<string>('#' + encodeURI(title))
    const sizeStyle = { h3: 'Docsify-content-artical-h3', h2: 'Docsify-content-artical-h2', h1: 'Docsify-content-artical-h1' }

    // By default, effects run after every completed render,
    // but you can choose to fire them only when certain values have changed.
    // If you want to run an effect and clean it up only once (on mount and unmount),
    // you can pass an empty array ([]) as a second argument.
    // register href here
    useEffect(() => {
        if (register(hrefHash) !== true) {
            let index = 1
            while (register(hrefHash + '-' + index) === false) index++
            //then you need rerender the component
            setHeaderId(headerId + '-' + index)
            setHrefHash(hrefHash + '-' + index)
        }
    }, [])
    return (
        <>
            <h1 id={headerId} className={sizeStyle[size || 'h1']}>
                <a href={hrefHash}>
                    {title}
                </a>
            </h1>
            {children}
        </>
    )
}


interface DocsifyNavLinkProps {
    isActive: boolean
    href: string  // 指向某一个锚点的地址
    title: string // 展示给用户的内容
}

function DocsifyNavLink(props: DocsifyNavLinkProps) {
    const {
        isActive,
        href,
        title
    } = props

    return (
        <li className={isActive ? 'Docsify-sider-nav-li-active' : ''}>
            <a href={href}>{title}</a>
        </li>
    )
}

interface DocsifyNavFrameProps {
    hidden: boolean
    children: React.ReactElement | React.ReactElement[]
}

function DocsifyNavFrame({ children, hidden }: DocsifyNavFrameProps) {
    return <ul hidden={hidden}>{children}</ul>
}

interface CheckHashHref {
    [index: string]: { isFoucus: boolean, haveGotten: boolean }
}

interface DocsifyContainerProps {
    minContentWidth?: number
    children: React.ReactChild
    direction?: 'left' | 'right'
    navPosition?: 'left' | 'right'
}

interface NavToggleButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>,
    close: boolean
    style?: React.CSSProperties
}

function NavToggleButton(props: NavToggleButtonProps) {
    const {
        onClick,
        close,
        ...res
    } = props

    return (
        <button
            onClick={onClick}
            className={close ? 'Docsify-sider-toggle Docsify-sider-toggle-close' : 'Docsify-sider-toggle'}
            {...res}
        >
            <div>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    )
}

/**
 * notice its children should be H1, H2, H3, Code or <></> and other Component will be seemed as <div/>
 * 
 */
export function DocsifyContainer(props: DocsifyContainerProps) {
    const {
        minContentWidth = 800,
        children,
        direction = 'left',
        navPosition = 'left'
    } = props



    const [state, setState] = useState<CheckHashHref>({})
    const [artical, setArtical] = useState<React.ReactChild>(<>loading...</>)
    const [navBar, setNavBar] = useState<React.ReactElement | null>(<>loading...</>)
    const [browserWidth, setBrowserWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
    const [close, SetClose] = useState(false)
    const location = useLocation()



    //init artical part after did mount
    useEffect(() => {
        //NOTE: Any other type will return undefined and     
        //not to handle it children, details see following code
        function getArticalElements(content: React.ReactChild): React.ReactChild {
            if (typeof content === 'string' || typeof content === 'number') {
                return content
            }

            //这里递归处理content.props.children
            const children = content.props.children
            const kids = React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return getArticalElements(child)
                } else {
                    return child
                }
            })

            //这里定义如何处理输入的组件
            switch (content.type) {
                case Header:
                    return (
                        <DocsifyHeaderLink
                            size={content.props.size}
                            register={registerLinkState}
                            title={content.props.title}
                            children={kids} />
                    )
                case Code:
                    return (
                        <Code children={kids[0]} />
                    )
                default:
                    return (
                        React.createElement(
                            typeof children.type === 'string' ? children.type : 'div',
                            {},
                            kids
                        )
                    )
            }

        }
        setArtical(getArticalElements(children))
    }, [])

    //init nav part after artical changed and update link highlight
    useEffect(() => {
        function getNavElement(floor: number, content: React.ReactChild): React.ReactElement | null {
            if (floor > 5) return null
            if (typeof content === 'string' || typeof content === 'number') return null
            const type = content.type
            const children = content.props.children
            const kids = React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === Header) {
                    return getNavElement(floor + 1, child)
                }
            })
            switch (type) {
                case Header:
                    //according to title calculate the value of _href from state
                    const title = content.props.title
                    let isActive = false
                    let _index = 1, _href = '#' + encodeURI(title)
                    if (state[_href] === undefined) {
                        _href = '#'
                    } else if (state[_href].haveGotten === false) {
                        // console.log('@@state[_href] first meet')
                        state[_href].haveGotten = true
                        isActive = state[_href].isFoucus
                    } else {
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
                    }
                    //according to is having children return different components
                    if (kids === undefined || kids === null) {
                        return (
                            <DocsifyNavLink
                                isActive={isActive}
                                href={_href}
                                title={floor % 2 === 0 ? '- ' + title : title} />
                        )
                    } else {
                        return (
                            <React.Fragment>
                                <DocsifyNavLink
                                    isActive={isActive}
                                    href={_href}
                                    title={floor % 2 === 0 ? '- ' + title : title}
                                />
                                <DocsifyNavFrame
                                    hidden={false}
                                    children={kids}
                                />
                            </React.Fragment>
                        )
                    }
                default:
                    return (
                        React.createElement(
                            typeof type === 'string' ? content.type : 'div',
                            {},
                            kids
                        )
                    )

            }
        }

        Object.getOwnPropertyNames(state).forEach((i) => {
            state[i].haveGotten = false
        })

        setNavBar(getNavElement(1, children))
    }, [artical, state])

    //do not setState here
    const registerLinkState = (linkHash: string) => {
        if (state[linkHash] === undefined) {
            let t = { isFoucus: false, haveGotten: false }
            state[linkHash] = t
            return true
        }
        return false
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
        linkHighlight(location.hash)
    }, [location.hash])

    window.addEventListener('resize', function () {
        let newBrowserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (newBrowserWidth - browserWidth > 0) {
            if (newBrowserWidth > minContentWidth && browserWidth < minContentWidth) {
                SetClose(false)
            }
        } else {
            if (newBrowserWidth < minContentWidth && browserWidth >= minContentWidth) {
                SetClose(true)
            }
        }
        setBrowserWidth(newBrowserWidth)
    })

    const handleClose = () => {
        SetClose(!close)
    }

    return (
        <div className='Docsify'>
            <NavToggleButton onClick={handleClose} close={close} />

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

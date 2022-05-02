import { configConsumerProps } from 'antd/lib/config-provider'
import { resolve } from 'node:path/win32'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'


import deBouncing from '../../utils/deBoucing'
import useResize from '../../utils/hooks/useResize'
import useScroll from '../../utils/hooks/useScroll'
import throtting from '../../utils/throtting'
import Code from './Code'
import DocsifyHeaderLink from './DocsifyHeaderLink'
import DocsifyNavFrame from './DocsifyNavFrame'
import DocsifyNavLink from './DocsifyNavLink'
import { Header } from './Header'
import './index.css'
import NavToggleButton from './NavToggleButton'



interface HeaderStateType {
    //for example:
    //headerId:{true,false}
    [index: string]: { isFoucus: boolean, haveUsed: boolean }
}

interface DocsifyContainerProps {
    minContentWidth?: number
    children: React.ReactChild
    direction?: 'left' | 'right'
    navPosition?: 'left' | 'right'
    subMaxLevel?: 1 | 2 | 3 | 4
    wrap?: boolean
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
        navPosition = 'left',
        wrap = false,
        subMaxLevel: maxShownNavChildren = 3
    } = props


    const location = useLocation()
    const [headerState, setHeaderState] = useState<HeaderStateType>({})
    const [articalPart, setArticalPart] = useState<React.ReactChild>()
    const [navBarPart, setNavBarPart] = useState<React.ReactElement | null>()
    const browserWidth = useRef(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
    const [navCloseState, setNavCloseState] = useState(false)
    const navLinkGroup = useRef<Array<HTMLAnchorElement>>(null)    



    //Do not setState here,header id is not encoded    
    function tryToRegisterHeaderId(headerId: string) {
        if (headerState[headerId] === undefined) {
            let t = { isFoucus: false, haveUsed: false }
            headerState[headerId] = t
            return true
        }
        return false
    }

    function smoothScrollY(window: Window, begin: number, end: number, during: number) {
        const times: number = 10
        const step: number = (end - begin) / times
        let counter: number = 0
        const interval = during / times
        const timerOut = () => {
            setTimeout(() => {
                console.log('time out excute')
                counter++
                window.scrollTo(0, begin + counter * step)
                if (counter <= times) {
                    timerOut()
                }
            }, interval)
        }
        timerOut()
    }

    function updateHeaderStateByUrlHash() {
        const hashParamPair = getHashParamPair(location.hash)
        const headerId: string | undefined = hashParamPair['id']

        if (headerState[headerId] === undefined || headerState[headerId].isFoucus === true) return
        let newHeaderState = { ...headerState }
        Object.getOwnPropertyNames(newHeaderState).forEach((i) => {
            newHeaderState[i].isFoucus = false
        })
        newHeaderState[headerId].isFoucus = true
        setHeaderState(newHeaderState)
    }

    function handleResize() {
        let newBrowserWidth = window.innerWidth || window.document.documentElement.clientWidth || window.document.body.clientWidth;
        if (newBrowserWidth - browserWidth.current > 0) {
            if (newBrowserWidth > minContentWidth && browserWidth.current < minContentWidth) {
                setNavCloseState(false)
            }
        } else {
            if (newBrowserWidth < minContentWidth && browserWidth.current >= minContentWidth) {
                setNavCloseState(true)
            }
        }
        browserWidth.current = newBrowserWidth
    }

    function getHashParamPair(hash: string): { [index: string]: string } {
        if (hash.indexOf('?') === -1) return {}
        const hashParamGroup = hash.slice(hash.indexOf('?') + 1).split('&')
        const result: { [index: string]: string } = {}

        hashParamGroup.forEach((item) => {
            if (item.indexOf('=') === -1) return
            const pair = item.split('=')
            const _name = pair[0], _value = pair[1]
            result[_name] = decodeURI(_value)
        })

        return result
    }

    function switchNavCloseState() {
        setNavCloseState(!navCloseState)
    }

    function scrollToSpecificHeader(id: string) {
        console.log('f scrollToSpecificHeader')
        const headerElement=document.getElementById(id)
        if(headerElement!=null){            
            const paddingTop = headerElement.parentElement?.offsetTop
            const headerOffsetTop = headerElement.offsetTop + (paddingTop===undefined?0:paddingTop)
            window.scrollTo(0, headerOffsetTop)
        }else{
            console.log('header element is null')
        }        
    }

    function handleDuplicateHeaderId(title: string): string {
        let headerId: string = title
        if (tryToRegisterHeaderId(headerId) === false) {
            let index = 1
            while (tryToRegisterHeaderId(headerId + '-' + index) === false) index++
            headerId = headerId + '-' + index
        }
        return headerId
    }
    
    //init artical
    useEffect(() => {
        function getArticalElements(content: React.ReactChild): React.ReactChild {
            if (typeof content === 'string' || typeof content === 'number') {
                return content
            }
    
            //这里递归处理content.props.children
            const { children } = content.props
            const { type } = content
            const kids = React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return getArticalElements(child)
                } else {
                    return child
                }
            })
    
            //这里定义如何处理输入的组件
            switch (type) {
                case Header:
                    const { size, title } = content.props
                    const headerId = handleDuplicateHeaderId(title)
                    const href = '#/?id=' + headerId
    
                    return (
                        <DocsifyHeaderLink
                            size={size}
                            href={href}
                            headerId={headerId}
                            title={title}
                            children={kids} />
                    )
                case Code:
                    return (
                        <Code children={kids[0]} />
                    )
                default:
                    return (
                        React.cloneElement(
                            content,
                            content.props,
                            kids
                        )
                    )
            }
    
        }        
        console.log('init artical then setAriticalPart')
        setArticalPart(getArticalElements(children))
    }, [])

    //init or update nav part
    useEffect(() => {
        function getHrefByTitleFromHeaderState(title: string): [string, boolean] {
            let isActive: boolean = false
            let headerId: string = title
            let hrefHash: string = '#'
    
            if (headerState[headerId] === undefined) {
                hrefHash = '#'
            } else if (headerState[headerId].haveUsed === false) {
                // console.log('@@state[_href] first meet')
                headerState[headerId].haveUsed = true
                isActive = headerState[headerId].isFoucus
                hrefHash = '#/?id=' + encodeURI(headerId)
            } else {
                //handle same href here
                let _index: number = 1
                while (headerState[headerId + '-' + _index] !== undefined && headerState[headerId + '-' + _index].haveUsed === true) {
                    _index++
                }
                if (headerState[headerId + '-' + _index] === undefined) {
                    // console.log('@@state[_href+-+_index]===undefined')
                    hrefHash = '#'
                } else {
                    // console.log('@@successful')
                    headerId = headerId + '-' + _index
                    hrefHash = '#?id=' + encodeURI(headerId)
                    headerState[headerId].haveUsed = true
                    isActive = headerState[headerId].isFoucus
                }
            }
            return [hrefHash, isActive]
        }
        function getNavElement(floor: number, content: React.ReactChild): [React.ReactElement | null, boolean] {
            if (floor > maxShownNavChildren || floor > 5) return [null, false]
            if (typeof content === 'string' || typeof content === 'number') return [null, false]
    
            const { type } = content
            const { children } = content.props
            let shouldHidden: boolean = wrap
    
            const kids = React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === Header) {
                    const [element, isActive] = getNavElement(floor + 1, child)
                    shouldHidden = shouldHidden && !isActive
                    return element
                }
                return undefined
            })
    
            switch (type) {
                case Header:
                    //according to title find the value of _href from state
                    const { title } = content.props
                    let [hrefHash, isActive] = getHrefByTitleFromHeaderState(title)
    
                    //according to is having children return different components
                    return (
                        [<>
                            <DocsifyNavLink
                                isActive={isActive}
                                href={hrefHash}
                                level={floor}
                                title={title}
                            />
                            {(kids === undefined || kids === null) || <DocsifyNavFrame
                                hidden={shouldHidden && !isActive}
                                children={kids}
                            />}
                        </>, isActive || !shouldHidden]
                    )
                default:
                    return (
                        [<>{kids}</>, !shouldHidden]
                    )
    
            }
        }
        console.log('init or update nav part')
        Object.getOwnPropertyNames(headerState).forEach((i) => {
            headerState[i].haveUsed = false
        })
        setNavBarPart(getNavElement(0, children)[0])
    }, [headerState])

    /*
    Note: link highlighting in the navigation bar is not handled here, 
    but only scrolling to the corresponding position. When the hash in the address bar changes.
    Using useLayoutEffect instead of useEffect,
    because it need to be fired after all DOM mutations.(document.getElementById is used internally)
    */
    useEffect(() => {
        console.log('scrollToSpecificHeader layout effect[location]')
        const hashParamPair = getHashParamPair(location.hash)
        const idValue: string | undefined = hashParamPair.id

        scrollToSpecificHeader(idValue)        
    },[location])

    // issue here
    // useScroll(window, throtting(handleScroll, 200, 100))

    // useResize(window, deBouncing(updateHashOffset, 1000))

    // useResize(window, throtting(handleResize, 400, 300))

    console.log('@')

    return (
        <div className='Docsify'>
            <NavToggleButton onClick={switchNavCloseState} close={navCloseState} />

            <div
                className={'Docsify-sider ' + (navCloseState ? 'Docsify-sider-close' : '')}>
                <div className='Docsify-sider-nav'>
                    <ul>{navBarPart}</ul>
                </div>
            </div>

            <div className={'Docsify-content ' + (navCloseState ? 'Docsify-content-close' : '')}>
                <div className="Docsify-content-artical">
                    {articalPart}
                </div>
            </div>
        </div>
    )
}
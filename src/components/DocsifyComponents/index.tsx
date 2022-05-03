import { configConsumerProps } from 'antd/lib/config-provider'
import { resolve } from 'node:path/win32'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'


import deBouncing from '../../utils/deBoucing'
import getHashParamPair from '../../utils/getHashParamPair'
import useResize from '../../utils/hooks/useResize'
import useScroll from '../../utils/hooks/useScroll'
import { getSpecificHeaderOffsetTop, scrollToSpecificHeader } from '../../utils/scrollToSpecificHeader'
import throtting from '../../utils/throtting'
import Code from './Code'
import DocsifyHeaderLink from './DocsifyHeaderLink'
import DocsifyNavFrame from './DocsifyNavFrame'
import DocsifyNavLink from './DocsifyNavLink'
import { Header } from './Header'
import './index.css'
import NavToggleButton from './NavToggleButton'

const customScrollTime = 1000

interface HeaderStateType {
    headerId: string,
    isFoucus: boolean,
    haveUsed: boolean,
    headerSubLevel: number
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
    const [headerStateArray, setHeaderStateArray] = useState<Array<HeaderStateType>>([])
    const [articalPart, setArticalPart] = useState<React.ReactChild>()
    const [navBarPart, setNavBarPart] = useState<React.ReactElement | null>()
    const browserWidth = useRef(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
    const [navCloseState, setNavCloseState] = useState(false)
    const navLinkGroup = useRef<Array<HTMLAnchorElement>>()
    let needHandleScroll = useRef(true)
    let currentHignlightHeaderStateIndex = useRef<number | null>(null)
    let needHandleScrollTimer = useRef<NodeJS.Timeout | null>(null)



    function getHeaderStateIndexByHeaderId(headerId: string): number {
        for (let i = 0; i < headerStateArray.length; i++) {
            if (headerStateArray[i].headerId === headerId) {
                return i
            }
        }
        return -1
    }

    //Do not setState here,header id is not encoded    
    function tryToRegisterHeaderId(headerId: string, headerSubLevel: number): boolean {
        const isExist = getHeaderStateIndexByHeaderId(headerId)
        if (isExist !== -1) {
            return false
        } else {
            headerStateArray.push({ headerId: headerId, isFoucus: false, haveUsed: false, headerSubLevel: headerSubLevel })
            return true
        }
    }

    function switchNavCloseState() {
        setNavCloseState(!navCloseState)
        needHandleScroll.current = false
    }

    function handleDuplicateHeaderId(title: string, headerSubLevel: number): string {
        let headerId: string = title
        if (tryToRegisterHeaderId(headerId, headerSubLevel) === false) {
            let index: number = 1
            do {
                headerId = title + '-' + index
                index++
            } while (tryToRegisterHeaderId(headerId, headerSubLevel) === false)
        }
        return headerId
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

    function updateHeaderStateArrayByIndex(headerStateIndex: number) {
        if (headerStateIndex < 0 || headerStateIndex >= headerStateArray.length) return
        let newState = [...headerStateArray]
        if (currentHignlightHeaderStateIndex.current !== null && newState[currentHignlightHeaderStateIndex.current] !== undefined) {
            newState[currentHignlightHeaderStateIndex.current].isFoucus = false
        }
        newState[headerStateIndex].isFoucus = true
        currentHignlightHeaderStateIndex.current = headerStateIndex
        setHeaderStateArray(newState)
    }

    function updateHeaderStateArrayByHeaderId(headerId: string) {
        const headerStateIndex = getHeaderStateIndexByHeaderId(headerId)
        if (headerStateIndex === -1) return
        updateHeaderStateArrayByIndex(headerStateIndex)
    }

    function updateHeaderStateArrayByUrlHash() {
        const headerId: string | undefined = getHashParamPair(location.hash).id
        if (headerId === undefined) return
        updateHeaderStateArrayByHeaderId(headerId)
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

    function handleScroll() {
        if (needHandleScroll.current === false) return
        if (currentHignlightHeaderStateIndex.current === null) currentHignlightHeaderStateIndex.current = 0
        console.log('f handleScroll')
        const windowOffsetTop = window.scrollY
        const currentHighLightHeaderOffsetTop = getSpecificHeaderOffsetTop(headerStateArray[currentHignlightHeaderStateIndex.current].headerId)
        console.log('windowOffsetTop')
        console.log(windowOffsetTop)
        console.log('currentHighLightHeaderOffsetTop')
        console.log(currentHighLightHeaderOffsetTop)
        console.log('currentHignlightHeaderStateIndex')
        console.log(currentHignlightHeaderStateIndex.current)
        if (currentHighLightHeaderOffsetTop === null) return
        if (windowOffsetTop < currentHighLightHeaderOffsetTop) {
            for (let i = currentHignlightHeaderStateIndex.current - 1; i >= 0; i--) {
                const offsetTop = getSpecificHeaderOffsetTop(headerStateArray[i].headerId)
                if (offsetTop === null) continue
                if (windowOffsetTop >= offsetTop) {
                    updateHeaderStateArrayByIndex(i)
                    return
                }
            }
            updateHeaderStateArrayByIndex(0)
        } else {
            for (let i = currentHignlightHeaderStateIndex.current + 1; i < headerStateArray.length; i++) {
                const offsetTop = getSpecificHeaderOffsetTop(headerStateArray[i].headerId)
                if (offsetTop === null) continue
                if (windowOffsetTop < offsetTop) {
                    updateHeaderStateArrayByIndex(i - 1)
                    return
                }
            }
            updateHeaderStateArrayByIndex(headerStateArray.length - 1)
        }
    }

    //init artical
    useEffect(() => {
        function getArticalElements(content: React.ReactChild, headerSubLevel: number): React.ReactChild {
            if (typeof content === 'string' || typeof content === 'number') {
                return content
            }

            const { type } = content
            const { children } = content.props

            //这里定义如何处理输入的组件
            switch (type) {
                case Header:
                    const { size, title } = content.props
                    const headerId = handleDuplicateHeaderId(title, headerSubLevel)
                    const href = '#/?id=' + headerId

                    //这里递归处理content.props.children


                    const headerKids = React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return getArticalElements(child, headerSubLevel + 1)
                        } else {
                            return child
                        }
                    })

                    return (
                        <DocsifyHeaderLink
                            size={size}
                            href={href}
                            headerId={headerId}
                            title={title}
                            children={headerKids} />
                    )
                case Code:

                    //这里递归处理content.props.children
                    const codeKids = React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return getArticalElements(child, headerSubLevel)
                        } else {
                            return child
                        }
                    })

                    return (
                        <Code
                            style={content.props.style}
                            children={codeKids[0]} />
                    )
                default:

                    //这里递归处理content.props.children
                    const kids = React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return getArticalElements(child, headerSubLevel)
                        } else {
                            return child
                        }
                    })

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
        setArticalPart(getArticalElements(children, 1))
    }, [])

    //init or update nav part
    useEffect(() => {
        function getHrefByTitleFromHeaderState(title: string): [string, boolean] {
            let isActive: boolean = false
            let headerId: string = title
            let hrefHash: string = '#'
            const headerStateIndex = getHeaderStateIndexByHeaderId(headerId)

            if (headerStateIndex === -1) {
                hrefHash = '#'
            } else if (headerStateArray[headerStateIndex].haveUsed === false) {
                // console.log('@@state[_href] first meet')
                headerStateArray[headerStateIndex].haveUsed = true
                isActive = headerStateArray[headerStateIndex].isFoucus
                hrefHash = '#/?id=' + encodeURI(headerId)
            } else {
                //handle same href here
                let _index: number = 1
                let newHeaderId: string
                let newHeaderStateIndex: number
                do {
                    newHeaderId = headerId + '-' + _index
                    newHeaderStateIndex = getHeaderStateIndexByHeaderId(newHeaderId)
                    _index++
                } while (newHeaderStateIndex !== -1 && headerStateArray[newHeaderStateIndex].haveUsed === true)

                if (headerStateArray[newHeaderStateIndex] === undefined) {
                    // console.log('@@state[_href+-+_index]===undefined')
                    hrefHash = '#'
                } else {
                    // console.log('@@successful')
                    hrefHash = '#?id=' + encodeURI(newHeaderId)
                    headerStateArray[newHeaderStateIndex].haveUsed = true
                    isActive = headerStateArray[newHeaderStateIndex].isFoucus
                }
            }
            return [hrefHash, isActive]
        }
        function getNavElement(subNavLinkLevel: number, content: React.ReactChild): [React.ReactElement | null, boolean] {
            // if (floor > maxShownNavChildren || floor > 5) return [null, false]
            if (typeof content === 'string' || typeof content === 'number') return [null, false]

            const { type } = content
            const { children } = content.props
            let shouldHidden: boolean = wrap

            switch (type) {
                case Header:
                    //according to title find the value of _href from state
                    const { title } = content.props
                    let [hrefHash, isActive] = getHrefByTitleFromHeaderState(title)

                    const headerKids = React.Children.map(children, child => {
                        if (React.isValidElement(child) && child.type === Header) {
                            const [element, isActive] = getNavElement(subNavLinkLevel + 1, child)
                            shouldHidden = shouldHidden && !isActive
                            return element
                        }
                        return undefined
                    })

                    //according to is having children return different components
                    return (
                        [<>
                            <DocsifyNavLink
                                isActive={isActive}
                                href={hrefHash}
                                level={subNavLinkLevel}
                                title={title}
                            />
                            {(headerKids === undefined || headerKids === null) || <DocsifyNavFrame
                                hidden={shouldHidden && !isActive}
                                children={headerKids}
                            />}
                        </>, isActive || !shouldHidden]
                    )
                default:
                    const kids = React.Children.map(children, child => {
                        if (React.isValidElement(child) && child.type === Header) {
                            const [element, isActive] = getNavElement(subNavLinkLevel + 1, child)
                            shouldHidden = shouldHidden && !isActive
                            return element
                        }
                        return undefined
                    })

                    return (
                        [<>{kids}</>, !shouldHidden]
                    )

            }
        }
        console.log('init or update nav part')
        for (let i = 0; i < headerStateArray.length; i++) {
            headerStateArray[i].haveUsed = false
        }

        setNavBarPart(getNavElement(0, children)[0])
    }, [articalPart, headerStateArray])

    /*
    Note: link highlighting in the navigation bar is not handled here, 
    but only scrolling to the corresponding position. When the hash in the address bar changes.
    Using useLayoutEffect instead of useEffect,
    because it need to be fired after all DOM mutations.(document.getElementById is used internally)
    */
    useEffect(() => {
        console.log('scrollToSpecificHeader effect[location]')
        const hashParamPair = getHashParamPair(location.hash)
        const headerId: string | undefined = hashParamPair.id

        updateHeaderStateArrayByUrlHash()

        needHandleScroll.current = false
        scrollToSpecificHeader(headerId)

        if (needHandleScrollTimer.current !== null) clearTimeout(needHandleScrollTimer.current)
        needHandleScrollTimer.current = setTimeout(() => {
            needHandleScroll.current = true
        }, customScrollTime)

    }, [location])

    useScroll(throtting(handleScroll, 200, 100))

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
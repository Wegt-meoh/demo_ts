import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'


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
    title: string
    headerId: string,
    isFoucus: boolean,
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
        minContentWidth = 900,
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
    function tryToRegisterHeaderId(title: string, headerId: string, headerSubLevel: number): boolean {
        const isExist = getHeaderStateIndexByHeaderId(headerId)
        if (isExist !== -1) {
            return false
        } else {
            headerStateArray.push({
                title: title,
                headerId: headerId,
                isFoucus: false,
                headerSubLevel: headerSubLevel
            })
            return true
        }
    }

    function switchNavCloseState() {
        setNavCloseState(!navCloseState)
        needHandleScroll.current = false
    }

    function handleDuplicateHeaderId(title: string, headerSubLevel: number): string {
        let headerId: string = title
        if (tryToRegisterHeaderId(title, headerId, headerSubLevel) === false) {
            let index: number = 1
            do {
                headerId = title + '-' + index
                index++
            } while (tryToRegisterHeaderId(title, headerId, headerSubLevel) === false)
        }
        return headerId
    }

    function smoothScrollTo(begin: number, end: number, during: number) {
        const framesPerSecond = 10
        const times: number = framesPerSecond * during / 1000
        const step: number = (end - begin) / times
        let counter: number = 0
        const interval = during / times
        const timerOut = () => {
            setTimeout(() => {
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

        const windowOffsetTop = window.scrollY
        const currentHighLightHeaderOffsetTop = getSpecificHeaderOffsetTop(headerStateArray[currentHignlightHeaderStateIndex.current].headerId)
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

        setArticalPart(getArticalElements(children, 1))
    }, [])

    //init or update nav part
    useEffect(() => {
        let headerStateArrayIndex: number = 0

        function getNavPartByHeaderStateArray(): React.ReactElement[] | null {
            if (headerStateArrayIndex >= headerStateArray.length) return null

            const currentHeaderLevel = headerStateArray[headerStateArrayIndex].headerSubLevel
            let sameLevelNavGroup = []

            do {
                const nextHeaderState = headerStateArray[headerStateArrayIndex]

                if (nextHeaderState.headerSubLevel === currentHeaderLevel) {
                    sameLevelNavGroup.push(
                        <DocsifyNavLink
                            isActive={headerStateArray[headerStateArrayIndex].isFoucus}
                            href={'#/?id=' + headerStateArray[headerStateArrayIndex].headerId}
                            title={headerStateArray[headerStateArrayIndex].title}
                            fontBold={false}
                        />
                    )
                    headerStateArrayIndex++
                } else if (nextHeaderState.headerSubLevel > currentHeaderLevel) {
                    sameLevelNavGroup.push(
                        <DocsifyNavFrame hidden={false} children={getNavPartByHeaderStateArray()} />
                    )
                }
            } while (headerStateArrayIndex < headerStateArray.length && headerStateArray[headerStateArrayIndex].headerSubLevel >= currentHeaderLevel)

            return React.Children.map(sameLevelNavGroup, i => i)
        }

        setNavBarPart(<DocsifyNavFrame hidden={false} children={getNavPartByHeaderStateArray()} />)
    }, [headerStateArray])

    useEffect(() => {
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

    useResize(throtting(handleResize, 800, 400))

    console.log('@')

    return (
        <div className='Docsify'>
            <NavToggleButton onClick={switchNavCloseState} close={navCloseState} />

            <div
                className={'Docsify-sider ' + (navCloseState ? 'Docsify-sider-close' : '')}>
                <div className='Docsify-sider-nav'>
                    {navBarPart}
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
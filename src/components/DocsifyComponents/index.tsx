import { type } from 'os'
import React, { ReactFragment, ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface DocsfyHeaderLinkProps extends Header {
    size: 'h1' | 'h2' | 'h3',
    register: Function,
    state: any,
    children?: JSX.Element
}

export function DocsfyHeaderLink({ children, size, title, register, state }: DocsfyHeaderLinkProps) {
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

export function H1({ title }: Header) {
    return (<></>)
}
export function H2({ title }: Header) {
    return (<></>)
}
export function H3({ title }: Header) {
    return (<></>)
}

interface CheckHashHref {
    [index: string]: boolean
}

interface DocsifyContainerProps {
    children: JSX.Element
}
interface DocsifyElemet extends JSX.Element{
    type:'h1'|'h2'
}

export function DocsifyContainer({ children }: DocsifyContainerProps) {
    let [state, setState] = useState<CheckHashHref>({})
    let hashId = useLocation()

    let registerLinkState = (linkHash: string) => {
        //you need to ensure the linkHash(param) is not repeative in state
        state[linkHash] = false
    }

    function getNavElements(children:JSX.Element):JSX.Element{

        let stack=[]
        let _c=children
        

        let chi=<DocsfyHeaderLink size={'h1'} register={registerLinkState} state={undefined} title={''}/>
        let res=<ul children={[<></>,<></>]}/>

        let _children=children.props.children
        return res
    }
    // console.log(getNavElements(children))
    function getArticalElements(children:JSX.Element){

    }
    function dfs(children: JSX.Element) {
        if(children===undefined){
            console.log('children is undefined')
        }else if (Array.isArray(children)) {
            for (let i in children) {
                dfs(children[i])
            }
        } else {
            console.log('children', children)
            if (children.type !== undefined) {
                switch (children.type) {
                    case H3:
                        console.log('type h3');
                        break;
                    case H2:
                        console.log('type h2');
                        break;
                    case H1:
                        console.log('type h1');
                        break;
                    case 'p':
                        console.log('type p');
                        break;
                    case React.Fragment:
                        console.log('type react fragment')
                        break;
                    default:
                        if(typeof children.type==='string'){
                            console.log('type',children.type)
                        }else{
                            console.log('type is not string then typeof is',typeof children.type)
                        }
                }
            } else {
                console.log('no type then typeof is', typeof children)
            }
            if (children.props !== undefined) {
                dfs(children.props.children)
            }
        }
    }

    dfs(children)

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

                </div>
            </div>
        </div>
    )
}

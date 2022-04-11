import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { DocsfyHeaderLink, DocsifyLink } from '../../components/DocsifyComponents'


import './index.css'

export default function ReviewForCollegeClass() {

  interface CheckHashHref {
    [index: string]: boolean
  }

  let [state, setState] = useState<CheckHashHref>({})
  let hashId = useLocation()

  let registerLinkState = (linkHash: string) => {
    state[linkHash]=false
  }

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
  useEffect(() => {
    linkHighlight(hashId.hash)
  }, [hashId.hash])



  return (
    <div className='ReviewForCollegeClass'>
      <div className='ReviewForCollegeClass-sider'>
        <div className='ReviewForCollegeClass-sider-nav'>
          <ul>
            <DocsifyLink
              className={state[encodeURI('#html')] ? 'ReviewForCollegeClass-sider-nav-li-active' : ''}>
              html
            </DocsifyLink>
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
          <DocsfyHeaderLink size='h1' register={registerLinkState} state={state}>
            html
          </DocsfyHeaderLink>
          <DocsfyHeaderLink size='h2' register={registerLinkState} state={state}>
            a标签
          </DocsfyHeaderLink>
          <p>sdfdsafasfdasfas</p>
          <DocsfyHeaderLink size='h2' register={registerLinkState} state={state}>
            h1标签
          </DocsfyHeaderLink>
          <DocsfyHeaderLink size='h2' register={registerLinkState} state={state}>
            h1标签
          </DocsfyHeaderLink>
          <DocsfyHeaderLink size='h2' register={registerLinkState} state={state}>
            html
          </DocsfyHeaderLink>
          <p>safdsafadsfasfasdfgfdagfdg</p>
        </div>
      </div>
    </div>
  )
}

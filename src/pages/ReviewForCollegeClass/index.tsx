import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Button } from 'antd'

import { DocsfyHeaderLink, DocsifyLink } from '../../components/DocsifyComponents'


import './index.css'

export default function ReviewForCollegeClass() {

  interface CheckHashHref {
    [index: string]: boolean
  }

  let [state, setState] = useState<CheckHashHref>({})
  let hashId = useLocation()

  let registerLinkState = (linkHash: string) => {
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
          <DocsfyHeaderLink title='html' size='h1' register={registerLinkState} state={state}>
            <DocsfyHeaderLink title='a标签' size='h2' register={registerLinkState} state={state} >
              <DocsfyHeaderLink title='a标签' size='h3' register={registerLinkState} state={state}>
                <p>sdkjf</p>
              </DocsfyHeaderLink>
            </DocsfyHeaderLink>
          </DocsfyHeaderLink>
          <DocsfyHeaderLink title='typescript' size='h1' register={registerLinkState} state={state}>
            <DocsfyHeaderLink title='type' size='h2' register={registerLinkState} state={state}>
              <p>asjdlkfj</p>
            </DocsfyHeaderLink>
          </DocsfyHeaderLink>
          <DocsfyHeaderLink title='h1标签' size='h1' register={registerLinkState} state={state} />
          <DocsfyHeaderLink title='html' size='h2' register={registerLinkState} state={state} />
          <p>safdsafadsfasfasdfgfdagfdg</p>
        </div>
      </div>
    </div>
  )
}

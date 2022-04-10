import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'



import './index.css'

export default function ReviewForCollegeClass() {

  interface CheckHashHref{
    [index:string]:boolean
  }

  let [state,setState]=useState<CheckHashHref>({'#html':false,'#a标签':false,'#h1标签':false})
  let hashId=useLocation()
  useEffect(()=>{
    let hash=decodeURI(hashId.hash)
    if(hash==='') return;
    let newState={...state} 
    for(let i in newState){
      if(i!==hash){
        newState[i]=false
      }else{
        newState[i]=true
      }
    }
    setState({...newState})
  },[hashId.hash])

  return (
    <div className='ReviewForCollegeClass'>
      <div className='ReviewForCollegeClass-sider'>
        <div className='ReviewForCollegeClass-sider-nav'>
          <ul>
            <li className={state['#html']?'ReviewForCollegeClass-sider-nav-li-active':''}>
              <a href="#html">html</a>
            </li>
            <ul>
              <li className={state['#a标签']?'ReviewForCollegeClass-sider-nav-li-active':''}>
                <a href="#a标签">a标签</a>
              </li>
              <li className={state['#h1标签']?'ReviewForCollegeClass-sider-nav-li-active':''}>
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
          <h1 id='html'>
            <a href="#html">
              html
            </a>
          </h1>
          <h2 id='a标签'>
            <a href="#a标签">
              a标签
            </a>
          </h2>
          <p>sdfdsafasfdasfas</p>
          <h2 id='h1标签'>
            <a href="#h1标签">
              h1标签
            </a>
          </h2>
          <p>safdsafadsfasfasdfgfdagfdg</p>
        </div>
      </div>
    </div>
  )
}

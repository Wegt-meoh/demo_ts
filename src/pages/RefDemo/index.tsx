import React, { useRef } from 'react'

export default function RefDemo() {
    const inputText=useRef<HTMLInputElement>(null)

  return (
    <div style={{width:'200px',margin:'10px auto'}}>
        <input ref={inputText} type="text" />
        <button onClick={()=>{
            if(inputText.current===null) return
            inputText.current.focus()
        }}>focus</button>
    </div>
  )
}

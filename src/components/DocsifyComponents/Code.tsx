import { CSSProperties } from "react"

interface CodeProps {
    children: string
    style?:CSSProperties
}

export default function Code({ children ,style}: CodeProps) {
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
        <p style={style}>
            {children}
        </p>
    )
}
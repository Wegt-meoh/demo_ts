interface CodeProps {
    children: string
}

export default function Code({ children }: CodeProps) {
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
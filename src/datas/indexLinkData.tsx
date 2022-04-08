 interface IndexLinkData{
    destination:string
    showText:string
}

let dataList:Array<IndexLinkData>=[
    {destination:'www.baidu.com',showText:'baidu'},
    {destination:'www.bilibili.com',showText:'bilibili'},
]

function getAllLink():Array<IndexLinkData>{
    return dataList
}

export {type IndexLinkData,getAllLink}
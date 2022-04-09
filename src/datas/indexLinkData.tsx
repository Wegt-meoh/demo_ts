 interface IndexLinkData{
    id:string
    destination:string
    showText:string
}

let dataList:Array<IndexLinkData>=[
    {id:'4',destination:'/app/rgba2hex',showText:'rgb to hex'},
    {id:'6',destination:'/app/recommendBooks',showText:'推荐书单'}    
]

function getAllLink():Array<IndexLinkData>{
    return dataList
}

export {type IndexLinkData,getAllLink}
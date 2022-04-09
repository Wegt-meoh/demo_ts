 interface IndexLinkData{
    id:string
    destination:string
    showText:string
}

let dataList:Array<IndexLinkData>=[
    {id:'3',destination:'/app/konwlageRespository',showText:'konwlageRespository知识树'},
    {id:'4',destination:'/app/rgba2hex',showText:'rgb to hex'},
    {id:'5',destination:'/app/ReviewForCollageClass',showText:'review for collage class'},
    {id:'6',destination:'/app/recommendBooks',showText:'推荐书单'}    
]

function getAllLink():Array<IndexLinkData>{
    return dataList
}

export {type IndexLinkData,getAllLink}
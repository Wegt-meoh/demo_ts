 interface IndexLinkData{
    id:string
    destination:string
    showText:string
}

let dataList:Array<IndexLinkData>=[
    {id:'1',destination:'/app/reviewForCollegeClass',showText:'review for college class'},
    {id:'4',destination:'/app/rgba2hex',showText:'rgb to hex'},
    {id:'6',destination:'/app/recommendBooks',showText:'推荐书单'},
    {id:'7',destination:'/app/know ',showText:'know'},       
]

function getAllLink():Array<IndexLinkData>{
    return dataList
}

export {type IndexLinkData,getAllLink}
function scrollToSpecificHeader(headerId: string) {
    const tagetOffsetTop=getSpecificHeaderOffsetTop(headerId)
    if(tagetOffsetTop!==null){
        window.scrollTo(0,tagetOffsetTop)
    }
}

function getSpecificHeaderOffsetTop(headerId: string): number | null {
    const headerElement = document.getElementById(headerId)
    if (headerElement !== null) {
        let headerOffsetTop:number=headerElement.offsetTop
        let parent=headerElement.parentElement   
        let paddingTop:number
        while(parent!==null){
            paddingTop=parent.offsetTop
            headerOffsetTop+=paddingTop
            parent=parent.parentElement
        }                      
        return headerOffsetTop
    } else {
        return null
    }
}

export { scrollToSpecificHeader, getSpecificHeaderOffsetTop }
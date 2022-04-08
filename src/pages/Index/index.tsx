import React from 'react'
import { Link } from 'react-router-dom'
import { IndexLinkData, getAllLink } from '../../datas/indexLinkData'

import './index.css'

export default function Index() {
    let linkData = getAllLink()
    return (
        <div className='Index'>
            <div className="header">
                <h2>Welcome to lasting website</h2>
            </div>
            <div className='content'>
                {linkData.map((i) => { return (IndexApp(i)) })}
            </div>
            <footer>
                <div>任何意见建议请联系：<span style={{ textDecoration: 'underline', color: 'rgb(160, 81, 11)' }}>lastingcoder@qq.com</span></div>
                <div>本站建立于：2022.01.31</div>
                <div>备案/许可证编号为：<a href="http://beian.miit.gov.cn/">浙ICP备2022003490号</a></div>
            </footer>
        </div>
    )
}

function IndexApp(props: IndexLinkData) {
    const { destination, showText } = props

    return (
        <Link to={destination}>{showText}</Link>
    )
}

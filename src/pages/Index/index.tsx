import React from 'react'
import { Layout } from 'antd';
import { Link } from 'react-router-dom'
import { IndexLinkData, getAllLink } from '../../datas/indexLinkData'
import './index.css'
import axios from 'axios';
const { Header, Footer, Content } = Layout;

export default function Index() {
    let linkData = getAllLink()
      
    return (
        <Layout className='Index'>
            <Header className='header'>
                <h2>Welcome to lasting website</h2>
            </Header>
            <Content className='content'>
                <a target='_blank' rel='noreferrer' href='http://localhost:3000'>review</a>
                {linkData.map((i) => { return (IndexApp(i)) })}
            </Content>
            <Footer className='footer'>
                <div>任何意见建议请联系：<span style={{ textDecoration: 'underline', color: 'rgb(160, 81, 11)' }}>lastingcoder@qq.com</span></div>
                <div>本站建立于：2022.01.31</div>
                <div>备案/许可证编号为：<a href="http://beian.miit.gov.cn/">浙ICP备2022003490号</a></div>
            </Footer>
        </Layout>

    )
}

function IndexApp(props: IndexLinkData) {
    const { id, destination, showText } = props

    return (
        <Link key={id} to={destination}>{showText}</Link>
    )
}

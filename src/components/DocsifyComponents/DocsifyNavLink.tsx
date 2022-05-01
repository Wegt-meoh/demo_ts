interface DocsifyNavLinkProps {
    isActive: boolean
    href: string  // 指向某一个锚点的地址
    title: string // 展示给用户的内容
    location: string
    style?: React.CSSProperties
    level: number
}

export default function DocsifyNavLink(props: DocsifyNavLinkProps) {
    const {
        isActive,
        href,
        title,
        style,
        level,
        location,
        ...res
    } = props

    let className = isActive ? 'Docsify-sider-nav-li-active' : ''
    if (level === 1) className += ' boldFontWeight'
    else className += ' normalFontWeight'

    const targetId = href

    function handleClick() {
        document.getElementById(targetId)?.scrollIntoView({
            behavior: 'auto',
            block: 'start'
        })
    }

    return (
        <li className={className} {...res}>
            <a href={href} title={title} style={style}>{title}</a>
        </li>
    )
}
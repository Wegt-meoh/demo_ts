interface DocsifyNavLinkProps {
    isActive: boolean
    href: string  // 指向某一个锚点的地址
    title: string // 展示给用户的内容
    style?: React.CSSProperties
    fontBold: boolean
}

export default function DocsifyNavLink(props: DocsifyNavLinkProps) {
    const {
        isActive,
        href,
        title,
        style,
        fontBold,
        ...res
    } = props

    const classNameArray: Array<string> = []

    if (isActive) classNameArray.push('Docsify-sider-nav-li-active')
    if (fontBold || isActive) classNameArray.push('boldFontWeight')
    else classNameArray.push('normalFontWeight')

    const targetId = href

    function handleClick() {
        document.getElementById(targetId)?.scrollIntoView({
            behavior: 'auto',
            block: 'start'
        })
    }

    return (
        <li className={classNameArray.join(' ')} {...res}>
            <a href={href} title={title} style={style}>{title}</a>
        </li>
    )
}
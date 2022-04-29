type HeaderSize = 'h1' | 'h2' | 'h3'

export interface HeaderProps {
    size?: HeaderSize
    title: string
    children?: React.ReactChild | null | React.ReactChild[]
}

export function Header(props: HeaderProps) {
    return null
}
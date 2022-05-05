interface DocsifyNavFrameProps {
    hidden: boolean
    children: React.ReactElement | React.ReactElement[] | null | undefined
}

export default function DocsifyNavFrame({ children, hidden }: DocsifyNavFrameProps) {
    return <ul hidden={hidden} children={children} />
}
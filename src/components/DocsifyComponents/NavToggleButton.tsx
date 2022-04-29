interface NavToggleButtonProps extends React.ButtonHTMLAttributes<any> {
    close: boolean
}

export default function NavToggleButton(props: NavToggleButtonProps) {
    const {
        onClick,
        close,
        ...res
    } = props

    return (
        <button
            onClick={onClick}
            className={'Docsify-sider-toggle ' + (close ? 'Docsify-sider-toggle-close' : '')}
            {...res}
        >
            <div>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </button>
    )
}
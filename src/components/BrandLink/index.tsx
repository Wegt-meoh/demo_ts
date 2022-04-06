import { Link, LinkProps, useSearchParams } from "react-router-dom"

interface BrandLinkProps extends Omit<LinkProps, 'to'> {
    brand: string
}

export default function BrandLink({ brand, style, ...props }: BrandLinkProps) {
    let [searchParams] = useSearchParams()
    let isActive: boolean = searchParams.get('brand') === brand

    return (
        <Link
            to={'/shower?brand=' + brand}
            style={{ color: isActive ? 'red' : 'black', ...style }}
            {...props}
        />
    )
}
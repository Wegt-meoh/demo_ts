export interface invoice {
    id: string,
    brand: string,
    number: number,
}

let dataList: invoice[] = [
    {
        id: '16ye',
        brand: 'nike',
        number: 1892
    },
    {
        id: 'uie21',
        brand: 'fake',
        number: 3782
    },
    {
        id: 'sfsjs23',
        brand: 'tebu',
        number: 3262
    },
    {
        id: 'sfjs234',
        brand: 'hhsd',
        number: 3717
    },
    {
        id: 'sf234sdf',
        brand: 's23d',
        number: 8888
    },
]

export function getInvoices(): invoice[] {
    return dataList
}

export function getInvoiceById(id: string): invoice |undefined{
    return dataList.find((i: invoice) => {
        return i.id === id
    })
}

export function getInvoicesByBrand(brand: string | null | undefined) {
    if (brand === null || brand === undefined || brand==='all') {
        return getInvoices()
    } else {
        return dataList.filter((i) => {
            return i.brand === brand
        })
    }
}

export let brands: string[] = function () {
    let res:string[] = []
    dataList.forEach((i) => {
        res.push(i.brand)
    })
    return res
}()
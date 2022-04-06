import React from 'react'
import './index.css'
import Invoice from '../../components/Invoice'
import { type invoice, brands, getInvoicesByBrand } from '../../datas/invoices'
import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import BrandLink from '../../components/BrandLink'

export default function Shower() {
  
  return (
    <div className='shower'>
      <LinkGroup />
      <hr />
      <LinkShow/>
    </div>
  )
}

function LinkGroup() {

  return (
    <div className='linkGroup'>
      {
        <BrandLink
          key='all'
          style={{ display: 'block', marginBottom: '4px' }}
          brand='all'>all</BrandLink>
      }
      {
        brands.map((i: string) => {
          return <BrandLink
            key={i}
            style={{ display: 'block', marginBottom: '4px' }}
            brand={i}>{i}</BrandLink>
        })
      }
    </div>
  )
}

function LinkShow() {
  let [searchParams]=useSearchParams()
  let content:invoice[]=useMemo(()=>{
    let brand=searchParams.get('brand')
    return getInvoicesByBrand(brand)
  },[searchParams])

  return (
    <div>
      {
        content.map((i)=>{
          return <Invoice key={i.id} {...i}/>
        })
      }
    </div>
  )
}
